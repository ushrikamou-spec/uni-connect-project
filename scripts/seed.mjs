// Creates (or updates) the test accounts in MongoDB.
// Safe to run again: accounts are matched by email.
// Run with:  npm run seed
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("MONGODB_URI is not set. Add it to .env.local first.");
    process.exit(1);
}

// workDays: 0 = Sunday ... 6 = Saturday. Office hours are 24-hour "HH:mm".
const users = [
    {
        name: "Nusrat Jahan",
        email: "student@uni.edu",
        password: "student123",
        role: "student",
        universityId: "1",
        department: "CSE",
        cgpa: 3.4,
    },

    {
    name: "Rafi Ahmed",
    email: "student2@uni.edu",
    password: "student123",
    role: "student",
    universityId: "2",
    department: "EEE",
    cgpa: 3.6,
    },

    {
        name: "Test Faculty",
        email: "faculty@uni.edu",
        password: "faculty123",
        role: "faculty",
        department: "Computer Science & Engineering",
    },
    {
        name: "Dr. Samira Ahmed",
        email: "counsellor@uni.edu",
        password: "counsellor123",
        role: "counsellor",
        initials: "SA",
        specialty: "Academic planning and wellbeing",
        workDays: [1, 3], // Monday, Wednesday
        officeStart: "13:00",
        officeEnd: "17:00",
    },
    {
        name: "Mr. Farhan Kabir",
        email: "farhan@uni.edu",
        password: "counsellor123",
        role: "counsellor",
        initials: "FK",
        specialty: "Stress management and study skills",
        workDays: [2, 5], // Tuesday, Friday
        officeStart: "09:00",
        officeEnd: "13:00",
    },
    {
        name: "Ms. Nadia Rahman",
        email: "nadia@uni.edu",
        password: "counsellor123",
        role: "counsellor",
        initials: "NR",
        specialty: "Personal development and adjustment",
        workDays: [4], // Thursday
        officeStart: "10:00",
        officeEnd: "14:00",
    },
];

try {
    await mongoose.connect(uri);
    const collection = mongoose.connection.collection("users");
    await collection.createIndex({ email: 1 }, { unique: true });

    for (const { password, ...rest } of users) {
        const passwordHash = await bcrypt.hash(password, 10);
        const now = new Date();
        await collection.updateOne(
            { email: rest.email },
            {
                $set: { ...rest, passwordHash, updatedAt: now },
                $setOnInsert: { createdAt: now },
            },
            { upsert: true }
        );
        console.log(`Seeded ${rest.role}: ${rest.email}`);
    }
    console.log("Done.");
} catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}