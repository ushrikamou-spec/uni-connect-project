import type { ReactNode } from "react";

export default function StudentPortalLayout({
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
              href="/two_student_portal"
              aria-label="Student Portal"
            >
              Student Portal
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a
              className="font-medium text-blue-700"
              href="/two_student_portal/two_a_profile"
            >
              Student Profile
            </a>

            <a
              className="text-sm text-gray-800 hover:text-blue-700"
              href="/two_student_portal/two_c_my_applications"
            >
              My Applications
            </a>

            <a
              className="text-sm text-gray-800 hover:text-blue-700"
              href="/two_student_portal/student-counselling"
            >
              Student Counselling
            </a>
            
             <a
              className="text-sm text-gray-800 hover:text-blue-700"
              href="/two_student_portal/student-materials"
            >
              Course Materials
            </a>
          </div>
        </nav>
      </header>

      {children}
    </>
  );
}