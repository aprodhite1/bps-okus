// src/app/manajemen-kegiatan-statistik/page.tsx
import { Metadata } from "next";
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: "Detail Kegiatan",
  description: "Halaman untuk mengelola kegiatan statistik di SAKIP BPS OKU Selatan",
};

import KegiatanDetail from "@/app/(admin)/(others-pages)/kegiatan/[id]/kegiatan" ;

export default function ManajemenKegiatanStatistikPage() {
  return (
  <ProtectedRoute><KegiatanDetail /> </ProtectedRoute>// Impor komponen Client Component di sini
  )
  
}