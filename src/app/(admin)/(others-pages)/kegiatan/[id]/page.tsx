'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface KegiatanDetail {
  id: string;
  nama_kegiatan: string;
  iku: string;
  rk: string;
  proyek: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  target_petugas: number;
  satuan_target: string;
  status: string;
  pegawai?: string;
  mitra?: string;
}

export default function KegiatanDetail() {
  const params = useParams();
  const [kegiatan, setKegiatan] = useState<KegiatanDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        const docRef = doc(db, 'kegiatan', params.id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setKegiatan({
            id: docSnap.id,
            ...docSnap.data()
          } as KegiatanDetail);
        }
      } catch (error) {
        console.error('Error fetching kegiatan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKegiatan();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!kegiatan) return <div>Kegiatan tidak ditemukan</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{kegiatan.nama_kegiatan}</h1>
          <Link href="/kegiatan" className="text-blue-500 hover:underline">
            ← Kembali ke Daftar
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Informasi Kegiatan</h2>
            <div className="space-y-3">
              <p><strong>Proyek:</strong> {kegiatan.proyek}</p>
              <p><strong>IKU:</strong> {kegiatan.iku}</p>
              <p><strong>RK:</strong> {kegiatan.rk}</p>
              <p><strong>Status:</strong> {kegiatan.status}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Detail Waktu</h2>
            <div className="space-y-3">
              <p><strong>Tanggal Mulai:</strong> {new Date(kegiatan.tanggal_mulai).toLocaleDateString('id-ID')}</p>
              <p><strong>Tanggal Selesai:</strong> {new Date(kegiatan.tanggal_selesai).toLocaleDateString('id-ID')}</p>
              <p><strong>Target:</strong> {kegiatan.target_petugas} {kegiatan.satuan_target}</p>
              {kegiatan.pegawai && <p><strong>Pegawai:</strong> {kegiatan.pegawai}</p>}
              {kegiatan.mitra && <p><strong>Mitra:</strong> {kegiatan.mitra}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}