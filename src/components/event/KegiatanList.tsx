/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useKegiatan } from '@/hooks/useKegiatan';

export default function KegiatanList() {
  const { kegiatan, loading, error } = useKegiatan();

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const hitungProgressKegiatan = (item: any) => {
    if (!item.progress) return 0;
    const totalTercapai = Object.values(item.progress).reduce(
      (sum: number, p: any) => sum + (p.tercapai || 0),
      0
    );
    const totalTarget = item.petugas_target.reduce(
      (sum: number, p: any) => sum + (p.target || 0),
      0
    );
    if (totalTarget === 0) return 0;
    return Math.round((totalTercapai / totalTarget) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error: </strong> {error}
      </div>
    );
  }

  if (kegiatan.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Belum ada data kegiatan. Silakan tambah kegiatan terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Nama Kegiatan
            </th>
            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              IKU
            </th>
            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              RK
            </th>
            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tanggal
            </th>
            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Target
            </th>
            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Progress
            </th>
            <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {kegiatan.map((item) => {
            const totalTarget = item.petugas_target.reduce(
              (sum, p) => sum + (p.target || 0),
              0
            );
            const progressKegiatan = hitungProgressKegiatan(item);

            return (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.nama_kegiatan}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.proyek}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.iku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {item.rk}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {totalTarget} {item.satuan_target}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {progressKegiatan}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.status === 'selesai'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
