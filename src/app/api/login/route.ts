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

export async function POST(request: Request) {
    let body: { email?: unknown; password?: unknown } = {};
    try {
        body = await request.json();
    } catch {
        // an empty or invalid body is treated as wrong credentials
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
        return NextResponse.json(
            { error: "Please enter your email and password." },
            { status: 400 }
        );
    }

    try {
        await connectDB();
        const user = await User.findOne({ email });

        // Same message for "no such user" and "wrong password" on purpose.
        const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
        if (!user || !valid) {
            return NextResponse.json(
                { error: "Incorrect email or password." },
                { status: 401 }
            );
        }

        const token = await createSessionToken({
            userId: user._id.toString(),
            role: user.role,
            name: user.name,
        });

        const response = NextResponse.json({
            role: user.role,
            redirect: PORTAL_PATH[user.role],
        });

        response.cookies.set(SESSION_COOKIE, token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: SESSION_MAX_AGE,
        });

        return response;
    } catch (error) {
        console.error("Login failed:", error);
        return NextResponse.json(
            { error: "Server error. Please try again later." },
            { status: 500 }
        );
    }
}