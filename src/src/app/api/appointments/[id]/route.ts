import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import { COUNSELLOR_STATUSES, type Status } from "../../../../lib/counselling";
import Appointment from "../../../../models/appointment";

// PATCH: a counsellor approves, holds or rejects one of THEIR appointments.
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    if (session.role !== "counsellor") {
        return NextResponse.json({ error: "Counsellors only." }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid appointment." }, { status: 400 });
    }

    let body: { status?: unknown } = {};
    try {
        body = await request.json();
    } catch {
        // handled below
    }
    const status = body.status as Status;
    if (!COUNSELLOR_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    try {
        await connectDB();
        await Appointment.init();

        // Only the counsellor who owns the appointment can change it.
        const updated = await Appointment.findOneAndUpdate(
            { _id: id, counsellor: session.userId },
            { status, active: status !== "Rejected" },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
        }
        return NextResponse.json({ id, status: updated.status });
    } catch (error) {
        // Un-rejecting a slot that another student has booked since.
        if ((error as { code?: number }).code === 11000) {
            return NextResponse.json(
                { error: "Another student has booked that slot since it was rejected." },
                { status: 409 }
            );
        }
        console.error("Update appointment failed:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}