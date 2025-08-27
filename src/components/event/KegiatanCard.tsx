'use client';

import { useKegiatan } from '@/hooks/useKegiatan';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import MonitoringKinerjaASN from '@/components/event/MonitoringKinerjaASN';

// Interface untuk data progress
interface UserProgress {
  tercapai: number;
  target: number;
  progress_percentage: number;
  catatan?: string;
}

// Interface untuk data kegiatan
interface Kegiatan {
  id: string;
  nama_kegiatan: string;
  iku: string;
  rk: string;
  proyek: string;
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  target_petugas: number;
  satuan_target: string;
  status: string;
  created_at: Date;
  pegawai: string[];
  progress: Record<string, UserProgress>;
  createdBy?: string;
}

// Fallback data untuk development
const fallbackKegiatan: Kegiatan[] = [
  {
    id: '1',
    nama_kegiatan: 'Penyusunan Laporan Triwulan',
    iku: 'IKU 1.2.3',
    rk: 'RK.01.02',
    proyek: 'Proyek Monitoring',
    tanggal_mulai: new Date('2024-01-15'),
    tanggal_selesai: new Date('2024-03-31'),
    target_petugas: 100,
    satuan_target: 'dokumen',
    status: 'draft',
    created_at: new Date('2024-01-10'),
    pegawai: ['user1', 'user2', 'user3'],
    createdBy: 'admin1',
    progress: {
      user1: {
        tercapai: 30,
        target: 50,
        progress_percentage: 60,
        catatan: 'Sedang dalam proses',
      },
      user2: {
        tercapai: 40,
        target: 50,
        progress_percentage: 80,
        catatan: 'Hampir selesai',
      },
    },
  },
];

