import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../../lib/mongodb";
import { getSession } from "../../../../../lib/session";
import { getMaterialsBucket } from "../../../../../lib/gridfs";
import Material from "../../../../../models/Material";

export const runtime = "nodejs";

// GET: any logged-in student can download a material.
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    if (session.role !== "student") {
        return NextResponse.json({ error: "Students only." }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid material." }, { status: 400 });
    }

    try {
        await connectDB();

        const material = await Material.findById(id).lean();
        if (!material) {
            return NextResponse.json({ error: "Material not found." }, { status: 404 });
        }

        const bucket = getMaterialsBucket();
        const stored = await bucket.find({ _id: material.fileId }).toArray();
        if (stored.length === 0) {
            return NextResponse.json({ error: "The file is missing." }, { status: 404 });
        }

        await Material.updateOne({ _id: id }, { $inc: { downloads: 1 } });

        const stream = Readable.toWeb(
            bucket.openDownloadStream(material.fileId)
        ) as unknown as ReadableStream;

        return new Response(stream, {
            headers: {
                "Content-Type": material.contentType || "application/octet-stream",
                "Content-Length": String(stored[0].length),
                // "attachment" makes the browser save the file instead of opening it.
                "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(material.fileName)}`,
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": "private, no-store",
            },
        });
    } catch (error) {
        console.error("Download failed:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}