import { NextRequest, NextResponse } from "next/server";
import {
    PORTAL_PATH,
    SESSION_COOKIE,
    verifySessionToken,
    type Role,
} from "./lib/auth";

// Which URL prefix belongs to which role.
const PROTECTED: { prefix: string; role: Role }[] = [
    { prefix: "/two_student_portal", role: "student" },
    { prefix: "/three_faculty_portal", role: "faculty" },
    { prefix: "/four_counsellor_portal", role: "counsellor" },
];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = await verifySessionToken(
        request.cookies.get(SESSION_COOKIE)?.value
    );
    const role = session?.role ?? null;

    // Logged-in users do not need the login page.
    if (pathname === "/one_login_page") {
        if (role) {
            return NextResponse.redirect(new URL(PORTAL_PATH[role], request.url));
        }
        return NextResponse.next();
    }

    const area = PROTECTED.find(
        (p) => pathname === p.prefix || pathname.startsWith(p.prefix + "/")
    );
    if (!area) return NextResponse.next();

    // Logged out (or tampered/expired cookie): go to login.
    if (!role) {
        return NextResponse.redirect(new URL("/one_login_page", request.url));
    }

    // Wrong portal for this role: send them to their own.
    if (role !== area.role) {
        return NextResponse.redirect(new URL(PORTAL_PATH[role], request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/one_login_page",
        "/two_student_portal/:path*",
        "/three_faculty_portal/:path*",
        "/four_counsellor_portal/:path*",
    ],
};