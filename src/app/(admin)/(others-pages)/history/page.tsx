import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js History | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js History page for TailAdmin Tailwind CSS Admin Dashboard Template",
};

export default function HistoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="History" />
    </div>
  );
}