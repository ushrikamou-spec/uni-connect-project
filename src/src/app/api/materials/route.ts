import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import { getSession } from "../../../lib/session";
import { getMaterialsBucket } from "../../../lib/gridfs";
import {
    MAX_FILE_BYTES,
    cleanFileName,
    escapeRegex,
    isAllowedFile,
} from "../../../lib/materials";
import User from "../../../models/User";
import Material from "../../../models/Material";

export const runtime = "nodejs";

// GET: every student can browse all uploaded materials.
export async function GET(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    if (session.role !== "student") {
        return NextResponse.json({ error: "Students only." }, { status: 403 });
    }

    try {
        await connectDB();

        const params = new URL(request.url).searchParams;
        const q = (params.get("q") ?? "").trim().slice(0, 100);
        const course = (params.get("course") ?? "").trim();

        const filter: Record<string, unknown> = {};
        if (course && course !== "all") filter.course = course.toUpperCase();
        if (q) {
            const pattern = new RegExp(escapeRegex(q), "i");
            filter.$or = [
                { title: pattern },
                { course: pattern },
                { description: pattern },
                { fileName: pattern },
            ];
        }

        const [items, courses] = await Promise.all([
            Material.find(filter).sort({ createdAt: -1 }).limit(200).lean(),
            Material.distinct("course"),
        ]);

        const uploaders = await User.find({
            _id: { $in: items.map((m) => m.uploader) },
        }).lean();
        const names = new Map(uploaders.map((u) => [String(u._id), u.name]));

        return NextResponse.json({
            courses: (courses as string[]).sort(),
            materials: items.map((m) => ({
                id: String(m._id),
                title: m.title,
                course: m.course,
                description: m.description ?? "",
                fileName: m.fileName,
                size: m.size,
                downloads: m.downloads ?? 0,
                uploadedBy: names.get(String(m.uploader)) ?? "A student",
                uploadedAt: m.createdAt,
                mine: String(m.uploader) === session.userId,
            })),
        });
    } catch (error) {
        console.error("List materials failed:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

// POST: a student uploads a file with its details.
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    if (session.role !== "student") {
        return NextResponse.json({ error: "Only students can upload." }, { status: 403 });
    }

    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
    }

    const title = String(form.get("title") ?? "").trim();
    const course = String(form.get("course") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const file = form.get("file");

    if (!title || title.length > 120) {
        return NextResponse.json({ error: "Please enter a title (up to 120 characters)." }, { status: 400 });
    }
    if (!/^[A-Za-z0-9][A-Za-z0-9 \-]{1,19}$/.test(course)) {
        return NextResponse.json({ error: "Please enter a course code, for example CSE327." }, { status: 400 });
    }
    if (description.length > 500) {
        return NextResponse.json({ error: "The description is too long (500 characters max)." }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: "Please choose a file to upload." }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: "That file is larger than 10 MB." }, { status: 413 });
    }
    if (!isAllowedFile(file.name)) {
        return NextResponse.json(
            { error: "That file type is not allowed. Use PDF, Word, PowerPoint, Excel, text, zip or an image." },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        const fileName = cleanFileName(file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        const bucket = getMaterialsBucket();

        const fileId = await new Promise<import("mongoose").Types.ObjectId>(
            (resolve, reject) => {
                const upload = bucket.openUploadStream(fileName, {
                    metadata: {
                        uploader: session.userId,
                        contentType: file.type || "application/octet-stream",
                    },
                });
                upload.on("error", reject);
                upload.on("finish", () =>
                    resolve(upload.id as import("mongoose").Types.ObjectId)
                );
                upload.end(buffer);
            }
        );

        try {
            const createdMaterial = await Material.create({
                title,
                course,
                description,
                fileName,
                contentType: file.type || "application/octet-stream",
                size: file.size,
                fileId,
                uploader: session.userId,
            });
            return NextResponse.json({ id: String(createdMaterial._id) }, { status: 201 });
        } catch (error) {
            await bucket.delete(fileId).catch(() => { }); // do not leave an orphan file
            throw error;
        }
    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
    }
}