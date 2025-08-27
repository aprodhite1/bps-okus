import type { Metadata } from "next";
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import React from "react";
import MonitoringKinerjaASN from "@/components/event/monitoringASN";
import KegiatanCard from "@/components/event/KegiatanCard";

export const metadata: Metadata = {
  title:
    "SAKIP ",
  description: "Aplikasi SAKIP BPS Kabupaten Ogan Komering Ulu Selatan untuk mengelola kinerja instansi pemerintah",
};

export default function Ecommerce() {
  return (
    <ProtectedRoute>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
      
      <div className="col-span-12 xl:col-span-7">
        <KegiatanCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <MonitoringKinerjaASN />
      </div>

    </div></ProtectedRoute>
    
  );
}
