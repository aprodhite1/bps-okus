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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (!kegiatan) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
        Kegiatan tidak ditemukan
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {kegiatan.nama_kegiatan}
          </h1>
          <Link
            href="/calendar"
            className="text-blue-500 dark:text-blue-400 hover:underline dark:hover:text-blue-300"
          >
            ← Kembali ke Kalender
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Informasi Kegiatan
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                <strong className="font-medium">Proyek:</strong> {kegiatan.proyek}
              </p>
              <p>
                <strong className="font-medium">IKU:</strong> {kegiatan.iku}
              </p>
              <p>
                <strong className="font-medium">RK:</strong> {kegiatan.rk}
              </p>
              <p>
                <strong className="font-medium">Status:</strong>{' '}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    kegiatan.status === 'selesai'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : kegiatan.status === 'progress'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}
                >
                  {kegiatan.status}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Detail Waktu
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                <strong className="font-medium">Tanggal Mulai:</strong>{' '}
                {new Date(kegiatan.tanggal_mulai).toLocaleDateString('id-ID')}
              </p>
              <p>
                <strong className="font-medium">Tanggal Selesai:</strong>{' '}
                {new Date(kegiatan.tanggal_selesai).toLocaleDateString('id-ID')}
              </p>
              <p>
                <strong className="font-medium">Target:</strong>{' '}
                {kegiatan.target_petugas} {kegiatan.satuan_target}
              </p>
              {kegiatan.pegawai && (
                <p>
                  <strong className="font-medium">Pegawai:</strong>{' '}
                  {kegiatan.pegawai}
                </p>
              )}
              {kegiatan.mitra && (
                <p>
                  <strong className="font-medium">Mitra:</strong> {kegiatan.mitra}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}