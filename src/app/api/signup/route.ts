import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import {
    PORTAL_PATH,
    SESSION_COOKIE,
    SESSION_MAX_AGE,
    createSessionToken,
} from "../../../lib/auth";

type UserRole = "student" | "faculty" | "counsellor";

export async function POST(request: Request) {
    let body: {
        universityId?: unknown;
        name?: unknown;
        email?: unknown;
        password?: unknown;
        role?: unknown;
        department?: unknown;
        cgpa?: unknown;
    } = {};

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request data." }, { status: 400 });
    }

    const universityId = typeof body.universityId === "string" ? body.universityId.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const rawRole = typeof body.role === "string" ? body.role : "student";
    const department = typeof body.department === "string" ? body.department.trim() : "";
    const cgpa = body.cgpa ? Number(body.cgpa) : undefined;

    if (!universityId || !name || !email || !password) {
        return NextResponse.json(
            { error: "Please fill in University ID, Name, Email, and Password." },
            { status: 400 }
        );
    }

    if (rawRole !== "student" && rawRole !== "faculty" && rawRole !== "counsellor") {
        return NextResponse.json({ error: "Invalid role selected." }, { status: 400 });
    }

    const role: UserRole = rawRole;

    try {
        await connectDB();

        const existingUser = await User.findOne({
            $or: [{ email }, { universityId }],
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this Email or University ID already exists." },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            universityId,
            name,
            email,
            passwordHash,
            role,
            department,
            ...(role === "student" && cgpa !== undefined && !Number.isNaN(cgpa) ? { cgpa } : {}),
        });

        await newUser.save();

        const token = await createSessionToken({
            userId: String(newUser._id),
            role: newUser.role,
            name: newUser.name,
        });

        const response = NextResponse.json(
            {
                message: "Account created successfully!",
                role: newUser.role,
                redirect: PORTAL_PATH[newUser.role],
            },
            { status: 201 }
        );

        response.cookies.set(SESSION_COOKIE, token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: SESSION_MAX_AGE,
        });

        return response;
    } catch (error) {
        console.error("Sign-up failed:", error);
        return NextResponse.json(
            { error: "Server error during registration." },
            { status: 500 }
        );
    }
}