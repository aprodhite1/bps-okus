"use client";

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useMemo, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interface untuk data progress
interface UserProgress {
  tercapai: number;
  target: number;
  progress_percentage: number;
  catatan?: string;
  last_updated?: Date;
}

// Interface untuk petugas target
interface PetugasTarget {
  pegawai: string;
  target: number;
}

// Interface untuk data kegiatan
interface Kegiatan {
  id: string;
  nama_kegiatan: string;
  iku: string;
  rk: string;
  proyek: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  satuan_target: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  petugas_target: PetugasTarget[];
  progress: Record<string, UserProgress>;
}

// Interface untuk data user
interface UserData {
  username: string;
  name: string;
}

// Interface untuk data agregasi pegawai
interface PegawaiData {
  namaPegawai: string;
  username: string;
  jumlahKegiatan: number;
  targetTotal: number;
  totalTercapai: number;
  persentaseSelesai: number;
}

export default function MonitoringKinerjaASN() {
  const { user } = useAuth();
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pegawaiData, setPegawaiData] = useState<PegawaiData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString()); // Default to current year
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]); // Array of '01' to '12', empty for all
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);

  // Fetch kegiatan dari Firestore
  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        setLoading(true);
        const kegiatanRef = collection(db, 'kegiatan');
        const kegiatanSnap = await getDocs(kegiatanRef);
        
        const kegiatanData: Kegiatan[] = [];
        kegiatanSnap.forEach((doc) => {
          const data = doc.data();
          kegiatanData.push({
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate() || new Date(),
            updated_at: data.updated_at?.toDate() || new Date(),
          } as Kegiatan);
        });

        setKegiatan(kegiatanData);
        setError(null);
      } catch (err) {
        console.error('Error fetching kegiatan:', err);
        setError('Gagal memuat data kegiatan');
      } finally {
        setLoading(false);
      }
    };

    fetchKegiatan();
  }, []);

  // Fetch all users dari Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        const userData: UserData[] = [];
        
        usersSnap.forEach((doc) => {
          const data = doc.data();
          userData.push({
            username: data.username,
            name: data.name || data.username,
          });
        });

        setUsers(userData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Gagal memuat data pengguna');
      }
    };

    fetchUsers();
  }, []);

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
  const formatSelectedYear = () => {
    return selectedYear || 'Pilih Tahun';
  };

  // Format selected months as range or list
  const formatSelectedMonths = () => {
    if (selectedMonths.length === 0 || selectedMonths.length === monthsList.length) {
      return 'Semua Bulan';
    }
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
      if (currMonth === prevMonth + 1) {
        currentRange.push(sortedMonths[i]);
      } else {
        ranges.push(currentRange);
        currentRange = [sortedMonths[i]];
      }
    }
    ranges.push(currentRange);

    const formattedRanges = ranges.map(range => {
      const firstMonth = monthsList.find(m => m.value === range[0]);
      const lastMonth = monthsList.find(m => m.value === range[range.length - 1]);
      if (range.length === 1) {
        return firstMonth?.label.slice(0, 3) || '';
      }
      return `${firstMonth?.label.slice(0, 3)}-${lastMonth?.label.slice(0, 3)}`;
    });

    return formattedRanges.join(', ');
  };

  // Aggregasi data pegawai berdasarkan semua users dan filter tahun/bulan
  useEffect(() => {
    const filteredKegiatan = kegiatan.filter(k => {
      const startDate = new Date(k.tanggal_mulai);
      const endDate = new Date(k.tanggal_selesai);
      const startYear = startDate.getFullYear().toString();
      const endYear = endDate.getFullYear().toString();
      const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
      const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');

      // Year filter (match if either start or end year matches selectedYear)
      const yearMatch = selectedYear ? (startYear === selectedYear || endYear === selectedYear) : false;

      // Month filter (if months selected, check overlap)
      let monthMatch = true;
      if (selectedMonths.length > 0) {
        monthMatch = selectedMonths.includes(startMonth) || selectedMonths.includes(endMonth);
      }

      return yearMatch && monthMatch;
    });

    // Initialize aggregation with all users
    const aggregation: Record<string, PegawaiData> = {};
    users.forEach(u => {
      aggregation[u.username] = {
        namaPegawai: u.name,
        username: u.username,
        jumlahKegiatan: 0,
        targetTotal: 0,
        totalTercapai: 0,
        persentaseSelesai: 0,
      };
    });

    // Update aggregation based on filtered kegiatan
    filteredKegiatan.forEach((kegiatanItem) => {
      kegiatanItem.petugas_target?.forEach((petugas) => {
        const username = petugas.pegawai;
        
        if (aggregation[username]) {
          aggregation[username].jumlahKegiatan += 1;
          aggregation[username].targetTotal += petugas.target;

          // Cek progress user
          const userProgress = kegiatanItem.progress?.[username];
          if (userProgress) {
            aggregation[username].totalTercapai += userProgress.tercapai;
            aggregation[username].persentaseSelesai += userProgress.progress_percentage;
          }
        }
      });
    });

    // Hitung persentase selesai rata-rata dan filter hanya pegawai dengan kegiatan
    const finalData = Object.values(aggregation)
      .map((data) => ({
        ...data,
        persentaseSelesai: data.jumlahKegiatan > 0 
          ? Math.round(data.persentaseSelesai / data.jumlahKegiatan)
          : 0,
      }))
      .filter(data => data.jumlahKegiatan > 0); // Only include pegawai with kegiatan

    // Urutkan berdasarkan nama pegawai
    finalData.sort((a, b) => a.namaPegawai.localeCompare(b.namaPegawai));

    setPegawaiData(finalData);
  }, [kegiatan, users, selectedYear, selectedMonths]);

  // Handle year selection (single selection)
  const handleYearSelect = (year: string) => {
    setSelectedYear(year); // Set the selected year, replacing any previous selection
    setSelectedMonths([]); // Reset months when changing year
    setIsYearOpen(false); // Close dropdown after selection
  };

  // Toggle year dropdown
  const toggleYearDropdown = () => {
    setIsYearOpen(prev => !prev);
  };

  // Toggle month dropdown
  const toggleMonthDropdown = () => {
    setIsMonthOpen(prev => !prev);
  };

  // Handle month checkbox change with auto-select/deselect for intermediate months
  const handleMonthCheckboxChange = (month: string) => {
    setSelectedMonths(prev => {
      if (prev.includes(month)) {
        // Deselect: Remove the month and re-evaluate ranges
        const newMonths = prev.filter(m => m !== month);
        if (newMonths.length <= 1) return newMonths; // No range needed for 0 or 1 month
        // Sort remaining months
        const sortedMonths = [...newMonths].sort((a, b) => parseInt(a) - parseInt(b));
        return sortedMonths;
      } else {
        // Select: Add the month and fill in gaps if needed
        const newMonths = [...prev, month].sort((a, b) => parseInt(a) - parseInt(b));
        if (newMonths.length > 1) {
          const minMonth = parseInt(newMonths[0], 10);
          const maxMonth = parseInt(newMonths[newMonths.length - 1], 10);
          // Include all months in the range
          const filledMonths: string[] = [];
          for (let i = minMonth; i <= maxMonth; i++) {
            filledMonths.push(String(i).padStart(2, '0'));
          }
          return filledMonths;
        }
        return newMonths;
      }
    });
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle row click untuk navigasi
  const handleRowClick = (username: string) => {
    window.location.href = `/pegawai/${username}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 dark:border-blue-500"></div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Memuat data kinerja...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md dark:shadow-gray-900/50 p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gagal Memuat Data</h3>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p>{error}</p>
              <p className="mt-2">Silakan coba lagi dalam beberapa saat.</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Always render header with dropdowns */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoring Kinerja ASN</h2>
        <div className="flex items-center space-x-4">
          {/* Year Single-Select Dropdown */}
          <div className="relative" ref={yearRef}>
            <button
              onClick={toggleYearDropdown}
              className="rounded border border-gray-300 bg-gray-100 py-2 px-4 text-gray-900 flex items-center justify-between min-w-[150px] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              <span>{formatSelectedYear()}</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

          {/* Month Multi-Select Dropdown */}
          <div className="relative" ref={monthRef}>
            <button
              onClick={toggleMonthDropdown}
              className="rounded border border-gray-300 bg-gray-100 py-2 px-4 text-gray-900 flex items-center justify-between min-w-[200px] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              <span>{formatSelectedMonths()}</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

      {/* Enhanced Summary (moved to top) */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-500 dark:from-blue-500 dark:to-blue-500 rounded-xl shadow-lg dark:shadow-gray-900/50 p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2" />
          </svg>
          Ringkasan Kinerja
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Pegawai</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Kegiatan</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pegawaiData.length > 0 ? kegiatan.length : 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Rata-rata Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pegawaiData.length > 0
                    ? Math.round(pegawaiData.reduce((sum, p) => sum + p.persentaseSelesai, 0) / pegawaiData.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pegawai Aktif</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pegawaiData.length > 0 ? pegawaiData.filter(p => p.jumlahKegiatan > 0).length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state for no users or no kegiatan */}
      {(users.length === 0 || pegawaiData.length === 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-8 text-center border border-gray-200 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {users.length === 0 ? 'Belum Ada Data Pegawai' : 'Tidak Ada Kegiatan'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {users.length === 0 
              ? 'Tidak ada data pengguna yang tersedia.' 
              : `Tidak ada kegiatan untuk ${formatSelectedYear()} ${formatSelectedMonths()}.`}
          </p>
          {user?.role === 'admin' && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              <p>Tambahkan pegawai melalui pengelolaan pengguna atau tambahkan kegiatan melalui menu `Tambah Kegiatan`.</p>
            </div>
          )}
        </div>
      )}

      {/* Table (only if there are pegawai with kegiatan) */}
      {pegawaiData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md dark:shadow-gray-900/50">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nama Pegawai
                </th>
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Jumlah Kegiatan
                </th>
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Target Total
                </th>
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-600 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Persentase Selesai
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pegawaiData.map((pegawai) => (
                <tr
                  key={pegawai.username}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                  onClick={() => handleRowClick(pegawai.username)}
                  role="button"
                  aria-label={`Lihat detail untuk ${pegawai.namaPegawai}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {pegawai.namaPegawai}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    {pegawai.jumlahKegiatan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    {pegawai.targetTotal.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                    {pegawai.totalTercapai.toLocaleString('id-ID')}/{pegawai.targetTotal.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(pegawai.persentaseSelesai, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[40px]">
                        {pegawai.persentaseSelesai}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}