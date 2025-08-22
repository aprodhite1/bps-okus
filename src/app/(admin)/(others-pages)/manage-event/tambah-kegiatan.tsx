"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Sesuaikan path
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import { ArrowDownIcon } from "@/icons";
import { usePegawai } from '@/hooks/usePegawai';



// Data statis untuk dropdown IKU dan RK
const ikuRkData = [
  {
    iku: "Persentase Publikasi/Laporan Statistik Kependudukan Dan Ketenagakerjaan Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Statistik Kependudukan Dan Ketenagakerjaan Yang Berkualitas",
    rks: [
      { value: "Tersusunnya Publikasi/Laporan Statistik Kependudukan yang Berkualitas dan terbit tepat waktu", name: "Tersusunnya Publikasi/Laporan Statistik Kependudukan yang Berkualitas dan terbit tepat waktu" },
      { value: "Tersusunnya Publikasi/Laporan Statistik Ketenagakerjaan yang Berkualitas dan terbit tepat waktu", name: "Tersusunnya Publikasi/Laporan Statistik Ketenagakerjaan yang Berkualitas dan terbit tepat waktu" },
    ],
  },
  {
    iku: "Persentase Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas",
    rks: [
      { value: "umlah Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas dan terbit tepat waktu", name: "Jumlah Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas dan terbit tepat waktu" },
    ],
  },
  {
    iku: "Persentase Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas",
    rks: [
      { value: "Jumlah Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas dan Terbit Tepat Waktu" },
      { value: "Jumlah Desa Yang Berpredikat Desa Cinta Statistik di Kabupaten OKU Selatan", name: "Jumlah Desa Yang Berpredikat Desa Cinta Statistik di Kabupaten OKU Selatan" },
    ],
  },
  {
    iku: "Persentase Publikasi/Laporan Statistik Tanaman Pangan, Hortikultura, Dan Perkebunan Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Statistik Tanaman Pangan, Hortikultura, Dan Perkebunan Yang Berkualitas",
    rks: [
      { value: "Jumlah Publikasi/Laporan Statistik Tanaman Pangan, Hortikultura, Dan Perkebunan Yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah Publikasi/Laporan Statistik Tanaman Pangan, Hortikultura, Dan Perkebunan Yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "Persentase Publikasi/Laporan Statistik Peternakan, Perikanan, Dan Kehutanan Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Statistik Peternakan, Perikanan, Dan Kehutanan Yang Berkualitas",
    rks: [
      { value: "Jumlah Publikasi/Laporan Statistik Peternakan, Perikanan, Dan Kehutanan Yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah Publikasi/Laporan Statistik Peternakan, Perikanan, Dan Kehutanan Yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "Persentase Publikasi/Laporan Statistik Industri Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Statistik Industri Yang Berkualitas",
    rks: [
      { value: "Jumlah Publikasi/Laporan Statistik Industri Yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah Publikasi/Laporan Statistik Industri Yang Berkualitas dan Terbit Tepat Waktu" },
      { value: "Jumlah Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, dan Pariwisata Yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, dan Pariwisata Yang Berkualitas dan Terbit Tepat Waktu" },
      { value: "Terlaksananya Pembangunan Zona Integritas Menuju WBK dengan nilai 82,219", name: "Terlaksananya Pembangunan Zona Integritas Menuju WBK dengan nilai 82,219" },
    ],
  },
  {
    iku: "Persentase Publikasi/Laporan Statistik Distribusi Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Statistik Distribusi Yang Berkualitas",
    rks: [
      { value: "Jumlah Publikasi/Laporan Statistik Distribusi Yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah Publikasi/Laporan Statistik Distribusi Yang Berkualitas dan Terbit Tepat Waktu" },
      { value: "Jumlah Publikasi/Laporan Sensus Ekonomi Yang Berkualitas dan Tepat Waktu", name: "Jumlah Publikasi/Laporan Sensus Ekonomi Yang Berkualitas dan Tepat Waktu" },
    ],
  },
  {
    iku: "Persentase Publikasi/Laporan Statistik Harga Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Statistik Harga Yang Berkualitas",
    rks: [
      { value: "Jumlah Publikasi/Laporan Statistik Harga Yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah Publikasi/Laporan Statistik Harga Yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "Persentase Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, Dan Pariwisata Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, Dan Pariwisata Yang Berkualitas",
    rks: [
      { value: "Jumlah Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, Dan Pariwisata Yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, Dan Pariwisata Yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "Persentase Publikasi/Laporan Neraca Produksi Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Neraca Produksi Yang Berkualitas",
    rks: [
      { value: "Jumlah Publikasi/Laporan Neraca Produksi yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah Publikasi/Laporan Neraca Produksi yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "Persentase Publikasi/Laporan Neraca Pengeluaran Yang Berkualitas",
    name: "Persentase Publikasi/Laporan Neraca Pengeluaran Yang Berkualitas",
    rks: [
      { value: "Jumlah Publikasi/Laporan Neraca Pengeluaran yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah Publikasi/Laporan Neraca Pengeluaran yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "Persentase publikasi/laporan Analisis dan Pengembangan Statistik yang berkualitas",
    name: "Persentase publikasi/laporan Analisis dan Pengembangan Statistik yang berkualitas",
    rks: [
      { value: "Jumlah publikasi/laporan Statistik Lintas Sektor yang Berkualitas dan Terbit Tepat Waktu", name: "Jumlah publikasi/laporan Statistik Lintas Sektor yang Berkualitas dan Terbit Tepat Waktu" },
    ],
  },
  {
    iku: "Tingkat Penyelenggaraan Pembinaan Statistik Sektoral sesuai standar",
    name: "Tingkat Penyelenggaraan Pembinaan Statistik Sektoral sesuai standar",
    rks: [
      { value: "Nilai Evaluasi Penyelenggaraan Statistik Sektoral sebesar 2,29", name: "Nilai Evaluasi Penyelenggaraan Statistik Sektoral sebesar 2,29" },
      { value: "Jumlah OPD yang mendapatkan Pembinaan Statistik Sektoral sesuai standar", name: "Jumlah OPD yang mendapatkan Pembinaan Statistik Sektoral sesuai standar" },
    ],
  },
  {
    iku: "Indeks Pelayanan Publik - Penilaian Mandiri",
    name: "Indeks Pelayanan Publik - Penilaian Mandiri",
    rks: [
      { value: "Tercapainya nilai Indeks Pelayanan Publik (Penilaian Mandiri) sebesar 3,33 Poin", name: "Tercapainya nilai Indeks Pelayanan Publik (Penilaian Mandiri) sebesar 3,33 Poin" },
    ],
  },
  {
    iku: "Nilai SAKIP oleh Inspektorat",
    name: "Nilai SAKIP oleh Inspektorat",
    rks: [
      { value: "Tercapainya Nilai SAKIP oleh Inspektorat sebesar 76,10 poin", name: "Tercapainya Nilai SAKIP oleh Inspektorat sebesar 76,10 poin" },
    ],
  },
  {
    iku: "Indeks Implementasi BerAKHLAK",
    name: "Indeks Implementasi BerAKHLAK",
    rks: [
      { value: "Tercapainya Nilai BerAKHLAK sebesar 64,3 persen", name: "Tercapainya Nilai BerAKHLAK sebesar 64,3 persen" },
    ],
  },
];

const proyekData = [
  { value: "Proyek Statistik Kependudukan 2025", name: "Proyek Statistik Kependudukan 2025" },
  { value: "Proyek Statistik Ketenagakerjaan 2025", name: "Proyek Statistik Ketenagakerjaan 2025" },
  { value: "Proyek Sensus Ekonomi 2025", name: "Proyek Sensus Ekonomi 2025" },
];



const mitraData = [
  { value: "Evayatin", name: "Evayatin" },
  { value: "Mimis", name: "Mimis" },
  { value: "Tono", name: "Tono" },
];

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
}

export default function ManajemenKegiatanStatistik() {
  const [iku, setIku] = useState("");
  const [rk, setRk] = useState("");
  const [proyek, setProyek] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const searchParams = useSearchParams();
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [mitra, setMitra] = useState("");
  const [targetPetugas, setTargetPetugas] = useState("");
  const [satuanTarget, setSatuanTarget] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { pegawai, loading: loadingPegawai, error } = usePegawai();
  const [selectedPegawai, setSelectedPegawai] = useState<string[]>([]);
  const handlePegawaiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const options = e.target.options;
  const selectedValues: string[] = [];
  
  for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    
    setSelectedPegawai(selectedValues);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    if (!iku || !rk || !proyek || !namaKegiatan || !tanggalMulai || !tanggalSelesai || 
        !targetPetugas || !satuanTarget || selectedPegawai.length === 0) {
      setAlert({ show: true, message: "Harap isi semua field termasuk memilih pegawai!", type: "error" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
      setSubmitLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const kegiatanData = {
        iku: iku.trim(),
        rk: rk.trim(),
        proyek: proyek.trim(),
        nama_kegiatan: namaKegiatan.trim(),
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
        pegawai: selectedPegawai, // Array username pegawai yang dipilih
        mitra: mitra || null,
        target_petugas: Number(targetPetugas),
        satuan_target: satuanTarget,
        created_at: new Date(),
        updated_at: new Date(),
        status: 'draft'
      };
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Data to be saved:', kegiatanData);

      const docRef = await addDoc(collection(db, "kegiatan"), kegiatanData);

      setAlert({ 
        show: true, 
        message: `Kegiatan berhasil disimpan dengan ID: ${docRef.id}`, 
        type: "success" 
      });
      
      // Reset form
      setIku("");
      setRk("");
      setProyek("");
      setNamaKegiatan("");
      setTanggalMulai("");
      setTanggalSelesai("");
      setSelectedPegawai([]);
      setMitra("");
      setTargetPetugas("");
      setSatuanTarget("");
      
    } catch (error: any) {
      console.error("Firebase error:", error);
      setAlert({ 
        show: true, 
        message: `Error: ${error.message}`, 
        type: "error" 
      });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
      setSubmitLoading(false);
    }
  };

  const filteredRks = iku ? ikuRkData.find((item) => item.iku === iku)?.rks || [] : [];
    useEffect(() => {
    // Pre-fill date from calendar click
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setTanggalMulai(dateParam);
      setTanggalSelesai(dateParam);
    }
  }, [searchParams]);
  
  if (loadingPegawai) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Tambah Kegiatan" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
          <LoadingSpinner text="Memuat data pegawai..." />
        </div>
      </div>
    );
  }
  return (
    <div>
      <PageBreadcrumb pageTitle="Kelola Kegiatan" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="w-full">
          {alert.show && (
            <div
              className={`mt-4 p-4 rounded w-full ${
                alert.type === "success" ? "bg-green-100 text-green-700 dark:text-white" : "bg-red-100 text-red-700 dark:text-white"
              }`}
            >
              {alert.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* IKU Select */}
            <div className="w-full mb-8">
              <label htmlFor="iku-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                Pilih Indikator Kinerja Utama (IKU)
              </label>
              <div className="relative z-20 bg-gray-100 dark:bg-gray-800">
                <select
                  id="iku-select"
                  value={iku}
                  onChange={(e) => {
                    setIku(e.target.value);
                    setRk("");
                  }}
                  className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="">-- Pilih IKU --</option>
                  {ikuRkData.map((item) => (
                    <option key={item.iku} value={item.iku} className="text-gray-900 dark:text-gray-200">
                      {item.name}
                    </option>
                  ))}
                </select>
                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                  <svg
                    className="fill-current text-gray-600 dark:text-gray-400"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.8">
                      <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill="" />
                    </g>
                  </svg>
                </span>
              </div>
            </div>

            {/* RK Select */}
            {iku && (
              <div className="w-full mb-8">
                <label htmlFor="rk-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                  Pilih Rencana Kinerja (RK)
                </label>
                <div className="relative z-20 bg-gray-100 dark:bg-gray-800">
                  <select
                    id="rk-select"
                    value={rk}
                    onChange={(e) => {
                      setRk(e.target.value);
                      setProyek("");
                    }}
                    className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <option value="">-- Pilih RK --</option>
                    {filteredRks.map((rkItem) => (
                      <option key={rkItem.value} value={rkItem.value} className="text-gray-900 dark:text-gray-200">
                        {rkItem.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current text-gray-600 dark:text-gray-400"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill="" />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            )}

            {/* Proyek Select */}
            {rk && (
              <div className="w-full mb-8">
                <label htmlFor="proyek-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                  Pilih Proyek
                </label>
                <div className="relative z-20 bg-gray-100 dark:bg-gray-800">
                  <select
                    id="proyek-select"
                    value={proyek}
                    onChange={(e) => setProyek(e.target.value)}
                    className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <option value="">-- Pilih Proyek --</option>
                    {proyekData.map((proyekItem) => (
                      <option key={proyekItem.value} value={proyekItem.value} className="text-gray-900 dark:text-gray-200">
                        {proyekItem.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current text-gray-600 dark:text-gray-400"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill="" />
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
                  <label htmlFor="nama-kegiatan" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                    Nama Kegiatan
                  </label>
                  <input
                    type="text"
                    id="nama-kegiatan"
                    value={namaKegiatan}
                    onChange={(e) => setNamaKegiatan(e.target.value)}
                    placeholder="Contoh: Pencacahan Rumah Tangga Sampel Susenas"
                    className="w-full rounded border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="tanggal-mulai" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                      Tanggal Mulai
                    </label>
                    <Flatpickr
                      id="tanggal-mulai"
                      value={tanggalMulai ? [new Date(tanggalMulai)] : []}
                      onChange={([date]: Date[]) => setTanggalMulai(date ? date.toISOString().split("T")[0] : "")}
                      options={{ dateFormat: "Y-m-d", locale: { firstDayOfWeek: 1 } }}
                      className="w-full rounded border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="tanggal-selesai" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                      Tanggal Selesai
                    </label>
                    <Flatpickr
                      id="tanggal-selesai"
                      value={tanggalSelesai ? [new Date(tanggalSelesai)] : []}
                      onChange={([date]: Date[]) => setTanggalSelesai(date ? date.toISOString().split("T")[0] : "")}
                      options={{ dateFormat: "Y-m-d", locale: { firstDayOfWeek: 1 } }}
                      className="w-full rounded border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>

                <div className="w-full mb-8">
                  <label className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                    Pilih Pegawai
                  </label>
                  
                  {/* Select All Button */}
                  {pegawai.length > 0 && (
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Pilih pegawai yang terlibat
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedPegawai.length === pegawai.length) {
                            setSelectedPegawai([]);
                          } else {
                            setSelectedPegawai(pegawai.map(user => user.username));
                          }
                        }}
                        className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                      >
                        {selectedPegawai.length === pegawai.length ? 'Batal pilih semua' : 'Pilih semua'}
                      </button>
                    </div>
                  )}
                  
                  {/* Checkbox List */}
                  <div className="max-h-60 overflow-y-auto rounded border border-gray-300 bg-gray-100 p-4 dark:border-gray-600 dark:bg-gray-800">
                    {pegawai.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400">Tidak ada pegawai tersedia</p>
                    ) : (
                      <div className="space-y-3">
                        {pegawai.map((user) => (
                          <label key={user.id} className="flex items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                            <input
                              type="checkbox"
                              value={user.username}
                              checked={selectedPegawai.includes(user.username)}
                              onChange={(e) => {
                                const username = e.target.value;
                                if (e.target.checked) {
                                  setSelectedPegawai([...selectedPegawai, username]);
                                } else {
                                  setSelectedPegawai(selectedPegawai.filter(u => u !== username));
                                }
                              }}
                              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:border-gray-600"
                            />
                            <span className="ml-3 text-gray-900 dark:text-gray-200">
                              {user.name} ( { user.username})
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
  
                  {/* Selected Pegawai Preview */}
                  {selectedPegawai.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                        {selectedPegawai.length} pegawai terpilih:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPegawai.map((username) => {
                          const user = pegawai.find(u => u.username === username);
                          return (
                            <span 
                              key={username}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                              {user?.name || username}
                              <button
                                type="button"
                                onClick={() => setSelectedPegawai(selectedPegawai.filter(u => u !== username))}
                                className="ml-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 p-0.5"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
          

                <div className="w-full mb-8">
                  <label htmlFor="mitra-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                    Pilih Mitra
                  </label>
                  <div className="relative z-20 bg-gray-100 dark:bg-gray-800">
                    <select
                      id="mitra-select"
                      value={mitra}
                      onChange={(e) => setMitra(e.target.value)}
                      className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    >
                      <option value="">-- Pilih Mitra --</option>
                      {mitraData.map((mitraItem) => (
                        <option key={mitraItem.value} value={mitraItem.value} className="text-gray-900 dark:text-gray-200">
                          {mitraItem.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current text-gray-600 dark:text-gray-400"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill="" />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="w-full mb-8">
                  <label htmlFor="target-petugas" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                    Target per Petugas
                  </label>
                  <div className="flex w-full gap-4">
                    <input
                      type="number"
                      id="target-petugas"
                      value={targetPetugas}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || parseInt(value) >= 0) {
                          setTargetPetugas(value);
                        } else {
                          console.log("Target harus lebih dari 0!");
                        }
                      }}
                      placeholder="Masukkan jumlah target (angka)"
                      className="w-full rounded border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <div className="relative z-20 w-1/3 bg-gray-100 dark:bg-gray-800">
                      <select
                        id="satuan-target"
                        value={satuanTarget || ""}
                        onChange={(e) => setSatuanTarget(e.target.value)}
                        className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      >
                        <option value="rumah_tangga" className="text-gray-900 dark:text-gray-200">
                          Rumah Tangga
                        </option>
                        <option value="desa" className="text-gray-900 dark:text-gray-200">Desa</option>
                        <option value="dokumen" className="text-gray-900 dark:text-gray-200">Dokumen</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current text-gray-600 dark:text-gray-400"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill="" />
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full mb-8">
                  <button
                    type="submit"
                    className="w-full flex justify-center rounded bg-gray-100 p-3 font-medium text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors duration-200"
                  >
                    Tambah Kegiatan
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
