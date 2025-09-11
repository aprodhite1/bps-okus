"use client";
import { useState, useEffect } from 'react';
import { collection, query, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ProgressCard from '@/components/progres/progressCard';

interface ProgressData {
  target: number;
  tercapai: number;
  progress_percentage: number;
  last_updated: Date;
  catatan?: string;
}

interface PetugasTarget {
  pegawai: string;
  target: number;
}

interface KegiatanWithProgress {
  id: string;
  nama_kegiatan: string;
  target_petugas: number;
  satuan_target: string;
  status: string;
  petugas_target: PetugasTarget[];
  progress?: ProgressData;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [kegiatanList, setKegiatanList] = useState<KegiatanWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [allKegiatanCount, setAllKegiatanCount] = useState(0);
  const [, setEditingKegiatan] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.username) return;

    const fetchKegiatan = async () => {
      try {
        console.log('🔍 Fetching kegiatan untuk user:', user.username);
        
        // Query semua kegiatan
        const q = query(collection(db, 'kegiatan'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const kegiatanData: KegiatanWithProgress[] = [];
          let totalDocs = 0;
          let assignedDocs = 0;
          
          console.log('📊 Total dokumen ditemukan:', querySnapshot.size);
          setAllKegiatanCount(querySnapshot.size);
          
          querySnapshot.forEach((doc) => {
            totalDocs++;
            const data = doc.data();
            
            // Debug: log semua data kegiatan
            console.log(`📋 Dokumen ${totalDocs}:`, {
              id: doc.id,
              nama: data.nama_kegiatan,
              petugas_target: data.petugas_target,
              hasPetugasTarget: !!data.petugas_target,
              petugasTargetType: Array.isArray(data.petugas_target) ? 'array' : typeof data.petugas_target
            });

            // Pastikan petugas_target adalah array
            if (!Array.isArray(data.petugas_target)) {
              console.log('❌ petugas_target bukan array, skip:', doc.id);
              return;
            }

            // Filter: cek apakah user ada dalam petugas_target
            const isUserAssigned = data.petugas_target.some(
              (petugas: PetugasTarget) => {
                const isMatch = petugas.pegawai === user.username;
                console.log(`   🔍 Cek ${petugas.pegawai} == ${user.username}: ${isMatch}`);
                return isMatch;
              }
            );

            console.log(`   ✅ User ${user.username} assigned: ${isUserAssigned}`);

            if (isUserAssigned && data.nama_kegiatan && data.satuan_target) {
              assignedDocs++;
              
              // Dapatkan target khusus untuk user ini
              const userTargetObj = data.petugas_target.find(
                (petugas: PetugasTarget) => petugas.pegawai === user.username
              );
              
              const userTarget = userTargetObj?.target || 0;
              const userProgress = data.progress?.[user.username];
              
              console.log(`   🎯 Target user: ${userTarget}`);

              kegiatanData.push({
                id: doc.id,
                nama_kegiatan: data.nama_kegiatan,
                target_petugas: userTarget,
                satuan_target: data.satuan_target,
                status: data.status || 'draft',
                petugas_target: data.petugas_target,
                progress: userProgress ? {
                  target: userProgress.target || userTarget,
                  tercapai: userProgress.tercapai || 0,
                  progress_percentage: userProgress.progress_percentage || 0,
                  last_updated: userProgress.last_updated?.toDate() || new Date(),
                  catatan: userProgress.catatan || ''
                } : undefined
              });
            }
          });

          console.log('📈 Hasil filtering:');
          console.log('   Total dokumen:', totalDocs);
          console.log('   Dokumen assigned:', assignedDocs);
          console.log('   Kegiatan ditampilkan:', kegiatanData.length);
          console.log('   Detail kegiatan:', kegiatanData);

          setKegiatanList(kegiatanData);
          setLoading(false);
        }, (error) => {
          console.error('❌ Error in onSnapshot:', error);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('❌ Error fetching kegiatan:', error);
        setLoading(false);
      }
    };

    fetchKegiatan();
  }, [user]);

  const handleUpdateProgress = async (kegiatanId: string, tercapai: number, catatan: string) => {
    if (!user || !user.username) throw new Error('User tidak ditemukan');

    try {
      const kegiatan = kegiatanList.find(k => k.id === kegiatanId);
      if (!kegiatan) throw new Error('Kegiatan tidak ditemukan');
      
      const progressPercentage = Math.round((tercapai / kegiatan.target_petugas) * 100);
      
      await updateDoc(doc(db, 'kegiatan', kegiatanId), {
        [`progress.${user.username}`]: {
          target: kegiatan.target_petugas,
          tercapai: tercapai,
          progress_percentage: progressPercentage,
          last_updated: new Date(),
          catatan: catatan.trim()
        },
        updated_at: new Date()
      });

      setEditingKegiatan(null);
    } catch (error) {
      console.error('Error updating progress:', error);
      throw new Error('Gagal menyimpan progress');
    }
  };

  const handleCancelEdit = () => {
    setEditingKegiatan(null);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  // Hitung metrik untuk Ringkasan Progres Kegiatan
  const currentDate = new Date('2025-09-11T08:59:00+07:00'); // Sesuai waktu saat ini
  const activeKegiatan = kegiatanList.filter(k => k.status.toLowerCase() !== 'selesai');
  const progressToday = kegiatanList
    .filter(k => k.progress?.last_updated && new Date(k.progress.last_updated).toDateString() === currentDate.toDateString())
    .reduce((sum, k) => sum + (k.progress?.tercapai || 0), 0);
  const targetRemaining = kegiatanList.reduce((sum, k) => sum + ((k.progress?.target || k.target_petugas) - (k.progress?.tercapai || 0)), 0);
  const averageProgress = kegiatanList.length > 0
    ? Math.round(kegiatanList.reduce((sum, k) => sum + (k.progress?.progress_percentage || 0), 0) / kegiatanList.length)
    : 0;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <PageBreadcrumb pageTitle="Progress Kegiatan" />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* Ringkasan Progres Kegiatan */}
          <div className="mb-6 bg-gradient-to-r from-blue-500 to-blue-500 dark:from-blue-800 dark:to-blue-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
              </svg>
              Ringkasan Progres Kegiatan Saya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Kegiatan Aktif</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeKegiatan.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{progressToday.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Target Tersisa</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{targetRemaining.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Rata-rata Progress</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageProgress}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {kegiatanList.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                Belum ada kegiatan yang ditugaskan
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Admin akan menambahkan Anda ke dalam daftar petugas kegiatan
              </p>
              
              {user && allKegiatanCount > 0 && (
                <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs">
                  <p className="text-yellow-800 dark:text-yellow-400">
                    ⚠️ Ditemukan {allKegiatanCount} kegiatan, tapi tidak ada yang ditugaskan ke user ini.
                  </p>
                  <p className="text-yellow-800 dark:text-yellow-400 mt-1">
                    Pastikan username `{user.username}` ada di field petugas_target.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {kegiatanList.map((kegiatan) => (
                <ProgressCard
                  key={kegiatan.id}
                  kegiatan={kegiatan}
                  onUpdateProgress={handleUpdateProgress}
                  onCancelEdit={handleCancelEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}