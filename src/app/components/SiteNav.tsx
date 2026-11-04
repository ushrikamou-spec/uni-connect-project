"use client";

import { usePathname } from "next/navigation";

export default function SiteNav({ portalHref }: { portalHref: string | null }) {
  const pathname = usePathname();
  const loggedIn = portalHref !== null;

  async function handleLogout() {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      // Full reload so the server re-reads the (now cleared) cookie.
      window.location.href = "/one_login_page";
    }
  }

  return (
    <header className="uc-navbar">
      <a className="uc-brand" href="/" aria-label="uni-connect home">
        uni<span>-</span>connect
      </a>
      <nav className="uc-nav-links" aria-label="Main navigation">
        <a className={pathname === "/" ? "uc-active" : ""} href="/">
          Home
        </a>
        <a href="/#contact">Contact</a>

        {loggedIn ? (
          <>
            <a
              className={
                portalHref && pathname.startsWith(portalHref) ? "uc-active" : ""
              }
              href={portalHref}
            >
              My Portal
            </a>
            <a
              className="uc-login"
              href="/one_login_page"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              Logout
            </a>
          </>
        ) : (
          <a
            className={
              pathname === "/one_login_page" ? "uc-login uc-active" : "uc-login"
            }
            href="/one_login_page"
          >
            Login
          </a>
        )}
      </nav>
    </header>
  );
}
