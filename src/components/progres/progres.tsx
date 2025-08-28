// app/progress/page.tsx
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
        
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
       
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <PageBreadcrumb pageTitle="Progress Kegiatan" />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Progress Kegiatan Saya
            </h1>
            {kegiatanList.length > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {kegiatanList.length} Kegiatan
              </span>
            )}
          </div>

          {/* Debug Information */}
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              🔍 Debug Information
            </h3>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>👤 User: {user?.username}</p>
              <p>🏢 Role: {user?.role}</p>
              <p>📊 Total Kegiatan di DB: {allKegiatanCount}</p>
              <p>✅ Kegiatan Ditugaskan: {kegiatanList.length}</p>
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
                  <p className="text-yellow-700 dark:text-yellow-300 mt-1">
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