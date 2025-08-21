import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Kegiatan {
  id: string;
  iku: string;
  rk: string;
  proyek: string;
  nama_kegiatan: string;
  tanggal_mulai: string | Date;
  tanggal_selesai: string | Date;
  pegawai?: string;
  mitra?: string;
  target_petugas: number;
  satuan_target: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

// Helper function to convert Firestore Timestamp or string to Date
const convertToDate = (dateValue: any): Date => {
  if (dateValue instanceof Date) {
    return dateValue;
  }
  if (dateValue && typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  if (typeof dateValue === 'string') {
    return new Date(dateValue);
  }
  if (dateValue && dateValue.seconds) {
    return new Date(dateValue.seconds * 1000);
  }
  return new Date(); // fallback
};

export function useKegiatan() {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    try {
      const q = query(
        collection(db, 'kegiatan'),
        orderBy('created_at', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const kegiatanData: Kegiatan[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            kegiatanData.push({
              id: doc.id,
              iku: data.iku || '',
              rk: data.rk || '',
              proyek: data.proyek || '',
              nama_kegiatan: data.nama_kegiatan || '',
              tanggal_mulai: convertToDate(data.tanggal_mulai),
              tanggal_selesai: convertToDate(data.tanggal_selesai),
              pegawai: data.pegawai,
              mitra: data.mitra,
              target_petugas: Number(data.target_petugas) || 0,
              satuan_target: data.satuan_target || '',
              status: data.status || 'draft',
              created_at: convertToDate(data.created_at),
              updated_at: convertToDate(data.updated_at)
            });
          });
          setKegiatan(kegiatanData);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching kegiatan:', error);
          setError(error.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error: any) {
      console.error('Error setting up listener:', error);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  return { kegiatan, loading, error };
}