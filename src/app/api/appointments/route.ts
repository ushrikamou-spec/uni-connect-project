import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/mongodb";
import { getSession } from "../../../lib/session";
import {
    generateSlots,
    upcomingDates,
    weekdayOf,
} from "../../../lib/counselling";
import User from "../../../models/User";
import Appointment from "../../../models/appointment";

// GET: a student sees their own bookings, a counsellor sees requests for them.
export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }

    try {
        await connectDB();

        if (session.role === "student") {
            const mine = await Appointment.find({ student: session.userId })
                .sort({ date: 1, start: 1 })
                .lean();
            const counsellors = await User.find({
                _id: { $in: mine.map((a) => a.counsellor) },
            }).lean();
            const names = new Map(counsellors.map((c) => [String(c._id), c.name]));

            return NextResponse.json({
                appointments: mine.map((a) => ({
                    id: String(a._id),
                    date: a.date,
                    start: a.start,
                    end: a.end,
                    status: a.status,
                    counsellorName: names.get(String(a.counsellor)) ?? "Counsellor",
                })),
            });
        }

        if (session.role === "counsellor") {
            const requests = await Appointment.find({ counsellor: session.userId })
                .sort({ date: 1, start: 1 })
                .lean();
            const students = await User.find({
                _id: { $in: requests.map((a) => a.student) },
            }).lean();
            const byId = new Map(students.map((s) => [String(s._id), s]));

            return NextResponse.json({
                appointments: requests.map((a) => {
                    const s = byId.get(String(a.student));
                    return {
                        id: String(a._id),
                        date: a.date,
                        start: a.start,
                        end: a.end,
                        status: a.status,
                        name: s?.name ?? "Unknown student",
                        studentId: s?.universityId ?? "—",
                        department: s?.department ?? "—",
                        cgpa: typeof s?.cgpa === "number" ? s.cgpa.toFixed(2) : "—",
                    };
                }),
            });
        }

        return NextResponse.json({ error: "Not available for this role." }, { status: 403 });
    } catch (error) {
        console.error("List appointments failed:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

// POST: a student books a slot.
export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    if (session.role !== "student") {
        return NextResponse.json({ error: "Only students can book." }, { status: 403 });
    }

    let body: { counsellorId?: unknown; date?: unknown; start?: unknown } = {};
    try {
        body = await request.json();
    } catch {
        // handled by the checks below
    }

    const { counsellorId, date, start } = body;
    if (
        typeof counsellorId !== "string" ||
        typeof date !== "string" ||
        typeof start !== "string" ||
        !mongoose.isValidObjectId(counsellorId)
    ) {
        return NextResponse.json({ error: "Invalid booking request." }, { status: 400 });
    }

    try {
        await connectDB();
        await Appointment.init();

        const counsellor = await User.findOne({
            _id: counsellorId,
            role: "counsellor",
        }).lean();
        if (!counsellor || !counsellor.officeStart || !counsellor.officeEnd) {
            return NextResponse.json({ error: "Counsellor not found." }, { status: 404 });
        }

        if (!upcomingDates().includes(date)) {
            return NextResponse.json({ error: "That date is not open for booking." }, { status: 400 });
        }
        if (!(counsellor.workDays ?? []).includes(weekdayOf(date))) {
            return NextResponse.json({ error: "The counsellor is not available that day." }, { status: 400 });
        }
        const slot = generateSlots(counsellor.officeStart, counsellor.officeEnd).find(
            (s) => s.start === start
        );
        if (!slot) {
            return NextResponse.json({ error: "That time is not a valid slot." }, { status: 400 });
        }

        const clash = await Appointment.exists({
            student: session.userId,
            date,
            start: slot.start,
            active: true,
        });
        if (clash) {
            return NextResponse.json(
                { error: "You already have a session at that time." },
                { status: 409 }
            );
        }

        const appointment = await Appointment.create({
            counsellor: counsellor._id,
            student: session.userId,
            date,
            start: slot.start,
            end: slot.end,
            status: "Pending",
            active: true,
        });

        return NextResponse.json(
            { id: String(appointment._id), status: appointment.status },
            { status: 201 }
        );
    } catch (error) {
        // 11000 = the unique slot index: someone else booked it first.
        if ((error as { code?: number }).code === 11000) {
            return NextResponse.json(
                { error: "That slot was just booked by someone else. Please choose another." },
                { status: 409 }
            );
        }
        console.error("Booking failed:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}