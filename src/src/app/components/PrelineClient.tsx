"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Optional third-party libraries
//import $ from "jquery";
import _ from "lodash";
import Dropzone from "dropzone";
import noUiSlider from "nouislider";
import DataTable from "datatables.net-dt";
import { Calendar } from "vanilla-calendar-pro";


//window.$ = $;
//window.jQuery = $;
//window._ = _;
// window.Dropzone = Dropzone;
// window.noUiSlider = noUiSlider;
// window.DataTable = DataTable;
// window.VanillaCalendarPro = Calendar;

// Preline UI
export default function PrelineClient() {
  const pathname = usePathname();
  

  useEffect(() => {

    
    let cancelled = false;

    import("preline/non-auto").then(({ HSStaticMethods }) => {
      if (cancelled) return;
      HSStaticMethods.cleanCollection();
      HSStaticMethods.autoInit();
    });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}