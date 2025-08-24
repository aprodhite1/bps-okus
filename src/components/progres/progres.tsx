// app/progress/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext'; // Pastikan path ini benar
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

interface KegiatanWithProgress {
  id: string;
  nama_kegiatan: string;
  target_petugas: number;
  satuan_target: string;
  pegawai: string[]; // Tambahkan ini
  status: string; // Tambahkan ini
  progress?: ProgressData;
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [kegiatanList, setKegiatanList] = useState<KegiatanWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKegiatan, setEditingKegiatan] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.username) return;

    const fetchKegiatan = async () => {
      try {
        console.log('Fetching kegiatan for user:', user.username);
        
        // Query yang lebih sederhana - hanya filter by pegawai dulu
        const q = query(
          collection(db, 'kegiatan'),
          where('pegawai', 'array-contains', user.username)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const kegiatanData: KegiatanWithProgress[] = [];
          
          console.log('Jumlah dokumen ditemukan:', querySnapshot.size);
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Data kegiatan:', data);
            
            // Pastikan field yang diperlukan ada
            if (data.nama_kegiatan && data.target_petugas && data.satuan_target) {
              const userProgress = data.progress?.[user.username];
              
              kegiatanData.push({
                id: doc.id,
                nama_kegiatan: data.nama_kegiatan,
                target_petugas: data.target_petugas,
                satuan_target: data.satuan_target,
                pegawai: data.pegawai || [], // Pastikan ada
                status: data.status || 'draft', // Default value
                progress: userProgress ? {
                  target: userProgress.target || data.target_petugas,
                  tercapai: userProgress.tercapai || 0,
                  progress_percentage: userProgress.progress_percentage || 0,
                  last_updated: userProgress.last_updated?.toDate() || new Date(),
                  catatan: userProgress.catatan || ''
                } : undefined
              });
            }
          });

          console.log('Kegiatan data:', kegiatanData);
          setKegiatanList(kegiatanData);
          setLoading(false);
        }, (error) => {
          console.error('Error in onSnapshot:', error);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching kegiatan:', error);
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <PageBreadcrumb 
          pageTitle="Progress Kegiatan" 
          items={[{ title: 'Dashboard', href: '/' }, { title: 'Progress' }]} // Perbaiki path dashboard
        />
        
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
              
              {/* Debug info untuk developer */}
              {user && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                  <p>Username: {user.username}</p>
                  <p>Role: {user.role}</p>
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