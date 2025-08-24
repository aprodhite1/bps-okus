/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export interface ProgressData {
  target: number;
  tercapai: number;
  progress_percentage: number;
  last_updated: any;
  catatan?: string;
}

export interface KegiatanProgress {
  [username: string]: ProgressData;
}

export interface Kegiatan {
  id: string;
  nama_kegiatan: string;
  iku: string;
  rk: string;
  proyek: string;
  tanggal_mulai: any;
  tanggal_selesai: any;
  target_petugas: number;
  satuan_target: string;
  status: string;
  created_at: any;
  updated_at?: any;
  pegawai: string[];
  progress?: KegiatanProgress; // Gunakan interface yang sudah didefinisikan
}

export const useKegiatan = () => {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.username) {
      setLoading(false);
      return;
    }

    try {
      console.log('Mengambil data kegiatan untuk user:', user.username);
      
      const q = query(
        collection(db, 'kegiatan'),
        where('pegawai', 'array-contains', user.username),
        orderBy('created_at', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          console.log('Data diterima dari Firestore:', querySnapshot.size, 'dokumen');
          
          const kegiatanData: Kegiatan[] = [];
          
          querySnapshot.forEach((doc) => {
            try {
              const data = doc.data();
              console.log('Data kegiatan:', data);
              
              // Convert Firestore Timestamp to Date
              const convertTimestamp = (timestamp: any) => {
                if (!timestamp) return new Date();
                return timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
              };

              kegiatanData.push({
                id: doc.id,
                nama_kegiatan: data.nama_kegiatan || 'Tanpa Nama',
                iku: data.iku || '',
                rk: data.rk || '',
                proyek: data.proyek || '',
                tanggal_mulai: convertTimestamp(data.tanggal_mulai),
                tanggal_selesai: convertTimestamp(data.tanggal_selesai),
                target_petugas: data.target_petugas || 0,
                satuan_target: data.satuan_target || '',
                status: data.status || 'draft',
                created_at: convertTimestamp(data.created_at),
                updated_at: data.updated_at ? convertTimestamp(data.updated_at) : undefined,
                pegawai: data.pegawai || [],
                progress: data.progress || {}
              });
            } catch (docError) {
              console.error('Error processing document:', docError);
            }
          });

          console.log('Kegiatan data processed:', kegiatanData);
          setKegiatan(kegiatanData);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Error fetching kegiatan:', error);
          setError(`Gagal memuat data kegiatan: ${error.message}`);
          setLoading(false);
          
          // Fallback: coba ambil data dengan cara lain
          
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up listener:', error);
      setError('Terjadi kesalahan saat memuat data');
      setLoading(false);
    }
  }, [user]);

  

  return { kegiatan, loading, error };
};