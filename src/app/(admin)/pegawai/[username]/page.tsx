'use client';

import { useKegiatan } from '@/hooks/useKegiatan';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interface untuk data progress


// Interface untuk data kegiatan


export default function PegawaiDetail() {
  const { username } = useParams(); // Get username from URL
  const { kegiatan, loading, error } = useKegiatan();
  const [userName, setUserName] = useState<string>('');
  const [userError, setUserError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user name dari Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userDoc = await getDocs(collection(db, 'users'));
        const userData = userDoc.docs.find(doc => doc.id === username);
        setUserName(userData?.data().name || username as string);
      } catch (err) {
        console.error('Error fetching user name:', err);
        setUserError('Gagal memuat nama pegawai');
        setUserName(username as string);
      }
    };
    if (username) fetchUserName();
  }, [username]);

  // Filter kegiatan berdasarkan pegawai
  const filteredKegiatan = kegiatan?.filter(k => k.pegawai.includes(username as string)) || [];

  // Format tanggal
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
        <p className="text-gray-600 dark:text-gray-400">Memuat data kegiatan...</p>
      </div>
    );
  }

  // Error state
  if (error || userError) {
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
              <p>{error || userError}</p>
              <p className="mt-2">Silakan coba lagi dalam beberapa saat.</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredKegiatan.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Tidak ada kegiatan untuk {userName}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Pegawai ini belum ditambahkan ke dalam kegiatan apa pun.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {userName}
        </h2>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          ← Kembali
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKegiatan.map((item) => {
          const progress = item.progress[username as string] || { tercapai: 0, target: 0, progress_percentage: 0 };
          return (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.nama_kegiatan}
                </h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'published'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : item.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : item.status === 'selesai'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p><strong>IKU:</strong> {item.iku}</p>
                <p><strong>RK:</strong> {item.rk}</p>
                <p><strong>Proyek:</strong> {item.proyek}</p>
                <p><strong>Target:</strong> {item.target_petugas} {item.satuan_target}</p>
                <p><strong>Periode:</strong> {formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}</p>
              </div>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Progress:</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mb-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
                    style={{ width: `${progress.progress_percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {progress.tercapai}/{progress.target} {item.satuan_target} ({progress.progress_percentage}%)
                </p>
                {progress.catatan && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Catatan: {progress.catatan}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}