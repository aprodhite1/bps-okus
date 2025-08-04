import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monitoring Kegiatan Statistik | BPS Kabupaten OKU Selatan",
  description: "Halaman untuk memantau dan mengawasi kegiatan statistik di SAKIP BPS OKU Selatan",
};

import MonitorKegiatan from "@/app/(admin)/(others-pages)/manage-event/monitor-kegiatan";

export default function MonitoringKegiatanPage() {
  return <MonitorKegiatan />;
}