export default function KegiatanCard() {
  const { user } = useAuth();
  const { kegiatan, loading, error } = useKegiatan();
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

  // Filter kegiatan berdasarkan status (only for 'aktif' or 'selesai')
  const filteredKegiatan = useFallback
    ? fallbackKegiatan.filter((k) => (viewMode === 'selesai' ? k.status === 'selesai' : k.status !== 'selesai'))
    : (kegiatan || []).filter((k) => (viewMode === 'selesai' ? k.status === 'selesai' : k.status !== 'selesai'));

  // Common buttons component
  const renderButtons = () => (
    <div className="flex space-x-4">
      <button
        onClick={() => setViewMode('aktif')}
        className={`px-4 py-2 rounded-md ${
          viewMode === 'aktif'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}
        aria-label="Tampilkan Kegiatan Aktif"
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
        aria-label="Tampilkan Kegiatan Selesai"
      >
        Kegiatan Selesai
      </button>
      <button
        onClick={() => setViewMode('monitoring')}
        className={`px-4 py-2 rounded-md ${
          viewMode === 'monitoring'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}
        aria-label="Tampilkan Monitoring Kinerja ASN"
      >
        Monitoring Kinerja ASN
      </button>
    </div>
  );

  // Loading state
  if (loading && !useFallback) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
        <p className="text-gray-600 dark:text-gray-400">Memuat data kegiatan...</p>
      </div>
    );
  }

  // Error state
  if (error && !useFallback) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Gagal Memuat Data</h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              <p>{error}</p>
              <p className="mt-2">Silakan coba lagi dalam beberapa saat.</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => {
              setRetryCount(0);
              setUseFallback(false);
              window.location.reload();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => setUseFallback(true)}
            className="ml-3 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          >
            Gunakan Data Contoh
          </button>
        </div>
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

  // Empty state for activity views
  if (filteredKegiatan.length === 0) {
    return (
      <div className="space-y-6">
        {renderButtons()}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {viewMode === 'selesai' ? 'Tidak ada kegiatan yang selesai' : 'Belum ada data kegiatan'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {user ? `Anda (${user.username}) belum ditambahkan ke dalam kegiatan apa pun.` : 'Silakan login untuk melihat kegiatan.'}
          </p>
          {user && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
              <p>Hubungi administrator untuk ditambahkan ke dalam kegiatan.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Hitung statistik progress keseluruhan
  const totalKegiatan = filteredKegiatan.length;
  const totalPegawai = filteredKegiatan.reduce((total, kegiatan) => total + kegiatan.pegawai.length, 0);
  const pegawaiWithProgress = filteredKegiatan.reduce((total, kegiatan) => {
    return total + Object.keys(kegiatan.progress || {}).length;
  }, 0);

  // Fungsi untuk menghitung progress keseluruhan suatu kegiatan
  const hitungProgressKegiatan = (kegiatan: Kegiatan) => {
    const progressValues = Object.values(kegiatan.progress || {});
    if (progressValues.length === 0) return 0;
    const totalTercapai = progressValues.reduce((sum, progress) => sum + progress.tercapai, 0);
    const totalTarget = progressValues.reduce((sum, progress) => sum + progress.target, 0);
    const jumlahPegawai = kegiatan.pegawai.length;
    if (totalTarget === 0) return 0;
    return Math.round((totalTercapai / (totalTarget * jumlahPegawai)) * 100);
  };

  // Hitung rata-rata progress semua kegiatan
  const totalProgressAllKegiatan = filteredKegiatan.reduce((total, kegiatan) => {
    return total + hitungProgressKegiatan(kegiatan);
  }, 0);
  const averageProgressPercentage = totalKegiatan > 0 ? Math.round(totalProgressAllKegiatan / totalKegiatan) : 0;

  // Fungsi untuk memformat tanggal
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {renderButtons()}
      {/* Statistik Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {viewMode === 'selesai' ? 'Statistik Kegiatan Selesai' : 'Statistik Progress Keseluruhan'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalKegiatan}</div>
            <div className="text-sm text-blue-800 dark:text-blue-200">Total Kegiatan</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{pegawaiWithProgress}</div>
            <div className="text-sm text-green-800 dark:text-green-200">Progress Diisi</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{averageProgressPercentage}%</div>
            <div className="text-sm text-purple-800 dark:text-purple-200">Rata-rata Progress</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalPegawai}</div>
            <div className="text-sm text-orange-800 dark:text-orange-200">Total Pegawai</div>
          </div>
        </div>
      </div>
      {/* Daftar Kegiatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKegiatan.map((item) => {
          const progressKegiatan = hitungProgressKegiatan(item);
          const jumlahPegawai = item.pegawai.length;
          const jumlahProgressDiisi = Object.keys(item.progress || {}).length;
          const progressValues = Object.values(item.progress || {});
          const totalTercapai = progressValues.reduce((sum, progress) => sum + progress.tercapai, 0);
          const totalTarget = progressValues.reduce((sum, progress) => sum + progress.target, 0);
          const total = totalTarget * jumlahPegawai;

          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <h3
                  className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:underline"
                  onClick={() => router.push(`/kegiatan/${item.id}`)}
                >
                  {item.nama_kegiatan}
                </h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                <p>
                  <strong>IKU:</strong> {item.iku}
                </p>
                <p>
                  <strong>RK:</strong> {item.rk}
                </p>
                <p>
                  <strong>Proyek:</strong> {item.proyek}
                </p>
                <p>
                  <strong>Target:</strong> {total} {item.satuan_target}
                </p>
                <p>
                  <strong>Periode:</strong> {formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}
                </p>
              </div>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Progress Keseluruhan:</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mb-2">
                  <div className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style={{ width: `${progressKegiatan}%` }}></div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {progressKegiatan}% ({totalTercapai}/{total || item.target_petugas} {item.satuan_target})
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {jumlahProgressDiisi}/{jumlahPegawai} pegawai telah mengisi progress
                </p>
              </div>
              {Object.keys(item.progress || {}).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Progress per Pegawai:</h4>
                  <div className="space-y-2">
                    {Object.entries(item.progress).map(([username, progress]) => (
                      <div key={username} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-blue-800 dark:text-blue-200">{username}</span>
                          <span className="text-xs text-blue-700 dark:text-blue-300">{progress.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-1.5 dark:bg-blue-700 mt-1">
                          <div className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500" style={{ width: `${progress.progress_percentage}%` }}></div>
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          {progress.tercapai}/{progress.target} {item.satuan_target}
                        </div>
                        {progress.catatan && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Catatan: {progress.catatan}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}