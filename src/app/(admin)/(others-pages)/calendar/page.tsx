import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
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
    <div>
      <PageBreadcrumb pageTitle="Kalender Kegiatan | BPS Kabupaten Ogan Komering Ulu Selatan" />
      <Calendar />
    </div>
  );
}
