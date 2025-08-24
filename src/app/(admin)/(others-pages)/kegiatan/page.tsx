'use client';


import KegiatanList from '@/components/event/KegiatanList';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ContentLoader from '@/components/Loading/ContentLoader';
import Link from 'next/link';
import { useKegiatan } from '@/hooks/useKegiatan';

export default function KegiatanPage() {
  
  const {  loading, error } = useKegiatan();

  if (loading) {
    return (
      <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daftar Kegiatan
          </h1>
          <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <ContentLoader count={5} />
        </div>
      </div></ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div></ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Daftar Kegiatan
        </h1>
        
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <KegiatanList />
      </div>
    </div></ProtectedRoute>
  );
}