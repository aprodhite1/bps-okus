/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface FeedbackItem {
  saran: string;
  solusi: string;
  buktiDukung: string;
  deskripsi: string;
  kendala: string;
  linkBuktiDukung: string;
  feedbackAt: Date;
  feedbackBy: string;
}

interface Kegiatan {
  id: string;
  nama_kegiatan: string;
  iku: string;
  rk: string;
  proyek: string;
  status: string;
  createdBy: string;
  feedback?: FeedbackItem[];
}

export default function FeedbackPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state - sesuai dengan struktur FeedbackItem
  const [deskripsi, setDeskripsi] = useState('');
  const [kendala, setKendala] = useState('');
  const [solusi, setSolusi] = useState('');
  const [saran, setSaran] = useState('');
  const [buktiDukung, setBuktiDukung] = useState('');
  const [linkBuktiDukung, setLinkBuktiDukung] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchKegiatan = async () => {
      try {
        const docRef = doc(db, 'kegiatan', id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Konversi feedback ke array jika masih object lama (sama seperti di page.tsx)
          let feedbackArray: FeedbackItem[] = [];
          if (data.feedback) {
            if (Array.isArray(data.feedback)) {
              feedbackArray = data.feedback.map((item: any) => ({
                ...item,
                feedbackAt: item.feedbackAt?.toDate() || new Date()
              }));
            } else {
              feedbackArray = [{
                saran: data.feedback.saran || '',
                deskripsi: data.feedback.deskripsi || '',
                solusi: data.feedback.solusi || '',
                kendala: data.feedback.kendala || '',
                buktiDukung: data.feedback.buktiDukung || '',
                linkBuktiDukung: data.feedback.linkBuktiDukung || '',
                feedbackAt: data.feedback.feedbackAt?.toDate() || new Date(),
                feedbackBy: data.feedback.feedbackBy || ''
              }];
            }
          }

          setKegiatan({
            id: docSnap.id,
            ...data,
            feedback: feedbackArray
          } as Kegiatan);
        } else {
          console.error('Kegiatan tidak ditemukan');
        }
      } catch (error) {
        console.error('Error fetching kegiatan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKegiatan();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kegiatan || !user) return;

    setSubmitting(true);

    try {
      const kegiatanRef = doc(db, 'kegiatan', kegiatan.id);
      const feedbackData = {
        saran,
        solusi,
        buktiDukung,
        deskripsi,
        kendala,
        linkBuktiDukung,
        feedbackAt: new Date(),
        feedbackBy: user.username || user.email // Fallback ke email jika username tidak ada
      };

      // Gunakan arrayUnion untuk menambahkan ke array feedback
      await updateDoc(kegiatanRef, {
        feedback: arrayUnion(feedbackData)
      });

      alert('Feedback berhasil dikirim!');
      router.push('/kegiatan-selesai');
    } catch (error) {
      console.error('Error mengirim feedback:', error);
      alert('Gagal mengirim feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!kegiatan) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Kegiatan tidak ditemukan
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Kembali
        </button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Formulir Feedback Kegiatan
        </h1>

        {/* Informasi Kegiatan */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informasi Kegiatan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400"><strong>Judul Kegiatan:</strong></p>
              <p className="text-gray-900 dark:text-white">{kegiatan.nama_kegiatan}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400"><strong>IKU:</strong></p>
              <p className="text-gray-900 dark:text-white">{kegiatan.iku}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400"><strong>RK:</strong></p>
              <p className="text-gray-900 dark:text-white">{kegiatan.rk}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400"><strong>Proyek:</strong></p>
              <p className="text-gray-900 dark:text-white">{kegiatan.proyek}</p>
            </div>
          </div>
        </div>

        {/* Form Feedback */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Berikan Feedback
          </h2>

          {/* Deskripsi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deskripsi Kegiatan
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Deskripsikan kegiatan yang telah dilakukan..."
              required
            />
          </div>

          {/* Kendala */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kendala yang Dihadapi
            </label>
            <textarea
              value={kendala}
              onChange={(e) => setKendala(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Apa kendala yang dihadapi selama pelaksanaan kegiatan?"
              required
            />
          </div>

          {/* Solusi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Solusi Atas Kendala
            </label>
            <textarea
              value={solusi}
              onChange={(e) => setSolusi(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Bagaimana solusi atas kendala yang dihadapi?"
              required
            />
          </div>

          {/* Saran */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Saran dan Masukan
            </label>
            <textarea
              value={saran}
              onChange={(e) => setSaran(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Berikan saran dan masukan untuk kegiatan ini..."
              required
            />
          </div>

          {/* Bukti Dukung */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bukti Dukung
            </label>
            <textarea
              value={buktiDukung}
              onChange={(e) => setBuktiDukung(e.target.value)}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Deskripsi bukti dukung kegiatan..."
            />
          </div>

          {/* Link Bukti Dukung */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link Bukti Dukung
            </label>
            <input
              type="url"
              value={linkBuktiDukung}
              onChange={(e) => setLinkBuktiDukung(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="https://example.com/link-bukti-dukung"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Mengirim...' : 'Kirim Feedback'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}