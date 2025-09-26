'use client';

import { useKegiatan } from '@/hooks/useKegiatan';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MonitoringKinerjaASN from '@/components/event/MonitoringKinerjaASN';
import ProtectedRoute from '../auth/ProtectedRoute';
import { Kegiatan } from "@/types/typeKegiatan";
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Hitung progress keseluruhan
const hitungProgressKegiatan = (kegiatan: Kegiatan) => {
  if (!kegiatan.progress) return 0;
  const totalTercapai = Object.values(kegiatan.progress).reduce((sum, p) => sum + p.tercapai, 0);
  const totalTarget = kegiatan.petugas_target.reduce((sum, p) => sum + p.target, 0);
  if (totalTarget === 0) return 0;
  return Math.round((totalTercapai / totalTarget) * 100);
};

export default function KegiatanCard() {
  const { kegiatan, loading, error } = useKegiatan();
  const { user } = useAuth();
  const [useFallback, setUseFallback] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState<'aktif' | 'selesai' | 'monitoring'>('monitoring');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (error && retryCount < 2) {
      const timer = setTimeout(() => {
        console.log('Mencoba kembali...');
        setRetryCount((prev) => prev + 1);
        setUseFallback(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  // Generate available years (2020 to 2030)
  const availableYears = useMemo(() => {
    const years: string[] = [];
    const startYear = 2020;
    const endYear = 2030;
    for (let year = startYear; year <= endYear; year++) {
      years.push(year.toString());
    }
    return years;
  }, []);

  // Fixed months list
  const monthsList = useMemo(() => [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ], []);

  // Format selected year
  const formatSelectedYear = () => selectedYear || 'Pilih Tahun';

  // Format selected months as range or list
  const formatSelectedMonths = () => {
    if (selectedMonths.length === 0 || selectedMonths.length === monthsList.length) return 'Semua Bulan';
    if (selectedMonths.length === 1) {
      const month = monthsList.find(m => m.value === selectedMonths[0]);
      return month ? month.label : 'Bulan';
    }
    const sortedMonths = [...selectedMonths].sort((a, b) => parseInt(a) - parseInt(b));
    const ranges: string[][] = [];
    let currentRange: string[] = [sortedMonths[0]];
    for (let i = 1; i < sortedMonths.length; i++) {
      const prevMonth = parseInt(sortedMonths[i - 1], 10);
      const currMonth = parseInt(sortedMonths[i], 10);
      if (currMonth === prevMonth + 1) currentRange.push(sortedMonths[i]);
      else {
        ranges.push(currentRange);
        currentRange = [sortedMonths[i]];
      }
    }
    ranges.push(currentRange);
    const formattedRanges = ranges.map(range => {
      const firstMonth = monthsList.find(m => m.value === range[0]);
      const lastMonth = monthsList.find(m => m.value === range[range.length - 1]);
      if (range.length === 1) return firstMonth?.label.slice(0, 3) || '';
      return `${firstMonth?.label.slice(0, 3)}-${lastMonth?.label.slice(0, 3)}`;
    });
    return formattedRanges.join(', ');
  };

  // Filter kegiatan berdasarkan view mode dan filter tahun/bulan untuk 'selesai'
  const filteredKegiatan = useMemo(() => {
    if (viewMode === 'monitoring') return kegiatan || [];
    if (viewMode === 'aktif') {
      return (kegiatan || []).filter((k) => {
        const isActive = ['published', 'draft'].includes(k.status) && hitungProgressKegiatan(k) < 100;
        console.log(`Kegiatan ${k.id} (Aktif): status=${k.status}, progress=${hitungProgressKegiatan(k)}%, active=${isActive}`);
        return isActive;
      });
    }
    return (kegiatan || []).filter((k) => {
      const startDate = new Date(k.tanggal_mulai);
      const endDate = new Date(k.tanggal_selesai);
      const startYear = startDate.getFullYear().toString();
      const endYear = endDate.getFullYear().toString();
      const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
      const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
      const yearMatch = selectedYear ? (startYear === selectedYear || endYear === selectedYear) : true;
      let monthMatch = true;
      if (selectedMonths.length > 0) monthMatch = selectedMonths.includes(startMonth) || selectedMonths.includes(endMonth);
      const isSelesai = k.status === 'selesai';
      console.log(`Kegiatan ${k.id} (Selesai): status=${k.status}, yearMatch=${yearMatch}, monthMatch=${monthMatch}, isSelesai=${isSelesai}`);
      return yearMatch && monthMatch && isSelesai;
    });
  }, [kegiatan, viewMode, selectedYear, selectedMonths]);

  // Tombol navigasi
  const renderButtons = () => (
    <div className="flex space-x-4">
      <button
        onClick={() => setViewMode('monitoring')}
        className={`px-4 py-2 rounded-md ${
          viewMode === 'monitoring'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        Monitoring Kinerja ASN
      </button>
      <button
        onClick={() => setViewMode('aktif')}
        className={`px-4 py-2 rounded-md ${
          viewMode === 'aktif'
            ? 'bg-yellow-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        Kegiatan Aktif
      </button>
      <button
        onClick={() => setViewMode('selesai')}
        className={`px-4 py-2 rounded-md ${
          viewMode === 'selesai'
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}
      >
        Kegiatan Selesai
      </button>
    </div>
  );

  // Handle year selection (single selection)
  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setSelectedMonths([]);
    setIsYearOpen(false);
  };

  // Toggle year dropdown
  const toggleYearDropdown = () => setIsYearOpen(prev => !prev);

  // Toggle month dropdown
  const toggleMonthDropdown = () => setIsMonthOpen(prev => !prev);

  // Handle month checkbox change with auto-select/deselect for intermediate months
  const handleMonthCheckboxChange = (month: string) => {
    setSelectedMonths(prev => {
      if (prev.includes(month)) {
        const newMonths = prev.filter(m => m !== month);
        return newMonths.length <= 1 ? newMonths : [...newMonths].sort((a, b) => parseInt(a) - parseInt(b));
      }
      const newMonths = [...prev, month].sort((a, b) => parseInt(a) - parseInt(b));
      if (newMonths.length > 1) {
        const minMonth = parseInt(newMonths[0], 10);
        const maxMonth = parseInt(newMonths[newMonths.length - 1], 10);
        const filledMonths: string[] = [];
        for (let i = minMonth; i <= maxMonth; i++) filledMonths.push(String(i).padStart(2, '0'));
        return filledMonths;
      }
      return newMonths;
    });
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) setIsYearOpen(false);
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) setIsMonthOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Loading
  if (loading && !useFallback) {
    return (
      <>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
        <p className="text-gray-600 dark:text-gray-400">Memuat data kegiatan...</p>
      </>
    );
  }

  // Error
  if (error && !useFallback) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Gagal Memuat Data</h3>
        <p className="text-sm text-red-600 dark:text-red-300 mt-2">{error}</p>
      </div>
    );
  }

  // Monitoring view
  if (viewMode === 'monitoring') {
    return (
      <div className="space-y-6">
        {renderButtons()}
        <MonitoringKinerjaASN />
      </div>
    );
  }

  // Empty state
  if (filteredKegiatan.length === 0) {
    return (
      <div className="space-y-6">
        {renderButtons()}
        {viewMode === 'selesai' && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kegiatan Selesai</h2>
            <div className="flex items-center space-x-4">
              <div className="relative" ref={yearRef}>
                <button
                  onClick={toggleYearDropdown}
                  className="rounded border border-gray-300 bg-gray-100 py-2 px-4 text-gray-900 flex items-center justify-between min-w-[150px] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  <span>{formatSelectedYear()}</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isYearOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto">
                    {availableYears.map((year) => (
                      <div
                        key={year}
                        className={`py-1 px-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                          selectedYear === year ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium' : 'text-gray-900 dark:text-gray-200'
                        }`}
                        onClick={() => handleYearSelect(year)}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={monthRef}>
                <button
                  onClick={toggleMonthDropdown}
                  className="rounded border border-gray-300 bg-gray-100 py-2 px-4 text-gray-900 flex items-center justify-between min-w-[200px] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  <span>{formatSelectedMonths()}</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMonthOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto">
                    {monthsList.map((month) => (
                      <label key={month.value} className="flex items-center space-x-2 py-1 text-sm text-gray-900 dark:text-gray-200">
                        <input
                          type="checkbox"
                          checked={selectedMonths.includes(month.value)}
                          onChange={() => handleMonthCheckboxChange(month.value)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span>{month.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="p-8 text-center bg-white dark:bg-gray-800 border rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {viewMode === 'selesai' ? 'Tidak ada kegiatan selesai' : 'Belum ada data kegiatan'}
          </h3>
        </div>
      </div>
    );
  }

  // Format tanggal
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  // Fungsi untuk menandai kegiatan selesai
  const handleTandaiSelesai = async (kegiatanId: string) => {
    try {
      const kegiatanRef = doc(db, 'kegiatan', kegiatanId);
      await updateDoc(kegiatanRef, {
        status: 'selesai',
        updated_at: new Date(),
      });
      console.log(`Kegiatan ${kegiatanId} ditandai selesai`);
    } catch (err) {
      console.error('Gagal menandai kegiatan selesai:', err);
    }
  };

  // Fungsi untuk menghapus kegiatan dengan konfirmasi
  const handleHapusKegiatan = async (kegiatanId: string, namaKegiatan: string) => {
    const confirmMessage = `Apakah Anda yakin ingin menghapus kegiatan "${namaKegiatan || 'tanpa nama'}" ini?`;
    const isConfirmed = window.confirm(confirmMessage);
    console.log(`Hapus kegiatan ${kegiatanId} (nama: ${namaKegiatan}):`, { isConfirmed });

    if (isConfirmed) {
      try {
        const kegiatanRef = doc(db, 'kegiatan', kegiatanId);
        await deleteDoc(kegiatanRef);
        console.log(`Kegiatan ${kegiatanId} berhasil dihapus`);
      } catch (err) {
        console.error('Gagal menghapus kegiatan:', err);
      }
    } else {
      console.log(`Penghapusan kegiatan ${kegiatanId} dibatalkan`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {renderButtons()}
        {viewMode === 'selesai' && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Kegiatan Selesai</h2>
            <div className="flex items-center space-x-4">
              <div className="relative" ref={yearRef}>
                <button
                  onClick={toggleYearDropdown}
                  className="rounded border border-gray-300 bg-gray-100 py-2 px-4 text-gray-900 flex items-center justify-between min-w-[150px] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  <span>{formatSelectedYear()}</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isYearOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto">
                    {availableYears.map((year) => (
                      <div
                        key={year}
                        className={`py-1 px-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                          selectedYear === year ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium' : 'text-gray-900 dark:text-gray-200'
                        }`}
                        onClick={() => handleYearSelect(year)}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={monthRef}>
                <button
                  onClick={toggleMonthDropdown}
                  className="rounded border border-gray-300 bg-gray-100 py-2 px-4 text-gray-900 flex items-center justify-between min-w-[200px] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  <span>{formatSelectedMonths()}</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMonthOpen && (
                  <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto">
                    {monthsList.map((month) => (
                      <label key={month.value} className="flex items-center space-x-2 py-1 text-sm text-gray-900 dark:text-gray-200">
                        <input
                          type="checkbox"
                          checked={selectedMonths.includes(month.value)}
                          onChange={() => handleMonthCheckboxChange(month.value)}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span>{month.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Daftar Kegiatan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKegiatan.map((item: Kegiatan) => {
            const progressKegiatan = hitungProgressKegiatan(item);
            const totalTarget = item.petugas_target.reduce((sum, p) => sum + p.target, 0);
            const totalTercapai = item.progress
              ? Object.values(item.progress).reduce((sum, p) => sum + p.tercapai, 0)
              : 0;
            const isAdminCreator = user?.username === item.created_by;
            const showTandaiSelesai = progressKegiatan === 100 && isAdminCreator && item.status !== 'selesai';
            const showHapusKegiatan = isAdminCreator && item.status === 'draft';

            // Debugging button visibility
            console.log(`Kegiatan ${item.id}:`, {
              status: item.status,
              isAdminCreator,
              progressKegiatan,
              showTandaiSelesai,
              showHapusKegiatan,
              user: user?.username,
              created_by: item.created_by,
            });

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
              >
                {/* Bagian Judul */}
                <div className="p-4 border-b dark:border-gray-600">
                  <h3
                    className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:underline"
                    onClick={() => router.push(`/kegiatan/${item.id}`)}
                  >
                    {item.nama_kegiatan}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      item.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : item.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : item.status === 'selesai'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Bagian Isi + Progress */}
                <div className="p-4 space-y-3 text-sm text-gray-600 dark:text-gray-300 flex-grow">
                  <p>
                    <strong>Ketua Kegiatan:</strong> {item.created_by}
                  </p>
                  <p>
                    <strong>Periode:</strong> {formatDate(item.tanggal_mulai)} -{' '}
                    {formatDate(item.tanggal_selesai)}
                  </p>
                  <p>
                    <strong>Total Target:</strong> {totalTarget} {item.satuan_target}
                  </p>
                  <p>
                    <strong>Pegawai:</strong> {item.petugas_target.map((p) => p.pegawai).join(', ')}
                  </p>

                  {/* Progress */}
                  <div className="pt-2 border-t dark:border-gray-600">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Progress Keseluruhan
                    </h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progressKegiatan}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {progressKegiatan}% ({totalTercapai}/{totalTarget} {item.satuan_target})
                    </p>
                  </div>
                </div>

                {/* Tombol Aksi */}
                {(showTandaiSelesai || showHapusKegiatan) && (
                  <div className="p-4 border-t dark:border-gray-600 flex flex-col space-y-2">
                    {showTandaiSelesai && (
                      <button
                        onClick={() => handleTandaiSelesai(item.id)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                      >
                        Tandai Selesai
                      </button>
                    )}
                    {showHapusKegiatan && (
                      <button
                        onClick={() => handleHapusKegiatan(item.id, item.nama_kegiatan)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                      >
                        Hapus Kegiatan
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}