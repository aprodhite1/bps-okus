'use client';

import { useKegiatan } from '@/hooks/useKegiatan';

export default function KegiatanCard() {
  const { kegiatan, loading, error } = useKegiatan();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (kegiatan.length === 0) return <div>Belum ada data kegiatan</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kegiatan.map((item) => (
        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {item.nama_kegiatan}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p><strong>IKU:</strong> {item.iku}</p>
            <p><strong>RK:</strong> {item.rk}</p>
            <p><strong>Proyek:</strong> {item.proyek}</p>
            <p><strong>Periode:</strong> {item.tanggal_mulai.toLocaleDateString('id-ID')} - {item.tanggal_selesai.toLocaleDateString('id-ID')}</p>
            <p><strong>Target:</strong> {item.target_petugas} {item.satuan_target}</p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              item.status === 'selesai' 
                ? 'bg-green-100 text-green-800' 
                : item.status === 'progress'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {item.status}
            </span>
            
            <span className="text-xs text-gray-500">
              {item.created_at.toLocaleDateString('id-ID')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}