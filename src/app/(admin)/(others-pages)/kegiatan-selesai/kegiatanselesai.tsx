/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import * as XLSX from 'xlsx';

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

interface KegiatanSelesai {
  id: string;
  nama_kegiatan: string;
  iku: string;
  rk: string;
  proyek: string;
  status: string;
  completedAt: Date;
  completedBy: string;
  feedback?: FeedbackItem[];
  createdBy: string;
}

interface KegiatanSelesaiProps {
  initialData?: KegiatanSelesai[]; // Make initialData optional
}

const downloadFeedbackExcel = (kegiatanList: KegiatanSelesai[]) => {
  const excelData: any[] = [];
  
  kegiatanList.forEach(kegiatan => {
    if (kegiatan.feedback && kegiatan.feedback.length > 0) {
      kegiatan.feedback.forEach(feedbackItem => {
        excelData.push({
          'Judul Kegiatan': kegiatan.nama_kegiatan,
          'IKU': kegiatan.iku,
          'RK': kegiatan.rk,
          'Proyek': kegiatan.proyek,
          'Deskripsi': feedbackItem.deskripsi,
          'Kendala': feedbackItem.kendala,
          'Solusi': feedbackItem.solusi,
          'Saran': feedbackItem.saran,
          'Bukti Dukung': feedbackItem.buktiDukung,
          'Link Bukti Dukung': feedbackItem.linkBuktiDukung,
          'Tanggal Feedback': feedbackItem.feedbackAt ? new Date(feedbackItem.feedbackAt).toLocaleDateString('id-ID') : '',
          'Diberikan Oleh': feedbackItem.feedbackBy || '',
          'Tanggal Selesai': kegiatan.completedAt.toLocaleDateString('id-ID'),
          'Diselesaikan Oleh': kegiatan.completedBy,
        });
      });
    }
  });
  
  if (excelData.length === 0) {
    alert('Tidak ada feedback yang dapat didownload');
    return;
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  const colWidths = [
    { wch: 30 }, // Judul Kegiatan
    { wch: 15 }, // IKU
    { wch: 15 }, // RK
    { wch: 20 }, // Proyek
    { wch: 30 }, // Deskripsi
    { wch: 30 }, // Kendala
    { wch: 40 }, // Solusi
    { wch: 40 }, // Saran
    { wch: 30 }, // Bukti Dukung
    { wch: 30 }, // Link Bukti Dukung
    { wch: 15 }, // Tanggal Feedback
    { wch: 20 }, // Diberikan Oleh
    { wch: 15 }, // Tanggal Selesai
    { wch: 20 }, // Diselesaikan Oleh
  ];
  worksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback Kegiatan');
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileName = `feedback-kegiatan-${timestamp}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export default function KegiatanSelesai({ initialData = [] }: KegiatanSelesaiProps) {
  const { user } = useAuth();
  const [kegiatanSelesai, setKegiatanSelesai] = useState<KegiatanSelesai[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'kegiatan'),
        where('status', '==', 'selesai')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const kegiatanData: KegiatanSelesai[] = snapshot.docs.map(doc => {
            const data = doc.data();
            let feedbackArray: FeedbackItem[] = [];
            if (data.feedback) {
              if (Array.isArray(data.feedback)) {
                feedbackArray = data.feedback.map((item: any) => ({
                  ...item,
                  feedbackAt: item.feedbackAt?.toDate() || new Date(),
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
                  feedbackBy: data.feedback.feedbackBy || '',
                }];
              }
            }

            return {
              id: doc.id,
              nama_kegiatan: data.nama_kegiatan || 'Tanpa Nama',
              iku: data.iku || '',
              rk: data.rk || '',
              proyek: data.proyek || '',
              status: data.status || 'selesai',
              completedAt: data.completedAt?.toDate() || new Date(),
              completedBy: data.completedBy || '',
              feedback: feedbackArray,
              createdBy: data.created_by || '',
            } as KegiatanSelesai;
          });

          setKegiatanSelesai(kegiatanData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching completed activities:', err);
          setError('Gagal memuat data kegiatan selesai');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up listener:', err);
      setError('Terjadi kesalahan dalam memuat data');
      setLoading(false);
    }
  }, [user]);

  const totalFeedback = kegiatanSelesai.reduce((total, kegiatan) => {
    return total + (kegiatan.feedback ? kegiatan.feedback.length : 0);
  }, 0);

  if (loading) {
    return (
      <ProtectedRoute>
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
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Kegiatan yang Telah Selesai
          </h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kegiatan yang Telah Selesai
          </h1>
          {kegiatanSelesai.length > 0 && (
            <div className="flex space-x-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                {kegiatanSelesai.length} Kegiatan
              </span>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                {totalFeedback} Feedback
              </span>
              <button
                onClick={() => downloadFeedbackExcel(kegiatanSelesai)}
                disabled={totalFeedback === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download Feedback (Excel)
              </button>
            </div>
          )}
        </div>

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
            {kegiatanSelesai.map((kegiatan) => {
              const jumlahFeedback = kegiatan.feedback ? kegiatan.feedback.length : 0;
              return (
                <div key={kegiatan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {kegiatan.nama_kegiatan}
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mt-2">
                        <p><strong>IKU:</strong> {kegiatan.iku}</p>
                        <p><strong>RK:</strong> {kegiatan.rk}</p>
                        <p><strong>Proyek:</strong> {kegiatan.proyek}</p>
                        <p>Diselesaikan pada: {kegiatan.completedAt.toLocaleDateString('id-ID')}</p>
                        {kegiatan.createdBy && <p>Dibuat oleh: {kegiatan.createdBy}</p>}
                        {jumlahFeedback > 0 && <p><strong>{jumlahFeedback} Feedback</strong></p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {jumlahFeedback > 0 ? (
                        <div className="flex items-center space-x-2">
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {jumlahFeedback} Feedback
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={`/kegiatan-selesai/${kegiatan.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Beri Feedback
                        </Link>
                      )}
                      {jumlahFeedback > 0 && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const detail = kegiatan.feedback!.map((fb, index) => `
                                Feedback #${index + 1}:
                                - Dari: ${fb.feedbackBy}
                                - Deskripsi: ${fb.deskripsi}
                                - Kendala: ${fb.kendala}
                                - Solusi: ${fb.solusi}
                                - Saran: ${fb.saran}
                                - Bukti Dukung: ${fb.buktiDukung || 'Tidak ada'}
                                - Link Bukti Dukung: ${fb.linkBuktiDukung || 'Tidak ada'}
                                - Tanggal: ${fb.feedbackAt.toLocaleDateString('id-ID')}
                              `).join('\n------------------------\n');
                              alert(detail);
                            }}
                            className="text-blue-600 text-sm hover:text-blue-800 dark:text-blue-400"
                          >
                            Lihat Semua Feedback
                          </button>
                          <Link
                            href={`/kegiatan-selesai/${kegiatan.id}`}
                            className="text-green-600 text-sm hover:text-green-800 dark:text-green-400"
                          >
                            Tambah Feedback
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}