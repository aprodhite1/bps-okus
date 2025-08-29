'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';


// Interface untuk data progress
interface UserProgress {
  tercapai: number;
  target: number;
  progress_percentage: number;
  catatan?: string;
  last_updated?: Date;
}

// Interface untuk petugas target
interface PetugasTarget {
  pegawai: string;
  target: number;
}

// Interface untuk data kegiatan
interface Kegiatan {
  id: string;
  nama_kegiatan: string;
  iku: string;
  rk: string;
  proyek: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  satuan_target: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  petugas_target: PetugasTarget[];
  progress: Record<string, UserProgress>;
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

export default function MonitoringKinerjaASN() {
  const { user } = useAuth();
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pegawaiData, setPegawaiData] = useState<PegawaiData[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  

  // Fetch kegiatan dari Firestore
  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        setLoading(true);
        const kegiatanRef = collection(db, 'kegiatan');
        const kegiatanSnap = await getDocs(kegiatanRef);
        
        const kegiatanData: Kegiatan[] = [];
        kegiatanSnap.forEach((doc) => {
          const data = doc.data();
          kegiatanData.push({
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate() || new Date(),
            updated_at: data.updated_at?.toDate() || new Date(),
          } as Kegiatan);
        });

        setKegiatan(kegiatanData);
        setError(null);
      } catch (err) {
        console.error('Error fetching kegiatan:', err);
        setError('Gagal memuat data kegiatan');
      } finally {
        setLoading(false);
      }
    };

    fetchKegiatan();
  }, []);

  // Fetch user names dari Firestore
  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        const names: Record<string, string> = {};
        
        usersSnap.forEach((doc) => {
          const userData = doc.data();
          names[userData.username] = userData.name || userData.username;
        });

        setUserNames(names);
      } catch (err) {
        console.error('Error fetching user names:', err);
        // Fallback: gunakan username sebagai nama
        const fallbackNames: Record<string, string> = {};
        kegiatan.forEach(k => {
          k.petugas_target?.forEach(pt => {
            fallbackNames[pt.pegawai] = pt.pegawai;
          });
        });
        setUserNames(fallbackNames);
      }
    };

    if (kegiatan.length > 0) {
      fetchUserNames();
    }
  }, [kegiatan]);

  // Aggregasi data pegawai berdasarkan petugas_target
  useEffect(() => {
    const aggregation: Record<string, PegawaiData> = {};

    kegiatan.forEach((kegiatanItem) => {
      // Loop melalui petugas_target bukan pegawai array
      kegiatanItem.petugas_target?.forEach((petugas) => {
        const username = petugas.pegawai;
        
        if (!aggregation[username]) {
          aggregation[username] = {
            namaPegawai: userNames[username] || username,
            username: username,
            jumlahKegiatan: 0,
            targetTotal: 0,
            totalTercapai: 0,
            persentaseSelesai: 0,
          };
        }

        aggregation[username].jumlahKegiatan += 1;
        aggregation[username].targetTotal += petugas.target;

        // Cek progress user
        const userProgress = kegiatanItem.progress?.[username];
        if (userProgress) {
          aggregation[username].totalTercapai += userProgress.tercapai;
          aggregation[username].persentaseSelesai += userProgress.progress_percentage;
        }
      });
    });

    // Hitung persentase selesai rata-rata
    const finalData = Object.values(aggregation).map((data) => ({
      ...data,
      persentaseSelesai: data.jumlahKegiatan > 0 
        ? Math.round(data.persentaseSelesai / data.jumlahKegiatan)
        : 0,
    }));

    // Urutkan berdasarkan nama pegawai
    finalData.sort((a, b) => a.namaPegawai.localeCompare(b.namaPegawai));

    setPegawaiData(finalData);
  }, [kegiatan, userNames]);

  // Handle row click untuk navigasi
  const handleRowClick = (username: string) => {
    window.location.href =`/pegawai/${username}`;
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

  // Error state
  if (error) {
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
              <p>{error}</p>
              <p className="mt-2">Silakan coba lagi dalam beberapa saat.</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            Coba Lagi
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
        {user?.role === 'admin' && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            <p>Tambahkan pegawai ke dalam kegiatan melalui menu `Tambah Kegiatan``.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoring Kinerja ASN</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Total: {pegawaiData.length} pegawai
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md dark:shadow-gray-900/50">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nama Pegawai
              </th>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Username
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {pegawai.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                  {pegawai.jumlahKegiatan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                  {pegawai.targetTotal.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                  {pegawai.totalTercapai.toLocaleString('id-ID')}/{pegawai.targetTotal.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(pegawai.persentaseSelesai, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[40px]">
                      {pegawai.persentaseSelesai}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">📊 Ringkasan Kinerja</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-blue-700 dark:text-blue-300">
          <div>
            <span className="font-semibold">Total Pegawai:</span> {pegawaiData.length}
          </div>
          <div>
            <span className="font-semibold">Total Kegiatan:</span> {kegiatan.length}
          </div>
          <div>
            <span className="font-semibold">Rata-rata Progress:</span>{" "}
            {pegawaiData.length > 0
              ? Math.round(pegawaiData.reduce((sum, p) => sum + p.persentaseSelesai, 0) / pegawaiData.length)
              : 0}%
          </div>
          <div>
            <span className="font-semibold">Pegawai Aktif:</span>{" "}
            {pegawaiData.filter(p => p.jumlahKegiatan > 0).length}
          </div>
        </div>
      </div>
    </div>
  );
}