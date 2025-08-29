'use client';

import { useKegiatan } from '@/hooks/useKegiatan';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MonitoringKinerjaASN from '@/components/event/MonitoringKinerjaASN';
import ProtectedRoute from '../auth/ProtectedRoute';
import { Kegiatan } from "@/types/typeKegiatan";
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function KegiatanCard() {
  const { kegiatan, loading, error } = useKegiatan();
  const { user } = useAuth();
  const [useFallback, setUseFallback] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState<'aktif' | 'selesai' | 'monitoring'>('aktif');
  const router = useRouter();

  useEffect(() => {
    if (error && retryCount < 2) {
      const timer = setTimeout(() => {
        console.log('Mencoba kembali...');
        setRetryCount((prev) => prev + 1);
        setUseFallback(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  // Filter kegiatan
  const filteredKegiatan = (kegiatan || []).filter((k) =>
    viewMode === 'selesai' ? k.status === 'selesai' : k.status !== 'selesai'
  );

  // Tombol navigasi
  const renderButtons = () => (
    <div className="flex space-x-4">
      <button
        onClick={() => setViewMode('monitoring')}
        className={`px-4 py-2 rounded-md ${
          viewMode === 'monitoring'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        Monitoring Kinerja ASN
      </button>
      <button
        onClick={() => setViewMode('aktif')}
        className={`px-4 py-2 rounded-md ${
          viewMode === 'aktif'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        Kegiatan Aktif
      </button>
      <button
        onClick={() => setViewMode('selesai')}
        className={`px-4 py-2 rounded-md ${
          viewMode === 'selesai'
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        Kegiatan Selesai
      </button>
    </div>
  );

  // Loading
  if (loading && !useFallback) {
    return (
      <>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
        <p className="text-gray-600 dark:text-gray-400">Memuat data kegiatan...</p>
      </>
    );
  }

  // Error
  if (error && !useFallback) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Gagal Memuat Data</h3>
        <p className="text-sm text-red-600 dark:text-red-300 mt-2">{error}</p>
      </div>
    );
  }

  // Monitoring view
  if (viewMode === 'monitoring') {
    return (
      <div className="space-y-6">
        {renderButtons()}
        <MonitoringKinerjaASN />
      </div>
    );
  }

  // Empty state
  if (filteredKegiatan.length === 0) {
    return (
      <div className="space-y-6">
        {renderButtons()}
        <div className="p-8 text-center bg-white dark:bg-gray-800 border rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {viewMode === 'selesai' ? 'Tidak ada kegiatan selesai' : 'Belum ada data kegiatan'}
          </h3>
        </div>
      </div>
    );
  }

  // Format tanggal
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // Hitung progress keseluruhan
  const hitungProgressKegiatan = (kegiatan: Kegiatan) => {
    if (!kegiatan.progress) return 0;
    const totalTercapai = Object.values(kegiatan.progress).reduce((sum, p) => sum + p.tercapai, 0);
    const totalTarget = kegiatan.petugas_target.reduce((sum, p) => sum + p.target, 0);
    if (totalTarget === 0) return 0;
    return Math.round((totalTercapai / totalTarget) * 100);
  };

  // Fungsi untuk menandai kegiatan selesai
  const handleTandaiSelesai = async (kegiatanId: string) => {
    try {
      const kegiatanRef = doc(db, 'kegiatan', kegiatanId);
      await updateDoc(kegiatanRef, {
        status: 'selesai',
        updated_at: new Date(),
      });
      console.log(`Kegiatan ${kegiatanId} ditandai selesai`);
      // Data akan otomatis diperbarui via onSnapshot di useKegiatan
    } catch (err) {
      console.error('Gagal menandai kegiatan selesai:', err);
      // Opsional: Tambahkan feedback ke user, misalnya toast notification
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {renderButtons()}
        {/* Daftar Kegiatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKegiatan.map((item: Kegiatan) => {
            const progressKegiatan = hitungProgressKegiatan(item);
            const totalTarget = item.petugas_target.reduce((sum, p) => sum + p.target, 0);
            const totalTercapai = item.progress
              ? Object.values(item.progress).reduce((sum, p) => sum + p.tercapai, 0)
              : 0;
            const isAdminCreator = user?.username === item.created_by;
            const showTandaiSelesai = progressKegiatan === 100 && isAdminCreator && item.status !== 'selesai';

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
              >
                {/* Bagian Judul */}
                <div className="p-4 border-b dark:border-gray-600">
                  <h3
                    className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:underline"
                    onClick={() => router.push(`/kegiatan/${item.id}`)}
                  >
                    {item.nama_kegiatan}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      item.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : item.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : item.status === 'selesai'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Bagian Isi + Progress */}
                <div className="p-4 space-y-3 text-sm text-gray-600 dark:text-gray-300 flex-grow">
                  <p>
                    <strong>Ketua Kegiatan:</strong> {item.created_by}
                  </p>
                  <p>
                    <strong>Periode:</strong> {formatDate(item.tanggal_mulai)} -{' '}
                    {formatDate(item.tanggal_selesai)}
                  </p>
                  <p>
                    <strong>Total Target:</strong> {totalTarget} {item.satuan_target}
                  </p>
                  <p>
                    <strong>Pegawai:</strong> {item.petugas_target.map((p) => p.pegawai).join(', ')}
                  </p>

                  {/* Progress */}
                  <div className="pt-2 border-t dark:border-gray-600">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Progress Keseluruhan
                    </h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progressKegiatan}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {progressKegiatan}% ({totalTercapai}/{totalTarget} {item.satuan_target})
                    </p>
                  </div>
                </div>

                {/* Tombol Tandai Selesai */}
                {showTandaiSelesai && (
                  <div className="p-4 border-t dark:border-gray-600">
                    <button
                      onClick={() => handleTandaiSelesai(item.id)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                    >
                      Tandai Selesai
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}