import { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import KegiatanSelesai from '@/app/(admin)/(others-pages)/kegiatan-selesai/kegiatanselesai';

export const metadata: Metadata = {
  title: 'Kegiatan Selesai | BPS Kabupaten OKU Selatan',
  description: 'Halaman untuk melihat kegiatan selesai dan feedback di SAKIP BPS OKU Selatan',
};

export default function KegiatanSelesaiPage() {
  return (
    <ProtectedRoute>
      <KegiatanSelesai /> 
    </ProtectedRoute>
  );
}