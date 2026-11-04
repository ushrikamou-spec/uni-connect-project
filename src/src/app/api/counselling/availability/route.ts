import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";
import { getSession } from "../../../../lib/session";
import {
    generateSlots,
    initialsOf,
    upcomingDates,
    weekdayOf,
} from "../../../../lib/counselling";
import User from "../../../../models/User";
import Appointment from "../../../../models/appointment";

// Lists bookable dates, and the counsellors + slots for one chosen date.
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
        await Appointment.init(); // make sure the unique-slot index exists

        const counsellors = await User.find({
            role: "counsellor",
            workDays: { $exists: true, $ne: [] },
            officeStart: { $exists: true },
            officeEnd: { $exists: true },
        })
            .sort({ name: 1 })
            .lean();

        const dates = upcomingDates().filter((d) =>
            counsellors.some((c) => (c.workDays ?? []).includes(weekdayOf(d)))
        );

        const requested = new URL(request.url).searchParams.get("date");
        const date = requested && dates.includes(requested) ? requested : dates[0];

        if (!date) {
            return NextResponse.json({ dates: [], date: null, counsellors: [] });
        }

        const working = counsellors.filter((c) =>
            (c.workDays ?? []).includes(weekdayOf(date))
        );

        const booked = await Appointment.find({
            date,
            active: true,
            counsellor: { $in: working.map((c) => c._id) },
        }).lean();

        // key "counsellorId|start" -> id of the student holding the slot
        const taken = new Map<string, string>();
        for (const b of booked) {
            taken.set(`${b.counsellor}|${b.start}`, String(b.student));
        }

        return NextResponse.json({
            dates,
            date,
            counsellors: working.map((c) => ({
                id: String(c._id),
                name: c.name,
                initials: c.initials || initialsOf(c.name),
                specialty: c.specialty ?? "",
                slots: generateSlots(c.officeStart!, c.officeEnd!).map((slot) => {
                    const holder = taken.get(`${c._id}|${slot.start}`);
                    return {
                        ...slot,
                        available: holder === undefined,
                        mine: holder === session.userId,
                    };
                }),
            })),
        });
    } catch (error) {
        console.error("Availability failed:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}