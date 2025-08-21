import Calendar from "@/components/calendar/Calendar";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Kalender Kegiatan | BPS Kabupaten Ogan Komering Ulu Selatan",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};
export default function page() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Kalender Kegiatan</h2>
          <Calendar />
        </div>
      </div>
      
      
    </div>
    
  );
}
