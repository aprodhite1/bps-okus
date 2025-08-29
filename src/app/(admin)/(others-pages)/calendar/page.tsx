import Calendar from "@/components/calendar/Calendar";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Kalender Kegiatan | BPS Kabupaten Ogan Komering Ulu Selatan",
  description:
    "This is Next.js Calendar page for TailAdmin Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Page() {
  return (
    
      <div className="space-y-6 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 xl:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-4">
              Kalender Kegiatan
            </h2>
            <Calendar />
          </div>
        </div>
      </div>
    
  );
}