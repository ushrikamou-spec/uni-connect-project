import "./globals.css";
import "./home.css";
import { cookies } from "next/headers";
import PrelineClient from "./components/PrelineClient";
import SiteNav from "./components/SiteNav";
import { PORTAL_PATH, SESSION_COOKIE, verifySessionToken } from "../lib/auth";
import type { ReactNode } from "react";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const portalHref = session ? PORTAL_PATH[session.role] : null;

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <SiteNav portalHref={portalHref} />

        {/* Page Content: Keep this so every route can render normally */}
        <main className="flex-1">
          {children}
        </main>

        {/* Preline initialization */}
        <PrelineClient />
      </body>
    </html>
  );
}