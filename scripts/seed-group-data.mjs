// Loads the group's sample data (student, counsellor, counsellor_appointments,
// faculty) into the "uni_connect" database, so you do not need the JSON files.
// Safe to run more than once: records are matched by _id and overwritten.
// Run with:  npm run seed:group
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("MONGODB_URI is not set. Add it to .env.local first.");
    process.exit(1);
}

// Records exported from the group database (an { __oid } marks an ObjectId).
const DATA = {
    student: [
        {
            _id: { __oid: "6ade9fbb640dfac1a4171af6" },
            student_id: "1",
            student_name: "Nusrat Jahan",
            department: "CSE",
            cgpa: 3.4,
            counselling_date: "",
            counselling_time: "",
            counsellor_booked: "",
        },
    ],
    counsellor: [
        {
            _id: { __oid: "6ade87de640dfac1a4171adf" },
            c_name: "Dr. Samira Ahmed",
            initial: "SA1",
            specialty: "Student Counsellor · Academic planning and wellbeing",
            c_email: "Counsellor1@nsu.edu",
            c_pass: "Sa123!@#",
            c_office_hours: "1:00 - 5:00",
            c_work_days: "MW",
            appointments_total: "6",
            appointments_a: "4",
            appointments_h: "1",
            appointments_r: "1",
        },
    ],
    counsellor_appointments: [
        {
            _id: { __oid: "6ade8e55640dfac1a4171ae4" },
            initial: "SA",
            date: "2026-10-19",
            "09:00 AM - 09:30 AM": "1",
            "10:00 AM - 10:30 AM": "2",
            "11:00 AM - 11:30 AM": "3",
            "01:30 PM - 02:00 PM": "4",
            "03:00 PM - 03:30 PM": "5",
        },
    ],
};

// Collections that should exist even when they have no records yet.
const EMPTY_COLLECTIONS = ["faculty"];

function revive(value) {
    if (Array.isArray(value)) return value.map(revive);
    if (value && typeof value === "object") {
        if (typeof value.__oid === "string") {
            return new mongoose.Types.ObjectId(value.__oid);
        }
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, revive(v)])
        );
    }
    return value;
}

try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const existing = (await db.listCollections().toArray()).map((c) => c.name);

    for (const name of EMPTY_COLLECTIONS) {
        if (!existing.includes(name)) await db.createCollection(name);
    }

    for (const [name, docs] of Object.entries(DATA)) {
        const collection = db.collection(name);
        for (const doc of docs.map(revive)) {
            await collection.replaceOne({ _id: doc._id }, doc, { upsert: true });
        }
        console.log(`Loaded ${docs.length} record(s) into "${name}"`);
    }
    console.log(`Done. Database: ${db.databaseName}`);
} catch (error) {
    console.error("Loading failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}