/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ProgressCard.tsx
"use client";
import { useState } from 'react';

interface ProgressData {
  target: number;
  tercapai: number;
  progress_percentage: number;
  last_updated: Date;
  catatan?: string;
}

interface Kegiatan {
  id: string;
  nama_kegiatan: string;
  target_petugas: number;
  satuan_target: string;
  progress?: ProgressData;
}

interface ProgressCardProps {
  kegiatan: Kegiatan;
  onUpdateProgress: (kegiatanId: string, tercapai: number, catatan: string) => Promise<void>;
  onCancelEdit?: () => void;
}

export default function ProgressCard({ kegiatan, onUpdateProgress, onCancelEdit }: ProgressCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tercapai, setTercapai] = useState(kegiatan.progress?.tercapai || 0);
  const [catatan, setCatatan] = useState(kegiatan.progress?.catatan || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (tercapai > kegiatan.target_petugas) {
      setError(`Nilai tidak boleh melebihi target (${kegiatan.target_petugas})`);
      return;
    }

    if (tercapai < 0) {
      setError('Nilai tidak boleh negatif');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onUpdateProgress(kegiatan.id, tercapai, catatan);
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message || 'Gagal menyimpan progress');
      console.error('Error saving progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTercapai(kegiatan.progress?.tercapai || 0);
    setCatatan(kegiatan.progress?.catatan || '');
    setError('');
    setIsEditing(false);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleEdit = () => {
    setTercapai(kegiatan.progress?.tercapai || 0);
    setCatatan(kegiatan.progress?.catatan || '');
    setError('');
    setIsEditing(true);
  };

  const progressPercentage = kegiatan.progress 
    ? Math.round((kegiatan.progress.tercapai / kegiatan.target_petugas) * 100)
    : 0;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {kegiatan.nama_kegiatan}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Target: {kegiatan.target_petugas.toLocaleString('id-ID')} {kegiatan.satuan_target}
          </p>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
            disabled={loading}
          >
            Edit Progress
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Progress Tercapai ({kegiatan.satuan_target})
            </label>
            <input
              type="number"
              min="0"
              max={kegiatan.target_petugas}
              value={tercapai}
              onChange={(e) => setTercapai(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maksimal: {kegiatan.target_petugas.toLocaleString('id-ID')} {kegiatan.satuan_target}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catatan (Opsional)
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tambahkan catatan tentang progress yang dicapai..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors text-sm font-medium min-w-[80px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {kegiatan.progress ? (
            <>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress:
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {kegiatan.progress.tercapai.toLocaleString('id-ID')} / {kegiatan.progress.target.toLocaleString('id-ID')} {kegiatan.satuan_target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {progressPercentage}% selesai
                  </span>
                  {progressPercentage === 100 && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      ✅ Selesai
                    </span>
                  )}
                </div>
              </div>

              {kegiatan.progress.catatan && (
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Catatan:
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    {kegiatan.progress.catatan}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400">
                📅 Terakhir diupdate: {kegiatan.progress.last_updated.toLocaleString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Belum ada progress yang dicatat. Klik `Edit Progress` untuk mulai melaporkan.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}