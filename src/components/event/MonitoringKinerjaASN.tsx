'use client';

import { useKegiatan } from '@/hooks/useKegiatan';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

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

// Interface untuk data agregasi pegawai
interface PegawaiData {
  namaPegawai: string;
  username: string;
  jumlahKegiatan: number;
  targetTotal: number;
  totalTercapai: number;
  persentaseSelesai: number;
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

// Mock user names untuk fallback
const fallbackUserNames: Record<string, string> = {
  user1: 'John Doe',
  user2: 'Jane Smith',
  user3: 'Budi Santoso',
};

export default function MonitoringKinerjaASN() {
  const { user } = useAuth();
  const { kegiatan, loading, error } = useKegiatan();
  const [useFallback, setUseFallback] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [pegawaiData, setPegawaiData] = useState<PegawaiData[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [usersError, setUsersError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user names dari Firestore
  useEffect(() => {
    const fetchUserNames = async () => {
      if (useFallback) {
        setUserNames(fallbackUserNames);
        return;
      }
      try {
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        const names = Object.fromEntries(
          usersSnap.docs.map((doc) => [doc.id, doc.data().name || doc.id])
        );
        setUserNames(names);
      } catch (err) {
        console.error('Error fetching user names:', err);
        setUsersError('Gagal memuat nama pegawai');
        setUserNames({});
      }
    };
    fetchUserNames();
  }, [useFallback]);

  // Aggregasi data pegawai
  useEffect(() => {
    const dataToUse = useFallback ? fallbackKegiatan : kegiatan || [];

    const aggregation: Record<string, PegawaiData> = {};

    dataToUse.forEach((k) => {
      k.pegawai.forEach((pegawai) => {
        if (!aggregation[pegawai]) {
          aggregation[pegawai] = {
            namaPegawai: userNames[pegawai] || pegawai,
            username: pegawai,
            jumlahKegiatan: 0,
            targetTotal: 0,
            totalTercapai: 0,
            persentaseSelesai: 0,
          };
        }

        aggregation[pegawai].jumlahKegiatan += 1;
        const progress = k.progress[pegawai];
        if (progress) {
          aggregation[pegawai].targetTotal += progress.target;
          aggregation[pegawai].totalTercapai += progress.tercapai;
          aggregation[pegawai].persentaseSelesai += progress.progress_percentage;
        }
      });
    });

    // Hitung persentase selesai rata-rata
    const finalData = Object.entries(aggregation).map(([username, data]) => ({
      namaPegawai: data.namaPegawai,
      username,
      jumlahKegiatan: data.jumlahKegiatan,
      targetTotal: data.targetTotal,
      totalTercapai: data.totalTercapai,
      persentaseSelesai: data.jumlahKegiatan > 0 ? Math.round(data.persentaseSelesai / data.jumlahKegiatan) : 0,
    }));

    setPegawaiData(finalData);
  }, [kegiatan, useFallback, userNames]);

  // Handle error dengan fallback
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

  // Handle row click untuk navigasi
  const handleRowClick = (username: string) => {
    router.push(`/pegawai/${username}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 dark:border-blue-500"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Memuat data kinerja...</p>
      </div>
    );
  }

  // Error state untuk kegiatan atau user names
  if ((error || usersError) && !useFallback) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gagal Memuat Data</h3>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>{error || usersError}</p>
              <p className="mt-2">Silakan coba lagi dalam beberapa saat.</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => {
              setRetryCount(0);
              setUseFallback(false);
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            Coba Lagi
          </button>
          <button
            onClick={() => setUseFallback(true)}
            className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          >
            Gunakan Data Contoh
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (pegawaiData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-8 text-center border border-gray-200 dark:border-gray-700">
        <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum Ada Data Pegawai</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Tidak ada pegawai yang terlibat dalam kegiatan saat ini.
        </p>
        {user && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            <p>Hubungi administrator untuk ditambahkan ke dalam kegiatan.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoring Kinerja ASN</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md dark:shadow-gray-900/50">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nama Pegawai
              </th>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Jumlah Kegiatan
              </th>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Target Total
              </th>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Persentase Selesai
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {pegawaiData.map((pegawai) => (
              <tr
                key={pegawai.username}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                onClick={() => handleRowClick(pegawai.username)}
                role="button"
                aria-label={`Lihat detail untuk ${pegawai.namaPegawai}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {pegawai.namaPegawai}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {pegawai.jumlahKegiatan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {pegawai.targetTotal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {pegawai.totalTercapai}/{pegawai.targetTotal}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${Math.min(pegawai.persentaseSelesai, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {pegawai.persentaseSelesai}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}