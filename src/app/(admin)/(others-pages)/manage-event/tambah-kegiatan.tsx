"use client";

import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Plus, Minus } from 'lucide-react';

// Data statis untuk dropdown IKU dan RK
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

const proyekData = [
  { value: "proyek1", name: "Proyek Statistik Kependudukan 2025" },
  { value: "proyek2", name: "Proyek Statistik Ketenagakerjaan 2025" },
  { value: "proyek3", name: "Proyek Sensus Ekonomi 2025" },
];

const pegawaiData = [
  { value: "pegawai1", name: "Ardi Dwi Purnomo" },
  { value: "pegawai2", name: "Santos" },
  { value: "pegawai3", name: "Purwanto" },
];

const mitraData = [
  { value: "mitra1", name: "Evayatin" },
  { value: "mitra2", name: "Mimis" },
  { value: "mitra3", name: "Joko Widodo" },
];

interface PetugasTarget {
  pegawai: string;
  target: string;
}

export default function ManajemenKegiatanStatistik() {
  const [iku, setIku] = useState<string>("");
  const [rk, setRk] = useState<string>("");
  const [proyek, setProyek] = useState<string>("");
  const [namaKegiatan, setNamaKegiatan] = useState<string>("");
  const [tanggalMulai, setTanggalMulai] = useState<string>("");
  const [tanggalSelesai, setTanggalSelesai] = useState<string>("");
  const [mitra, setMitra] = useState<string>("");
  const [satuanTarget, setSatuanTarget] = useState<string>("");
  const [petugasTargetFields, setPetugasTargetFields] = useState<PetugasTarget[]>([
    { pegawai: "", target: "" },
  ]);
  const [alert, setAlert] = useState<{ show: boolean; message: string; type: string }>({ show: false, message: "", type: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = iku && rk && proyek && namaKegiatan && tanggalMulai && tanggalSelesai && satuanTarget &&
      petugasTargetFields.every(field => field.pegawai && field.target);

    if (!isFormValid) {
      setAlert({ show: true, message: "Harap isi semua field yang wajib diisi!", type: "error" });
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
          mitra,
          satuan_target: satuanTarget,
          petugas_target: petugasTargetFields,
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
        setMitra("");
        setSatuanTarget("");
        setPetugasTargetFields([{ pegawai: "", target: "" }]);
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
      } else {
        setAlert({ show: true, message: "Data belum bisa disubmit!", type: "error" });
        setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
      }
    } catch (error) {
      setAlert({ show: true, message: "Terjadi kesalahan!", type: "error" });
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
    }
  };

  const filteredRks = iku ? ikuRkData.find((item) => item.iku === iku)?.rks || [] : [];

  const handleChange = (index: number, event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = event.target;
    const newFields = [...petugasTargetFields];
    (newFields[index] as any)[name] = value;
    setPetugasTargetFields(newFields);
  };

  const handleAddField = () => {
    setPetugasTargetFields([...petugasTargetFields, { pegawai: "", target: "" }]);
  };

  const handleRemoveField = (index: number) => {
    const newFields = petugasTargetFields.filter((_, i) => i !== index);
    setPetugasTargetFields(newFields);
  };

  const ArrowDownIcon = () => (
    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
      <svg className="fill-current text-gray-600 dark:text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.8"><path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill="currentColor" /></g>
      </svg>
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:p-10">
        <div className="w-full">
          {alert.show && (
            <div className={`p-4 rounded w-full mb-6 ${alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {alert.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* IKU Select */}
            <div className="w-full">
              <label htmlFor="iku-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                Pilih Indikator Kinerja Utama (IKU)
              </label>
              <div className="relative z-30">
                <select
                  id="iku-select"
                  value={iku}
                  onChange={(e) => {
                    setIku(e.target.value);
                    setRk("");
                    setProyek("");
                  }}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                >
                  <option value="">-- Pilih IKU --</option>
                  {ikuRkData.map((item) => (
                    <option key={item.iku} value={item.iku}>{item.name}</option>
                  ))}
                </select>
                <ArrowDownIcon />
              </div>
            </div>

            {/* RK Select */}
            {iku && (
              <div className="w-full">
                <label htmlFor="rk-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                  Pilih Rencana Kinerja (RK)
                </label>
                <div className="relative z-20">
                  <select
                    id="rk-select"
                    value={rk}
                    onChange={(e) => {
                      setRk(e.target.value);
                      setProyek("");
                    }}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="">-- Pilih RK --</option>
                    {filteredRks.map((rkItem) => (
                      <option key={rkItem.value} value={rkItem.value}>{rkItem.name}</option>
                    ))}
                  </select>
                  <ArrowDownIcon />
                </div>
              </div>
            )}

            {/* Proyek Select */}
            {rk && (
              <div className="w-full">
                <label htmlFor="proyek-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                  Pilih Proyek
                </label>
                <div className="relative z-10">
                  <select
                    id="proyek-select"
                    value={proyek}
                    onChange={(e) => setProyek(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="">-- Pilih Proyek --</option>
                    {proyekData.map((proyekItem) => (
                      <option key={proyekItem.value} value={proyekItem.value}>{proyekItem.name}</option>
                    ))}
                  </select>
                  <ArrowDownIcon />
                </div>
              </div>
            )}
            
            {/* Activity Form */}
            {proyek && (
              <div className="w-full space-y-8 border-t dark:border-gray-700 pt-8">
                <div className="w-full">
                  <label htmlFor="nama-kegiatan" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                    Nama Kegiatan
                  </label>
                  <input
                    type="text"
                    id="nama-kegiatan"
                    value={namaKegiatan}
                    onChange={(e) => setNamaKegiatan(e.target.value)}
                    placeholder="Contoh: Pencacahan Rumah Tangga Sampel Susenas"
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="tanggal-mulai" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                      Tanggal Mulai
                    </label>
                    <Flatpickr
                      id="tanggal-mulai"
                      value={tanggalMulai ? new Date(tanggalMulai) : undefined}
                      onChange={([date]) => setTanggalMulai(date ? date.toISOString().split("T")[0] : "")}
                      className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="tanggal-selesai" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                      Tanggal Selesai
                    </label>
                    <Flatpickr
                      id="tanggal-selesai"
                      value={tanggalSelesai ? new Date(tanggalSelesai) : undefined}
                      onChange={([date]) => setTanggalSelesai(date ? date.toISOString().split("T")[0] : "")}
                      className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                </div>

                <div className="w-full space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Penugasan Petugas
                  </h2>
                  {petugasTargetFields.map((field, index) => (
                    <div key={index} className="flex flex-col md:flex-row items-end gap-4 p-4 border rounded-lg dark:border-gray-700">
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="w-full">
                          <label htmlFor={`pegawai-select-${index}`} className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200">
                            Pilih Pegawai
                          </label>
                          <div className="relative">
                            <select
                              id={`pegawai-select-${index}`}
                              name="pegawai"
                              value={field.pegawai}
                              onChange={(e) => handleChange(index, e)}
                              className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                            >
                              <option value="" disabled>-- Pilih Pegawai --</option>
                              {pegawaiData.map((pegawaiItem) => (
                                <option key={pegawaiItem.value} value={pegawaiItem.value}>{pegawaiItem.name}</option>
                              ))}
                            </select>
                            <ArrowDownIcon />
                          </div>
                        </div>
                        <div className="w-full">
                          <label htmlFor={`target-petugas-${index}`} className="mb-2 block text-sm font-medium text-gray-800 dark:text-gray-200">
                            Target
                          </label>
                          <input
                            type="number"
                            id={`target-petugas-${index}`}
                            name="target"
                            value={field.target}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Jumlah target (angka)"
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 self-end mt-4 md:mt-0">
                        {petugasTargetFields.length > 1 && (
                          <button type="button" onClick={() => handleRemoveField(index)} className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition" aria-label="Hapus Petugas">
                            <Minus size={24} />
                          </button>
                        )}
                        <button type="button" onClick={handleAddField} className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition" aria-label="Tambah Petugas">
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full space-y-8">
                  <div className="w-full">
                    <label htmlFor="satuan-target-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                      Pilih Satuan Target
                    </label>
                    <div className="relative">
                      <select
                        id="satuan-target-select"
                        value={satuanTarget}
                        onChange={(e) => setSatuanTarget(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                      >
                        <option value="" disabled>-- Pilih Satuan --</option>
                        <option value="rumah_tangga">Rumah Tangga</option>
                        <option value="desa">Desa</option>
                        <option value="dokumen">Dokumen</option>
                      </select>
                      <ArrowDownIcon />
                    </div>
                  </div>
                  <div className="w-full">
                    <label htmlFor="mitra-select" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                      Pilih Mitra (Opsional)
                    </label>
                    <div className="relative">
                      <select
                        id="mitra-select"
                        value={mitra}
                        onChange={(e) => setMitra(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                      >
                        <option value="">-- Tidak ada mitra --</option>
                        {mitraData.map((mitraItem) => (
                          <option key={mitraItem.value} value={mitraItem.value}>{mitraItem.name}</option>
                        ))}
                      </select>
                      <ArrowDownIcon />
                    </div>
                  </div>
                </div>

                <div className="w-full mt-8">
                  <button type="submit" className="w-full flex justify-center rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 transition-colors duration-200">
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