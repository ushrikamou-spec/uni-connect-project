// Session helpers. This file must stay free of database imports, because
// proxy.ts also uses it and runs in a lightweight runtime without Mongoose.
import { SignJWT, jwtVerify } from "jose";

export type Role = "student" | "faculty" | "counsellor";

export const SESSION_COOKIE = "uc_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours, in seconds

export const PORTAL_PATH: Record<Role, string> = {
    student: "/two_student_portal",
    faculty: "/three_faculty_portal",
    counsellor: "/four_counsellor_portal",
};

export type Session = {
    userId: string;
    role: Role;
    name: string;
};

export function isRole(value: unknown): value is Role {
    return value === "student" || value === "faculty" || value === "counsellor";
}

function secretKey() {
    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 16) {
        throw new Error(
            "AUTH_SECRET is missing or too short. Add a long random value to .env.local and restart."
        );
    }
    return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: Session) {
    return new SignJWT({ role: session.role, name: session.name })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(session.userId)
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE}s`)
        .sign(secretKey());
}

// Returns the session if the token is valid and untampered, otherwise null.
export async function verifySessionToken(
    token: string | undefined
): Promise<Session | null> {
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, secretKey());
        if (!payload.sub || !isRole(payload.role)) return null;
        return {
            userId: payload.sub,
            role: payload.role,
            name: typeof payload.name === "string" ? payload.name : "",
        };
    } catch {
        return null;
    }
}
