/*Halaman Manajemen Kegiatan Statistik1*/
"use client";

import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

const ikuRkData = [
  {
    iku: "iku1",
    name: "Persentase Publikasi/Laporan Statistik Kependudukan Dan Ketenagakerjaan Yang Berkualitas",
    rks: [
      { value: "rk1.1", name: "Tersusunnya Publikasi/Laporan Statistik Kependudukan yang Berkualitas dan terbit tepat waktu" },
      { value: "rk1.2", name: "Tersusunnya Publikasi/Laporan Statistik Ketenagakerjaan yang Berkualitas dan terbit tepat waktu" },
    ],
  },
  {
    iku: "iku2",
    name: "Persentase Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas",
    rks: [
      { value: "rk1.1", name: "Jumlah Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas dan terbit tepat waktu" },
    ],
  },
  {
    iku: "iku3",
    name: "Persentase Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas",
    rks: [
      { value: "rk1.1", name: "Jumlah Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas dan Terbit Tepat Waktu" },
      { value: "rk1.2", name: "Jumlah Desa Yang Berpredikat Desa Cinta Statistik di Kabupaten OKU Selatan" },
    ],
  },
  {
    iku: "iku4",
    name: "Persentase Publikasi/Laporan Statistik Tanaman Pangan, Hortikultura, Dan Perkebunan Yang Berkualitas",
    rks: [
      { value: "rk1.1", name: "Jumlah Publikasi/Laporan Statistik Tanaman Pangan, Hortikultura, Dan Perkebunan Yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "iku5",
    name: "Persentase Publikasi/Laporan Statistik Peternakan, Perikanan, Dan Kehutanan Yang Berkualitas",
    rks: [
      { value: "rk1.1", name: "Jumlah Publikasi/Laporan Statistik Peternakan, Perikanan, Dan Kehutanan Yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "iku6",
    name: "Persentase Publikasi/Laporan Statistik Industri Yang Berkualitas",
    rks: [
      { value: "rk1.1", name: "Jumlah Publikasi/Laporan Statistik Industri Yang Berkualitas dan Terbit Tepat Waktu" },
      { value: "rk1.2", name: "Jumlah Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, dan Pariwisata Yang Berkualitas dan Terbit Tepat Waktu" },
      { value: "rk1.3", name: "Terlaksananya Pembangunan Zona Integritas Menuju WBK dengan nilai 82,219" },
    ],
  },
  {
    iku: "iku7",
    name: "Persentase Publikasi/Laporan Statistik Distribusi Yang Berkualitas",
    rks: [
      { value: "rk1.1", name: "Jumlah Publikasi/Laporan Statistik Distribusi Yang Berkualitas dan Terbit Tepat Waktu" },
      { value: "rk1.2", name: "Jumlah Publikasi/Laporan Sensus Ekonomi Yang Berkualitas dan Tepat Waktu" },
    ],
  },
  {
    iku: "iku8",
    name: "Persentase Publikasi/Laporan Statistik Harga Yang Berkualitas",
    rks: [
      { value: "rk1.1", name: "Jumlah Publikasi/Laporan Statistik Harga Yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "iku9",
    name: "Persentase Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, Dan Pariwisata Yang Berkualitas",
    rks: [
      { value: "rk1.1", name: "Jumlah Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, Dan Pariwisata Yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "iku10",
    name: "Persentase Publikasi/Laporan Neraca Produksi Yang Berkualitas",
    rks: [
      { value: "rk1.1", name: "Jumlah Publikasi/Laporan Neraca Produksi yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "iku11",
    name: "Persentase Publikasi/Laporan Neraca Pengeluaran Yang Berkualitas",
    rks: [
      { value: "rk1.2", name: "Jumlah Publikasi/Laporan Neraca Pengeluaran yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "iku12",
    name: "Persentase publikasi/laporan Analisis dan Pengembangan Statistik yang berkualitas",
    rks: [
      { value: "rk1.3", name: "Jumlah publikasi/laporan Statistik Lintas Sektor yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "iku13",
    name: "Tingkat Penyelenggaraan Pembinaan Statistik Sektoral sesuai standar",
    rks: [
      { value: "rk1.1", name: "Nilai Evaluasi Penyelenggaraan Statistik Sektoral sebesar 2,29" },
      { value: "rk1.2", name: "Jumlah OPD yang mendapatkan Pembinaan Statistik Sektoral sesuai standar" },
    ],
  },
  {
    iku: "iku14",
    name: "Indeks Pelayanan Publik - Penilaian Mandiri",
    rks: [
      { value: "rk1.1", name: "Tercapainya nilai Indeks Pelayanan Publik (Penilaian Mandiri) sebesar 3,33 Poin" },
    ],
  },
  {
    iku: "iku15",
    name: "Nilai SAKIP oleh Inspektorat",
    rks: [
      { value: "rk1.1", name: "Tercapainya Nilai SAKIP oleh Inspektorat sebesar 76,10 poin" },
    ],
  },
  {
    iku: "iku16",
    name: "Indeks Implementasi BerAKHLAK",
    rks: [
      { value: "rk1.1", name: "Tercapainya Nilai BerAKHLAK sebesar 64,3 persen" },
    ],
  },
];

// Data statis untuk dropdown proyek
const proyekData = [
  { value: "proyek1", name: "Proyek Statistik Kependudukan 2025" },
  { value: "proyek2", name: "Proyek Statistik Ketenagakerjaan 2025" },
  { value: "proyek3", name: "Proyek Sensus Ekonomi 2025" },
];

export default function ManajemenKegiatanStatistik() {
  const [iku, setIku] = useState("");
  const [rk, setRk] = useState("");
  const [proyek, setProyek] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [targetPetugas, setTargetPetugas] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!iku || !rk || !proyek || !namaKegiatan || !tanggalMulai || !tanggalSelesai || !targetPetugas) {
      setAlert({ show: true, message: "Harap isi semua field!", type: "error" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
      return;
    }

    try {
      const response = await fetch("/api/kegiatan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iku,
          rk,
          proyek,
          nama_kegiatan: namaKegiatan,
          tanggal_mulai: tanggalMulai,
          tanggal_selesai: tanggalSelesai,
          target_petugas: targetPetugas,
        }),
      });

      if (response.ok) {
        setAlert({ show: true, message: "Kegiatan berhasil disimpan!", type: "success" });
        setIku("");
        setRk("");
        setProyek("");
        setNamaKegiatan("");
        setTanggalMulai("");
        setTanggalSelesai("");
        setTargetPetugas("");
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
      } else {
        setAlert({ show: true, message: "Terjadi kesalahan!", type: "error" });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
      }
    } catch (error) {
      setAlert({ show: true, message: "Terjadi kesalahan!", type: "error" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
    }
  };

  // Filter RK options based on selected IKU
  const filteredRks = iku ? ikuRkData.find((item) => item.iku === iku)?.rks || []: [];

  return (
    <div>
      <PageBreadcrumb pageTitle="Manajemen Kegiatan Statistik" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="w-full">
          {alert.show && (
            <div className={`mt-4 p-4 rounded w-full ${alert.type === "success" ? "bg-green-100 text-green-700 dark:text-white" : "bg-red-100 text-red-700 dark:text-white"}`}>
              {alert.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* IKU Select */}
            <div className="w-full mb-8">
              <label htmlFor="iku-select" className="mb-3 block text-base font-medium text-black dark:text-white">
                Pilih Indikator Kinerja Utama (IKU)
              </label>
              <div className="relative z-20 bg-transparent dark:bg-form-input">
                <select
                  id="iku-select"
                  value={iku}
                  onChange={(e) => {
                    setIku(e.target.value);
                    setRk(""); // Reset RK when IKU changes
                  }}
                  className="w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="">-- Pilih IKU --</option>
                  {ikuRkData.map((item) => (
                    <option key={item.iku} value={item.iku}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                  <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.8">
                      <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div>

            {/* RK Select */}
            {iku && (
              <div className="w-full mb-8">
                <label htmlFor="rk-select" className="mb-3 block text-base font-medium text-black dark:text-white">
                  Pilih Rencana Kinerja (RK)
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    id="rk-select"
                    value={rk}
                    onChange={(e) => {
                      setRk(e.target.value);
                      // Reset Proyek saat RK berubah (opsional, hapus jika tidak diinginkan)
                      setProyek("");
                    }}
                    className="w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  >
                    <option value="">-- Pilih RK --</option>
                    {filteredRks.map((rkItem) => (
                      <option key={rkItem.value} value={rkItem.value}>
                        {rkItem.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.8">
                        <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            )}

            {/* Proyek Select */}
            {rk && (
              <div className="w-full mb-8">
                <label htmlFor="proyek-select" className="mb-3 block text-base font-medium text-black dark:text-white">
                  Pilih Proyek
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    id="proyek-select"
                    value={proyek}
                    onChange={(e) => setProyek(e.target.value)}
                    className="w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  >
                    <option value="">-- Pilih Proyek --</option>
                    {proyekData.map((proyekItem) => (
                      <option key={proyekItem.value} value={proyekItem.value}>
                        {proyekItem.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.8">
                        <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            )}

            {/* Activity Form */}
            {rk && (
              <div className="w-full space-y-8">
                <div className="w-full mb-8">
                  <label htmlFor="nama-kegiatan" className="mb-3 block text-base font-medium text-black dark:text-white">
                    Nama Kegiatan
                  </label>
                  <input
                    type="text"
                    id="nama-kegiatan"
                    value={namaKegiatan}
                    onChange={(e) => setNamaKegiatan(e.target.value)}
                    placeholder="Contoh: Pencacahan Rumah Tangga Sampel Susenas"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white placeholder-gray-500 dark:placeholder-white"
                  />
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="tanggal-mulai" className="mb-3 block text-base font-medium text-black dark:text-white">
                      Tanggal Mulai
                    </label>
                    <Flatpickr
                      id="tanggal-mulai"
                      value={tanggalMulai}
                      onChange={([date]) => setTanggalMulai(date.toISOString().split("T")[0])}
                      options={{ dateFormat: "Y-m-d", locale: { firstDayOfWeek: 1 } }}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="tanggal-selesai" className="mb-3 block text-base font-medium text-black dark:text-white">
                      Tanggal Selesai
                    </label>
                    <Flatpickr
                      id="tanggal-selesai"
                      value={tanggalSelesai}
                      onChange={([date]) => setTanggalSelesai(date.toISOString().split("T")[0])}
                      options={{ dateFormat: "Y-m-d", locale: { firstDayOfWeek: 1 } }}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                </div>
                <div className="w-full mb-8">
                  <label htmlFor="target-petugas" className="mb-3 block text-base font-medium text-black dark:text-white">
                    Target per Petugas
                  </label>
                  <input
                    type="number"
                    id="target-petugas"
                    value={targetPetugas}
                    onChange={(e) => setTargetPetugas(e.target.value)}
                    placeholder="Masukkan jumlah target"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white placeholder-gray-500 dark:placeholder-white"
                  />
                </div>
                <div className="w-full mb-8">
                  <button type="submit" className="w-full flex justify-center rounded bg-primary p-3 font-medium text-gray dark:text-white">
                    Simpan Kegiatan
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}