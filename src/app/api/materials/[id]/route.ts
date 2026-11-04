import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import { getMaterialsBucket } from "../../../../lib/gridfs";
import Material from "../../../../models/Material";

export const runtime = "nodejs";

// DELETE: a student removes a file THEY uploaded.
export async function DELETE(
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

        const material = await Material.findById(id);
        if (!material) {
            return NextResponse.json({ error: "Material not found." }, { status: 404 });
        }
        if (String(material.uploader) !== session.userId) {
            return NextResponse.json(
                { error: "You can only delete your own uploads." },
                { status: 403 }
            );
        }

        await getMaterialsBucket().delete(material.fileId).catch(() => { });
        await material.deleteOne();

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Delete material failed:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}