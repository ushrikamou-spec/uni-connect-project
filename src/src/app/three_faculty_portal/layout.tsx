import type {ReactNode }from "react";


export default function FacultyPortalLayout({ children }: {children:ReactNode}) {
  return (
    <>






        {/* you can make any changes from here -----------------------------------------------------------------------------------------------------------------------------------*/}

        <div>


          <header className="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full py-3 bg-white border-b border-gray-200">
            <nav className="max-w-340 w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center justify-between">
                <a className="flex-none text-xl font-semibold text-gray-800 focus:outline-hidden focus:opacity-80" href="/three_faculty_portal" aria-label="Brand">
                  Faculty Portal
                </a>
                <div className="sm:hidden">
                  <button type="button" className="hs-collapse-toggle relative size-9 flex justify-center items-center gap-x-2 rounded-lg bg-white border border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" id="hs-navbar-example-collapse" aria-expanded="false" aria-controls="hs-navbar-example" aria-label="Toggle navigation" data-hs-collapse="#hs-navbar-example">
                    <svg className="hs-collapse-open:hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                    <svg className="hs-collapse-open:block hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    <span className="sr-only">Toggle navigation</span>
                  </button>
                </div>
              </div>
              <div id="hs-navbar-example" className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block" aria-labelledby="hs-navbar-example-collapse" role="region">
                <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
                  <a className="font-medium text-blue-700 focus:outline-hidden" href="/three_faculty_portal/three_a_profile" aria-current="page">Faculty Profile</a>
                  <a className="text-sm text-gray-800 hover:text-blue-700 focus:outline-hidden focus:text-blue-700" href="/three_faculty_portal/three_c_review_applications">Review Applications</a>
                  <a className="text-sm text-gray-800 hover:text-blue-700 focus:outline-hidden focus:text-blue-700" href="/three_faculty_portal/three_d_create_project">Create project</a>
                </div>
              </div>
            </nav>
          </header>
        </div>


        {/* do not change this -----------------------------------------------------------------------------------------------------------------------------------*/}
        {children}
        {/* do not change this -----------------------------------------------------------------------------------------------------------------------------------*/}









        
      </>
  );
}