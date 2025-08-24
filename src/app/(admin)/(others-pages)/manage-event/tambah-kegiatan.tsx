"use client";

import { useState, useEffect, useMemo, ChangeEvent } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import { usePegawai } from '@/hooks/usePegawai';
import { useAuth } from '@/context/AuthContext';


// Interfaces untuk type safety
interface RkItem {
  value: string;
  name: string;
}

interface IkuItem {
  iku: string;
  name: string;
  rks: RkItem[];
}

interface ProyekItem {
  value: string;
  name: string;
}

interface MitraItem {
  value: string;
  name: string;
}

interface Pegawai {
  id: string;
  username: string;
  name: string;
}

interface KegiatanForm {
  iku: string;
  rk: string;
  proyek: string;
  namaKegiatan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  mitra: string;
  targetPetugas: string;
  satuanTarget: string;
  selectedPegawai: string[];
}

// Data statis untuk dropdown IKU dan RK
const ikuRkData: IkuItem[] = [
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

const proyekData: ProyekItem[] = [
  { value: "Proyek Statistik Kependudukan 2025", name: "Proyek Statistik Kependudukan 2025" },
  { value: "Proyek Statistik Ketenagakerjaan 2025", name: "Proyek Statistik Ketenagakerjaan 2025" },
  { value: "Proyek Sensus Ekonomi 2025", name: "Proyek Sensus Ekonomi 2025" },
];

const mitraData: MitraItem[] = [
  { value: "Evayatin", name: "Evayatin" },
  { value: "Mimis", name: "Mimis" },
  { value: "Tono", name: "Tono" },
];

export default function ManajemenKegiatanStatistik() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { pegawai, loading: loadingPegawai, error: errorPegawai } = usePegawai();
  
  const [formData, setFormData] = useState<KegiatanForm>({
    iku: "",
    rk: "",
    proyek: "",
    namaKegiatan: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    mitra: "",
    targetPetugas: "",
    satuanTarget: "",
    selectedPegawai: [],
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof KegiatanForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Gunakan useMemo untuk optimasi filtering RKs
  const filteredRks = useMemo(() => {
    return formData.iku ? 
      ikuRkData.find((item) => item.iku === formData.iku)?.rks || [] 
      : [];
  }, [formData.iku]);

  useEffect(() => {
    // Pre-fill date from calendar click
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setFormData(prev => ({
        ...prev,
        tanggalMulai: dateParam,
        tanggalSelesai: dateParam
      }));
    }
  }, [searchParams]);

  const handleInputChange = (field: keyof KegiatanForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Reset dependent fields when IKU changes
    if (field === 'iku' && value !== formData.iku) {
      setFormData(prev => ({
        ...prev,
        rk: "",
        proyek: ""
      }));
    }
    
    // Reset dependent fields when RK changes
    if (field === 'rk' && value !== formData.rk) {
      setFormData(prev => ({
        ...prev,
        proyek: ""
      }));
    }
  };

  const handlePegawaiChange = (username: string, isChecked: boolean) => {
    setFormData(prev => {
      const selectedPegawai = isChecked
        ? [...prev.selectedPegawai, username]
        : prev.selectedPegawai.filter(u => u !== username);
      
      return {
        ...prev,
        selectedPegawai
      };
    });
  };

  const selectAllPegawai = () => {
    if (pegawai.length === 0) return;
    
    setFormData(prev => {
      const allUsernames = pegawai.map(user => user.username);
      const shouldSelectAll = prev.selectedPegawai.length !== pegawai.length;
      
      return {
        ...prev,
        selectedPegawai: shouldSelectAll ? allUsernames : []
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof KegiatanForm, string>> = {};
    
    if (!formData.iku.trim()) newErrors.iku = "IKU harus dipilih";
    if (!formData.rk.trim()) newErrors.rk = "RK harus dipilih";
    if (!formData.proyek.trim()) newErrors.proyek = "Proyek harus dipilih";
    if (!formData.namaKegiatan.trim()) newErrors.namaKegiatan = "Nama kegiatan harus diisi";
    if (!formData.tanggalMulai) newErrors.tanggalMulai = "Tanggal mulai harus diisi";
    if (!formData.tanggalSelesai) newErrors.tanggalSelesai = "Tanggal selesai harus diisi";
    if (formData.selectedPegawai.length === 0) newErrors.selectedPegawai = "Pilih minimal satu pegawai";
    if (!formData.targetPetugas) newErrors.targetPetugas = "Target petugas harus diisi";
    if (!formData.satuanTarget) newErrors.satuanTarget = "Satuan target harus dipilih";
    
    // Validasi tanggal
    if (formData.tanggalMulai && formData.tanggalSelesai) {
      const startDate = new Date(formData.tanggalMulai);
      const endDate = new Date(formData.tanggalSelesai);
      
      if (endDate < startDate) {
        newErrors.tanggalSelesai = "Tanggal selesai tidak boleh sebelum tanggal mulai";
      }
    }
    
    // Validasi target petugas
    if (formData.targetPetugas) {
      const target = parseInt(formData.targetPetugas);
      if (isNaN(target) || target <= 0) {
        newErrors.targetPetugas = "Target petugas harus angka positif";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setAlert({ 
        show: true, 
        message: "Harap perbaiki kesalahan pada form sebelum submit", 
        type: "error" 
      });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const kegiatanData = {
        iku: formData.iku.trim(),
        rk: formData.rk.trim(),
        proyek: formData.proyek.trim(),
        nama_kegiatan: formData.namaKegiatan.trim(),
        tanggal_mulai: formData.tanggalMulai,
        tanggal_selesai: formData.tanggalSelesai,
        pegawai: formData.selectedPegawai,
        mitra: formData.mitra || null,
        target_petugas: Number(formData.targetPetugas),
        satuan_target: formData.satuanTarget,
        created_at: new Date(),
        updated_at: new Date(),
        status: 'draft',
        created_by: user?.id || 'unknown'
      };
      
      const docRef = await addDoc(collection(db, "kegiatan"), kegiatanData);

      setAlert({ 
        show: true, 
        message: `Kegiatan berhasil disimpan dengan ID: ${docRef.id}`, 
        type: "success" 
      });
      
      // Reset form
      setFormData({
        iku: "",
        rk: "",
        proyek: "",
        namaKegiatan: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        mitra: "",
        targetPetugas: "",
        satuanTarget: "",
        selectedPegawai: [],
      });
      
    } catch (error: any) {
      console.error("Firebase error:", error);
      setAlert({ 
        show: true, 
        message: `Error: ${error.message}`, 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
    }
  };

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
                  alert.type === "success" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {alert.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* IKU Select */}
              <div className="w-full mb-8">
                <label htmlFor="iku-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                  Pilih Indikator Kinerja Utama (IKU) <span className="text-error-500">*</span>
                </label>
                <div className="relative z-20 bg-gray-100 dark:bg-gray-800">
                  <select
                    id="iku-select"
                    value={formData.iku}
                    onChange={(e) => handleInputChange('iku', e.target.value)}
                    className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
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
                {errors.iku && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.iku}</p>
                )}
              </div>

              {/* RK Select */}
              {formData.iku && (
                <div className="w-full mb-8">
                  <label htmlFor="rk-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                    Pilih Rencana Kinerja (RK) <span className="text-error-500">*</span>
                  </label>
                  <div className="relative z-20 bg-gray-100 dark:bg-gray-800">
                    <select
                      id="rk-select"
                      value={formData.rk}
                      onChange={(e) => handleInputChange('rk', e.target.value)}
                      className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
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
                  {errors.rk && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rk}</p>
                  )}
                </div>
              )}

              {/* Proyek Select */}
              {formData.rk && (
                <div className="w-full mb-8">
                  <label htmlFor="proyek-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                    Pilih Proyek <span className="text-error-500">*</span>
                  </label>
                  <div className="relative z-20 bg-gray-100 dark:bg-gray-800">
                    <select
                      id="proyek-select"
                      value={formData.proyek}
                      onChange={(e) => handleInputChange('proyek', e.target.value)}
                      className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
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
                  {errors.proyek && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.proyek}</p>
                  )}
                </div>
              )}

              {/* Activity Form */}
              {formData.rk && (
                <div className="w-full space-y-8">
                  <div className="w-full mb-8">
                    <label htmlFor="nama-kegiatan" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                      Nama Kegiatan <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nama-kegiatan"
                      value={formData.namaKegiatan}
                      onChange={(e) => handleInputChange('namaKegiatan', e.target.value)}
                      placeholder="Contoh: Pencacahan Rumah Tangga Sampel Susenas"
                      className="w-full rounded border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.namaKegiatan && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.namaKegiatan}</p>
                    )}
                  </div>

                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label htmlFor="tanggal-mulai" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                        Tanggal Mulai <span className="text-error-500">*</span>
                      </label>
                      <Flatpickr
                        id="tanggal-mulai"
                        value={formData.tanggalMulai ? [new Date(formData.tanggalMulai)] : []}
                        onChange={([date]: Date[]) => handleInputChange('tanggalMulai', date ? date.toISOString().split("T")[0] : "")}
                        options={{ 
                          dateFormat: "Y-m-d", 
                          locale: { firstDayOfWeek: 1 },
                          minDate: "today"
                        }}
                        className="w-full rounded border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      />
                      {errors.tanggalMulai && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggalMulai}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="tanggal-selesai" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                        Tanggal Selesai <span className="text-error-500">*</span>
                      </label>
                      <Flatpickr
                        id="tanggal-selesai"
                        value={formData.tanggalSelesai ? [new Date(formData.tanggalSelesai)] : []}
                        onChange={([date]: Date[]) => handleInputChange('tanggalSelesai', date ? date.toISOString().split("T")[0] : "")}
                        options={{ 
                          dateFormat: "Y-m-d", 
                          locale: { firstDayOfWeek: 1 },
                          minDate: formData.tanggalMulai || "today"
                        }}
                        className="w-full rounded border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      />
                      {errors.tanggalSelesai && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggalSelesai}</p>
                      )}
                    </div>
                  </div>

                  <div className="w-full mb-8">
                    <fieldset>
                      <legend className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                        Pilih Pegawai <span className="text-error-500">*</span>
                      </legend>
                      
                      {/* Select All Button */}
                      {pegawai.length > 0 && (
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Pilih pegawai yang terlibat
                          </span>
                          <button
                            type="button"
                            onClick={selectAllPegawai}
                            className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                          >
                            {formData.selectedPegawai.length === pegawai.length ? 'Batal pilih semua' : 'Pilih semua'}
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
                                  checked={formData.selectedPegawai.includes(user.username)}
                                  onChange={(e) => handlePegawaiChange(user.username, e.target.checked)}
                                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:border-gray-600"
                                />
                                <span className="ml-3 text-gray-900 dark:text-gray-200">
                                  {user.name} ({user.username})
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </fieldset>
                    
                    {errors.selectedPegawai && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.selectedPegawai}</p>
                    )}
  
                    {/* Selected Pegawai Preview */}
                    {formData.selectedPegawai.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                          {formData.selectedPegawai.length} pegawai terpilih:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {formData.selectedPegawai.map((username) => {
                            const user = pegawai.find(u => u.username === username);
                            return (
                              <span 
                                key={username}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {user?.name || username}
                                <button
                                  type="button"
                                  onClick={() => handlePegawaiChange(username, false)}
                                  className="ml-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 p-0.5"
                                  aria-label={`Hapus ${user?.name || username}`}
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
                        value={formData.mitra}
                        onChange={(e) => handleInputChange('mitra', e.target.value)}
                        className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
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
                      Target per Petugas <span className="text-error-500">*</span>
                    </label>
                    <div className="flex w-full gap-4">
                      <input
                        type="number"
                        id="target-petugas"
                        value={formData.targetPetugas}
                        onChange={(e) => handleInputChange('targetPetugas', e.target.value)}
                        placeholder="Masukkan jumlah target (angka)"
                        min="1"
                        className="w-full rounded border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <div className="relative z-20 w-1/3 bg-gray-100 dark:bg-gray-800">
                        <select
                          id="satuan-target"
                          value={formData.satuanTarget}
                          onChange={(e) => handleInputChange('satuanTarget', e.target.value)}
                          className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        >
                          <option value="">-- Pilih Satuan --</option>
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
                    {errors.targetPetugas && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.targetPetugas}</p>
                    )}
                    {errors.satuanTarget && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.satuanTarget}</p>
                    )}
                  </div>

                  <div className="w-full mb-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center rounded bg-gray-100 p-3 font-medium text-gray-800 hover:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors duration-200"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 dark:border-white mr-2"></div>
                          Menyimpan...
                        </div>
                      ) : (
                        "Tambah Kegiatan"
                      )}
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