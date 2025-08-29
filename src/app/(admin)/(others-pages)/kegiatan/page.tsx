// app/kegiatan-selesai/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';


interface KegiatanSelesai {
  id: string;
  nama_kegiatan: string;
  status: string;
  completedAt: Date;
  completedBy: string;
  feedback?: string;
  rating?: number;
  createdBy: string;
}

export default function KegiatanSelesaiPage() {
  const { user } = useAuth();
  const [kegiatanSelesai, setKegiatanSelesai] = useState<KegiatanSelesai[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKegiatan, setEditingKegiatan] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'kegiatan'),
      where('status', '==', 'selesai'),
      
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const kegiatanData: KegiatanSelesai[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate() || new Date(),
      } as KegiatanSelesai));

      setKegiatanSelesai(kegiatanData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmitFeedback = async (kegiatanId: string) => {
    if (!feedback.trim()) return;

    try {
      const kegiatanRef = doc(db, 'kegiatan', kegiatanId);
      await updateDoc(kegiatanRef, {
        feedback,
        rating,
        feedbackAt: new Date()
      });
      
      setEditingKegiatan(null);
      setFeedback('');
      setRating(5);
      alert('Feedback berhasil disimpan!');
    } catch (error) {
      console.error('Error menyimpan feedback:', error);
      alert('Gagal menyimpan feedback');
    }
  };

  if (loading) {
    return (
      
      <ProtectedRoute>
        <>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Kegiatan yang Telah Selesai
          </h1>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-20 rounded"></div>
            ))}
          </div>
        </div>
        </>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Kegiatan yang Telah Selesai
        </h1>

        {kegiatanSelesai.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Belum ada kegiatan yang selesai
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Kegiatan yang telah ditandai sebagai selesai akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {kegiatanSelesai.map((kegiatan) => (
              <div key={kegiatan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {kegiatan.nama_kegiatan}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Diselesaikan pada: {kegiatan.completedAt.toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  
                  {kegiatan.feedback ? (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      Feedback Terkirim
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingKegiatan(kegiatan.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Beri Feedback
                    </button>
                  )}
                </div>

                {editingKegiatan === kegiatan.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Berikan Feedback untuk Kegiatan
                    </h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rating (1-5)
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:text-white"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} Bintang
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Feedback
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:text-white"
                        placeholder="Tulis feedback Anda mengenai kegiatan ini..."
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSubmitFeedback(kegiatan.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Kirim Feedback
                      </button>
                      <button
                        onClick={() => setEditingKegiatan(null)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {kegiatan.feedback && !editingKegiatan && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h4 className="text-sm font-medium text-green-900 dark:text-green-200 mb-2">
                      Feedback Anda:
                    </h4>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm text-green-800 dark:text-green-300">
                        {kegiatan.rating}/5 Bintang
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      {kegiatan.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}