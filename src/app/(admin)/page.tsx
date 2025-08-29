import type { Metadata } from "next";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import React from "react";

import KegiatanCard from "@/components/event/KegiatanCard";

export const metadata: Metadata = {
  title:
    "SIKALIS",
  description: "Sistem Kalender Kerja Terintegrasi SAKIP | BPS Kabupaten Ogan Komering Ulu Selatan",
};

export default function Ecommerce() {
  return (
    <ProtectedRoute>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-7">
        <KegiatanCard />
      </div>

    </div></ProtectedRoute>
    
  );
}
