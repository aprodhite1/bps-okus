import { Metadata } from "next";
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: "Tambah Kegiatan | BPS Kabupaten OKU Selatan",
  description: "Halaman untuk mengelola kegiatan statistik di SAKIP BPS OKU Selatan",
};

import ProgressPage from "@/components/progres/progres"; // Pastikan path sesuai dengan lokasi file komponen

export default function ProgresStatistikPage() {
  return 
  <ProtectedRoute><ProgressPage /></ProtectedRoute>; // Impor komponen Client Component di sini
}