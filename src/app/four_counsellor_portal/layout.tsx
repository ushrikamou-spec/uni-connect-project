import type { ReactNode } from "react";

export default function CounsellorPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <header className="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full py-3 bg-white border-b border-gray-200">
        <nav className="max-w-340 w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-between">
            <a
              className="flex-none text-xl font-semibold text-gray-800"
              href="/four_counsellor_portal"
              aria-label="Counsellor Portal"
            >
              Counsellor Portal
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a
              className="text-sm text-gray-800 hover:text-blue-700"
              href="/four_counsellor_portal/four_a_profile"
            >
              Counsellor Profile
            </a>
          </div>
        </nav>
      </header>

      {children}
    </>
  );
}
