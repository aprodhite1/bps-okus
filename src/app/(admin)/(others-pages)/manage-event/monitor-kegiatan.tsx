"use client";

import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { FaEdit, FaTrash } from "react-icons/fa";

// Definisikan tipe untuk kegiatan
interface Kegiatan {
  id: number;
  nama_kegiatan: string;
  status: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  target_petugas: string;
  satuan_target: string;
}

const MonitorKegiatan: React.FC = () => {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulasi data kegiatan (ganti dengan fetch API jika ada)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockData: Kegiatan[] = [
          {
            id: 1,
            nama_kegiatan: "Pencacahan Rumah Tangga Sampel Susenas",
            status: "Selesai",
            tanggal_mulai: "2025-08-01",
            tanggal_selesai: "2025-08-03",
            target_petugas: "50",
            satuan_target: "Rumah Tangga",
          },
          {
            id: 2,
            nama_kegiatan: "Pengumpulan Data Sensus Ekonomi",
            status: "Berjalan",
            tanggal_mulai: "2025-08-05",
            tanggal_selesai: "2025-08-15",
            target_petugas: "30",
            satuan_target: "Dokumen",
          },
          {
            id: 3,
            nama_kegiatan: "Analisis Data Statistik",
            status: "Dibatalkan",
            tanggal_mulai: "2025-08-10",
            tanggal_selesai: "2025-08-20",
            target_petugas: "20",
            satuan_target: "Dokumen",
          },
        ];
        setKegiatanList(mockData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Gagal memuat data kegiatan!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk menghapus kegiatan
  const handleDelete = (id: number) => {
    setKegiatanList(kegiatanList.filter((item) => item.id !== id));
  };

  // Fungsi untuk menentukan warna berdasarkan status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "selesai":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900";
      case "berjalan":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900";
      case "dibatalkan":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600 dark:text-gray-300">Memuat data...</div>;
  if (error) return <div className="p-6 text-center text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div>
      <PageBreadcrumb pageTitle="Monitoring Kegiatan" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-gray-900 xl:px-10 xl:py-12">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Daftar Kegiatan</h1>
          {kegiatanList.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada kegiatan yang dipantau.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-3 border text-gray-800 dark:text-gray-200">Nama Kegiatan</th>
                    <th className="p-3 border text-gray-800 dark:text-gray-200">Status</th>
                    <th className="p-3 border text-gray-800 dark:text-gray-200">Tanggal Mulai</th>
                    <th className="p-3 border text-gray-800 dark:text-gray-200">Tanggal Selesai</th>
                    <th className="p-3 border text-gray-800 dark:text-gray-200">Target per Petugas</th>
                    <th className="p-3 border text-gray-800 dark:text-gray-200">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kegiatanList.map((kegiatan) => (
                    <tr key={kegiatan.id} className="border dark:border-gray-600">
                      <td className="p-3 border text-gray-900 dark:text-gray-100">{kegiatan.nama_kegiatan}</td>
                      <td className={`p-3 border ${getStatusColor(kegiatan.status)} rounded`}>{kegiatan.status}</td>
                      <td className="p-3 border text-gray-900 dark:text-gray-100">{kegiatan.tanggal_mulai}</td>
                      <td className="p-3 border text-gray-900 dark:text-gray-100">{kegiatan.tanggal_selesai}</td>
                      <td className="p-3 border text-gray-900 dark:text-gray-100">{`${kegiatan.target_petugas} ${kegiatan.satuan_target}`}</td>
                      <td className="p-3 border">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={() => alert(`Edit kegiatan ID: ${kegiatan.id}`)} // Ganti dengan logika edit
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => handleDelete(kegiatan.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitorKegiatan;