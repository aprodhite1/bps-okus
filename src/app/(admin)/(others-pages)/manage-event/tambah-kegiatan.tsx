// tambah-kegiatan.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/Loading/LoadingSpinner';
import { usePegawai } from '@/hooks/usePegawai';
import { useAuth } from '@/context/AuthContext';
import { Plus, Minus } from "lucide-react";
import { IkuItem, RkItem, ProyekItem, ikuRkData } from "@/components/ikurkproyek/ikurkproyek";

// Interfaces for form data
interface PetugasTarget {
  pegawai: string; // Stores username
  target: number | "";
}

interface KegiatanForm {
  iku: string;
  rk: string;
  proyek: string;
  namaKegiatan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  mitra: string;
  satuanTarget: string;
  petugasTarget: PetugasTarget[];
}

export default function ManajemenKegiatanStatistik() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { pegawai, loading: loadingPegawai } = usePegawai();

  const [formData, setFormData] = useState<KegiatanForm>({
    iku: "",
    rk: "",
    proyek: "",
    namaKegiatan: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    mitra: "",
    satuanTarget: "",
    petugasTarget: [{ pegawai: "", target: "" }],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof KegiatanForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Optimize RK filtering with useMemo
  const filteredRks = useMemo(() => {
    return formData.iku
      ? ikuRkData.find((item) => item.iku === formData.iku)?.rks || []
      : [];
  }, [formData.iku]);

  // Optimize Proyek filtering based on selected RK
  const filteredProyeks = useMemo(() => {
    if (!formData.rk) return [];
    for (const ikuItem of ikuRkData) {
      const rkItem = ikuItem.rks.find((rk) => rk.value === formData.rk);
      if (rkItem) return rkItem.proyeks;
    }
    return [];
  }, [formData.rk]);

  // Helper function to format date in YYYY-MM-DD without UTC offset
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Pre-fill date from calendar click
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setFormData(prev => ({
        ...prev,
        tanggalMulai: dateParam,
        tanggalSelesai: dateParam,
      }));
    }
  }, [searchParams]);

  // Handle input changes for text, select, and date fields
  const handleInputChange = (field: keyof KegiatanForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Reset dependent fields
    if (field === 'iku' && value !== formData.iku) {
      setFormData(prev => ({
        ...prev,
        rk: "",
        proyek: "",
        petugasTarget: [{ pegawai: "", target: "" }],
      }));
    }

    if (field === 'rk' && value !== formData.rk) {
      setFormData(prev => ({
        ...prev,
        proyek: "",
        petugasTarget: [{ pegawai: "", target: "" }],
      }));
    }
  };

  // Handle changes in petugasTarget fields
  const handlePetugasTargetChange = (index: number, event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = event.target;
    const newPetugasTarget = [...formData.petugasTarget];
    
    if (name === "target") {
      const numericValue = value === "" ? "" : parseInt(value, 10);
      newPetugasTarget[index]["target"] = numericValue === "" || isNaN(numericValue) || numericValue < 0 ? "" : numericValue;
    } else if (name === "pegawai") {
      newPetugasTarget[index]["pegawai"] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      petugasTarget: newPetugasTarget,
    }));

    // Clear error for petugasTarget if all fields are valid
    if (errors.petugasTarget && newPetugasTarget.every(field => field.pegawai && field.target !== "" && Number(field.target) >= 0)) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.petugasTarget;
        return newErrors;
      });
    }
  };

  // Add new petugas target field
  const handleAddPetugasField = () => {
    setFormData(prev => ({
      ...prev,
      petugasTarget: [...prev.petugasTarget, { pegawai: "", target: "" }],
    }));
  };

  // Remove petugas target field
  const handleRemovePetugasField = (index: number) => {
    const newPetugasTarget = formData.petugasTarget.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      petugasTarget: newPetugasTarget.length > 0 ? newPetugasTarget : [{ pegawai: "", target: "" }],
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof KegiatanForm, string>> = {};

    if (!formData.iku.trim()) newErrors.iku = "IKU harus dipilih";
    if (!formData.rk.trim()) newErrors.rk = "RK harus dipilih";
    if (!formData.proyek.trim()) newErrors.proyek = "Proyek harus dipilih";
    if (!formData.namaKegiatan.trim()) newErrors.namaKegiatan = "Nama kegiatan harus diisi";
    if (!formData.tanggalMulai) newErrors.tanggalMulai = "Tanggal mulai harus diisi";
    if (!formData.tanggalSelesai) newErrors.tanggalSelesai = "Tanggal selesai harus diisi";
    if (!formData.satuanTarget) newErrors.satuanTarget = "Satuan target harus dipilih";
    if (formData.petugasTarget.length === 0 || formData.petugasTarget.every(field => !field.pegawai)) {
      newErrors.petugasTarget = "Pilih minimal satu pegawai dengan target";
    } else if (!formData.petugasTarget.every(field => field.pegawai && field.target !== "" && Number(field.target) >= 0)) {
      newErrors.petugasTarget = "Semua pegawai harus memiliki target yang valid";
    }

    // Validate dates
    if (formData.tanggalMulai && formData.tanggalSelesai) {
      const startDate = new Date(formData.tanggalMulai);
      const endDate = new Date(formData.tanggalSelesai);
      if (endDate < startDate) {
        newErrors.tanggalSelesai = "Tanggal selesai tidak boleh sebelum tanggal mulai";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlert({
        show: true,
        message: "Harap perbaiki kesalahan pada form sebelum submit",
        type: "error",
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
        petugas_target: formData.petugasTarget.map(field => ({
          pegawai: field.pegawai,
          target: field.target === "" ? 0 : Number(field.target),
        })),
        mitra: formData.mitra || null,
        satuan_target: formData.satuanTarget,
        created_at: new Date(),
        updated_at: new Date(),
        status: 'draft',
        created_by: user?.id || 'unknown',
      };

      const docRef = await addDoc(collection(db, "kegiatan"), kegiatanData);

      setAlert({
        show: true,
        message: `Kegiatan berhasil disimpan dengan ID: ${docRef.id}`,
        type: "success",
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
        satuanTarget: "",
        petugasTarget: [{ pegawai: "", target: "" }],
      });

    } catch (error: any) {
      console.error("Firebase error:", error);
      setAlert({
        show: true,
        message: `Error: ${error.message}`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
    }
  };

  // ArrowDownIcon component for select dropdowns
  const ArrowDownIcon = () => (
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
          <path
            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </span>
  );

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
        <div className="w-full max-w-4xl">
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
                <ArrowDownIcon />
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
                  <ArrowDownIcon />
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
                    {filteredProyeks.map((proyekItem) => (
                      <option key={proyekItem.value} value={proyekItem.value} className="text-gray-900 dark:text-gray-200">
                        {proyekItem.name}
                      </option>
                    ))}
                  </select>
                  <ArrowDownIcon />
                </div>
                {errors.proyek && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.proyek}</p>
                )}
              </div>
            )}

            {/* Activity Form */}
            {formData.rk && (
              <div className="w-full space-y-8 border-t dark:border-gray-700 pt-8">
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
                      defaultValue={formData.tanggalMulai}
                      onChange={([date]: Date[]) => handleInputChange('tanggalMulai', date ? formatDate(date) : "")}
                      options={{
                        dateFormat: "Y-m-d",
                        altInput: true,
                        altFormat: "d/m/Y",
                        locale: { firstDayOfWeek: 1 },
                        minDate: "today",
                        enableTime: false,
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
                      defaultValue={formData.tanggalSelesai}
                      onChange={([date]: Date[]) => handleInputChange('tanggalSelesai', date ? formatDate(date) : "")}
                      options={{
                        dateFormat: "Y-m-d",
                        altInput: true,
                        altFormat: "d/m/Y",
                        locale: { firstDayOfWeek: 1 },
                        minDate: formData.tanggalMulai || "today",
                        enableTime: false,
                      }}
                      className="w-full rounded border-[1.5px] border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    />
                    {errors.tanggalSelesai && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggalSelesai}</p>
                    )}
                  </div>
                </div>

                {/* Penugasan Petugas */}
                <div className="w-full space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Penugasan Petugas <span className="text-error-500">*</span>
                  </h2>
                  {formData.petugasTarget.map((field, index) => (
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
                              onChange={(e) => handlePetugasTargetChange(index, e)}
                              className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                              disabled={loadingPegawai}
                            >
                              <option value="" disabled>-- Pilih Pegawai --</option>
                              {pegawai.map((user) => (
                                <option key={user.id} value={user.username}>
                                  {user.name}
                                </option>
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
                            onChange={(e) => handlePetugasTargetChange(index, e)}
                            placeholder="0"
                            min="0"
                            className="w-full rounded-lg border border-gray-300 bg-gray-100 py-3 px-5 font-medium text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 self-end mt-4 md:mt-0">
                        {formData.petugasTarget.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePetugasField(index)}
                            className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition"
                            aria-label="Hapus Petugas"
                          >
                            <Minus size={24} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleAddPetugasField}
                          className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition"
                          aria-label="Tambah Petugas"
                        >
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {errors.petugasTarget && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.petugasTarget}</p>
                  )}
                </div>


                <div className="w-full mb-8">
                  <label htmlFor="satuan-target" className="mb-3 block text-base font-medium text-gray-800 dark:text-gray-200">
                    Pilih Satuan Target <span className="text-error-500">*</span>
                  </label>
                  <div className="relative z-20 bg-gray-100 dark:bg-gray-800">
                    <select
                      id="satuan-target"
                      value={formData.satuanTarget}
                      onChange={(e) => handleInputChange('satuanTarget', e.target.value)}
                      className="w-full appearance-none rounded border border-gray-300 bg-transparent py-3 px-5 text-gray-900 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                    >
                      <option value="">-- Pilih Satuan --</option>
                      <option value="rumah_tangga" className="text-gray-900 dark:text-gray-200">Rumah Tangga</option>
                      <option value="desa" className="text-gray-900 dark:text-gray-200">Desa</option>
                      <option value="dokumen" className="text-gray-900 dark:text-gray-200">Dokumen</option>
                    </select>
                    <ArrowDownIcon />
                  </div>
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