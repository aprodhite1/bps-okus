import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string; // Tambahkan field role
}

export const usePegawai = () => {
  const [pegawai, setPegawai] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        // Buat query untuk hanya mengambil user dengan role 'user' atau 'admin'
        const q = query(
          collection(db, 'users'),
          where('role', 'in', ['user', 'admin'])
        );
        
        const querySnapshot = await getDocs(q);
        const usersData: User[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          usersData.push({
            id: doc.id,
            username: data.username || '',
            name: data.name || '',
            email: data.email || '',
            role: data.role || 'user', // Default ke 'user' jika tidak ada
          });
        });
        
        setPegawai(usersData);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data pegawai');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchPegawai();
  }, []);

  return { pegawai, loading, error };
};