// src/app/manajemen-kegiatan-statistik/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Kegiatan Statistik | BPS Kabupaten OKU Selatan",
  description: "Halaman untuk mengelola kegiatan statistik di SAKIP BPS OKU Selatan",
};

import ManageEvent from "@/app/(admin)/(others-pages)/manage-event/tambah-kegiatan"; // Pastikan path sesuai dengan lokasi file komponen

export default function ManajemenKegiatanStatistikPage() {
  return <ManageEvent />; // Impor komponen Client Component di sini
}