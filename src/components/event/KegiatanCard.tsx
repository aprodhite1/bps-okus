'use client';

import { useKegiatan } from '@/hooks/useKegiatan';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { getProgressForUser } from '@/utils/typeGuards';

// Fallback data untuk development
const fallbackKegiatan = [
  {
    id: '1',
    nama_kegiatan: 'Contoh Kegiatan 1',
    iku: 'IKU Contoh',
    rk: 'RK Contoh',
    proyek: 'Proyek Contoh',
    tanggal_mulai: new Date(),
    tanggal_selesai: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    target_petugas: 100,
    satuan_target: 'unit',
    status: 'draft',
    created_at: new Date(),
    pegawai: ['user1'],
    progress: {}
  }
];

export default function KegiatanCard() {
  const { user } = useAuth();
  const { kegiatan, loading, error } = useKegiatan();
  const [useFallback, setUseFallback] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Jika error, coba gunakan fallback setelah 3 detik
    if (error && retryCount < 2) {
      const timer = setTimeout(() => {
        console.log('Mencoba kembali...');
        setRetryCount(prev => prev + 1);
        setUseFallback(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 dark:text-gray-400">Memuat data kegiatan...</p>
      </div>
    );
  }

  // Tampilkan error state
  if (error && !useFallback) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Coba Lagi
          </button>
          
          <button
            onClick={() => setUseFallback(true)}
            className="ml-3 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Gunakan Data Contoh
          </button>
        </div>
      </div>
    );
  }

  // Gunakan fallback data jika terjadi error
  const displayKegiatan = useFallback ? fallbackKegiatan : kegiatan;
  
  if (displayKegiatan.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada data kegiatan</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {user ? `Anda (${user.username}) belum ditambahkan ke dalam kegiatan apa pun.` : 'Silakan login untuk melihat kegiatan.'}
        </p>
        
        {user && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            <p>Hubungi administrator untuk ditambahkan ke dalam kegiatan.</p>
          </div>
        )}
      </div>
    );
  }

  // Hitung statistik progress
  const totalKegiatan = displayKegiatan.length;
  const kegiatanDenganProgress = user ? displayKegiatan.filter(item => 
    item.progress && item.progress[user.username]
  ).length : 0;
  
  const progressPercentage = totalKegiatan > 0 
    ? Math.round((kegiatanDenganProgress / totalKegiatan) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Debug info untuk development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-yellow-800 dark:text-yellow-200 text-sm">
              Mode Development - {useFallback ? 'Menggunakan data contoh' : 'Menggunakan data real'} - {totalKegiatan} kegiatan
            </span>
          </div>
        </div>
      )}

      {/* Statistik Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Statistik Progress
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalKegiatan}
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              Total Kegiatan
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {kegiatanDenganProgress}
            </div>
            <div className="text-sm text-green-800 dark:text-green-200">
              Progress Diisi
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {progressPercentage}%
            </div>
            <div className="text-sm text-purple-800 dark:text-purple-200">
              Completion Rate
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Kegiatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayKegiatan.map((item) => {
          const userProgress = user && item.progress && item.progress[user.username];
          const hasProgress = !!userProgress;
          
          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {item.nama_kegiatan}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <p><strong>Status:</strong> {item.status}</p>
                <p><strong>Target:</strong> {item.target_petugas} {item.satuan_target}</p>
                <p><strong>Periode:</strong> {item.tanggal_mulai.toLocaleDateString('id-ID')} - {item.tanggal_selesai.toLocaleDateString('id-ID')}</p>
              </div>

              {/* Progress User */}
              {hasProgress && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Progress Anda:</h4>
                  <p className="text-sm">{userProgress.tercapai}/{userProgress.target} ({userProgress.progress_percentage}%)</p>
                  {userProgress.catatan && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Catatan: {userProgress.catatan}</p>
                  )}
                </div>
              )}

              {!hasProgress && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 text-center">
                    Belum mengisi progress
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}