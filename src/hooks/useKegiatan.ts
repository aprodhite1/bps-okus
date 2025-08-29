/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Kegiatan } from "@/types/typeKegiatan"


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

    const q = query(collection(db, "kegiatan"), orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const kegiatanData: Kegiatan[] = [];

        const convertTimestamp = (ts: any): Date => {
          if (!ts) return new Date();
          if (ts.toDate) return ts.toDate();
          if (typeof ts === "string") return new Date(ts);
          return new Date(ts);
        };

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          kegiatanData.push({
            id: doc.id,
            nama_kegiatan: data.nama_kegiatan || "Tanpa Nama",
            iku: data.iku || "",
            rk: data.rk || "",
            proyek: data.proyek || "",
            tanggal_mulai: convertTimestamp(data.tanggal_mulai),
            tanggal_selesai: convertTimestamp(data.tanggal_selesai),
            petugas_target: Array.isArray(data.petugas_target) ? data.petugas_target : [],
            satuan_target: data.satuan_target || "",
            status: data.status || "draft",
            created_at: convertTimestamp(data.created_at),
            updated_at: data.updated_at ? convertTimestamp(data.updated_at) : undefined,
            created_by: data.created_by || "",
            mitra: data.mitra || null,
            progress: data.progress || {}
          });
        });

        setKegiatan(kegiatanData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error fetching kegiatan:", error);
        setError(`Gagal memuat data kegiatan: ${error.message}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { kegiatan, loading, error };
};
