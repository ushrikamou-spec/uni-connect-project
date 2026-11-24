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
    let body: { email?: unknown; universityId?: unknown; identifier?: unknown; password?: unknown } = {};
    try {
        body = await request.json();
    } catch {
        // invalid body
    }

    // ফ্রন্টএন্ড থেকে email, universityId অথবা identifier যে নামেই পাঠানো হোক তা ধরবে
    const rawIdentifier =
        typeof body.identifier === "string"
            ? body.identifier.trim()
            : typeof body.email === "string"
            ? body.email.trim()
            : typeof body.universityId === "string"
            ? body.universityId.trim()
            : "";

    const password = typeof body.password === "string" ? body.password : "";

    if (!rawIdentifier || !password) {
        return NextResponse.json(
            { error: "Please enter your ID/Email and password." },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        // Email অথবা University ID যেকোনো একটি মিললেই ইউজার খুঁজে বের করবে
        const user = await User.findOne({
            $or: [
                { email: rawIdentifier.toLowerCase() },
                { universityId: rawIdentifier },
            ],
        });

        const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
        if (!user || !valid) {
            return NextResponse.json(
                { error: "Incorrect ID/Email or password." },
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
            redirect: PORTAL_PATH[user.role as keyof typeof PORTAL_PATH],
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