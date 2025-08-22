// hooks/useKegiatan.ts
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';
import { KegiatanWithProgress } from '@/types/kegiatan';

export const useKegiatan = () => {
  const { user } = useAuth();
  const [kegiatan, setKegiatan] = useState<KegiatanWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'kegiatan'),
      where('pegawai', 'array-contains', user.username)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const kegiatanData: KegiatanWithProgress[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        userProgress: doc.data().progress?.[user.username]
      }));

      setKegiatan(kegiatanData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { kegiatan, loading };
};