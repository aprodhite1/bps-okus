import { Metadata } from "next";
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: "Progres Kegiatan | BPS Kabupaten OKU Selatan",
  description: "Halaman untuk Update kegiatan statistik di SAKIP BPS OKU Selatan",
};

import ProgressPage from "@/components/progres/progres"; 
export default function ProgresStatistikPage() {
  return (
    <><ProtectedRoute><ProgressPage /></ProtectedRoute>;</>
  )
}
    
   