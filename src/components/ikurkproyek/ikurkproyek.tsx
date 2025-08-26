// ikurkproyek.tsx

// Interfaces for type safety
export interface ProyekItem {
  value: string;
  name: string;
}

export interface RkItem {
  value: string;
  name: string;
  proyeks: ProyekItem[];
}

export interface IkuItem {
  iku: string;
  name: string;
  rks: RkItem[];
}


// Static data for IKU, RK, Proyek, and Mitra
export const ikuRkData: IkuItem[] = [
  {
    "iku": "Persentase Publikasi/Laporan Statistik Kependudukan Dan Ketenagakerjaan Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Statistik Kependudukan Dan Ketenagakerjaan Yang Berkualitas",
    "rks": [
      {
        "value": "1.1  Tersusunnya Publikasi/Laporan Statistik Kependudukan yang Berkualitas dan terbit tepat waktu",
        "name": "1.1  Tersusunnya Publikasi/Laporan Statistik Kependudukan yang Berkualitas dan terbit tepat waktu",
        "proyeks": [
          {
            "value": "1.1.1 Publikasi/Laporan Survei Penduduk Antar Sensus yang Berkualitas dan Terbit Tepat Waktu",
            "name": "1.1.1 Publikasi/Laporan Survei Penduduk Antar Sensus yang Berkualitas dan Terbit Tepat Waktu"
          }
        ]
      },
      {
        "value": "1.2 Tersusunnya Publikasi/Laporan Statistik Ketenagakerjaan yang Berkualitas dan terbit tepat waktu",
        "name": "1.2 Tersusunnya Publikasi/Laporan Statistik Ketenagakerjaan yang Berkualitas dan terbit tepat waktu",
        "proyeks": [
          {
            "value": "1.1.2 Publikasi/Laporan Survei Angkatan Kerja Nasional yang Berkualitas dan Terbit Tepat Waktu",
            "name": "1.1.2 Publikasi/Laporan Survei Angkatan Kerja Nasional yang Berkualitas dan Terbit Tepat Waktu"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas",
    "rks": [
      {
        "value": "1.1 Jumlah Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas dan terbit tepat waktu",
        "name": "1.1 Jumlah Publikasi/Laporan Statistik Kesejahteraan Rakyat Yang Berkualitas dan terbit tepat waktu",
        "proyeks": [
          {
            "value": "1.1.1 Publikasi/Laporan Susenas yang berkualitas dan tepat waktu sebanyak 100%",
            "name": "1.1.1 Publikasi/Laporan Susenas yang berkualitas dan tepat waktu sebanyak 100%"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas",
    "rks": [
      {
        "value": "1.1 Jumlah Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.1 Jumlah Publikasi/Laporan Statistik Ketahanan Sosial Yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.1.1 Publikasi/Laporan SNLIK 2025 yang berkualitas dan tepat waktu sebanyak 100%",
            "name": "1.1.1 Publikasi/Laporan SNLIK 2025 yang berkualitas dan tepat waktu sebanyak 100%"
          },
          {
            "value": "1.1.2 Ground Check DTSEN Tahun 2025",
            "name": "1.1.2 Ground Check DTSEN Tahun 2025"
          }
        ]
      },
      {
        "value": "1.2 Jumlah Desa Yang Berpredikat Desa Cinta Statistik di Kabupaten OKU Selatan",
        "name": "1.2 Jumlah Desa Yang Berpredikat Desa Cinta Statistik di Kabupaten OKU Selatan",
        "proyeks": [
          {
            "value": "1.2.1 Desa Yang Berpredikat Desa Cinta Statistik di Kabupaten OKU Selatan Selesai 100%",
            "name": "1.2.1 Desa Yang Berpredikat Desa Cinta Statistik di Kabupaten OKU Selatan Selesai 100%"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase Publikasi/Laporan Statistik Tanaman Pangan, Hortikultura, Dan Perkebunan Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Statistik Tanaman Pangan, Hortikultura, Dan Perkebunan Yang Berkualitas",
    "rks": [
      {
        "value": "1.1 Jumlah Publikasi/Laporan Statistik Tanaman Pangan, Hortikultura, Dan Perkebunan Yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.1 Jumlah Publikasi/Laporan Statistik Tanaman Pangan, Hortikultura, Dan Perkebunan Yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.1.1 Publikasi/Laporan Statistik Tanaman Pangan yang berkualitas dan tepat waktu sebanyak 100%",
            "name": "1.1.1 Publikasi/Laporan Statistik Tanaman Pangan yang berkualitas dan tepat waktu sebanyak 100%"
          },
          {
            "value": "1.1.2 Publikasi/Laporan Survei Hortikultura dan Perkebunan yang berkualitas dan tepat waktu sebanyak 100%",
            "name": "1.1.2 Publikasi/Laporan Survei Hortikultura dan Perkebunan yang berkualitas dan tepat waktu sebanyak 100%"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase Publikasi/Laporan Statistik Peternakan, Perikanan, Dan Kehutanan Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Statistik Peternakan, Perikanan, Dan Kehutanan Yang Berkualitas",
    "rks": [
      {
        "value": "1.1 Jumlah Publikasi/Laporan Statistik Peternakan, Perikanan, Dan Kehutanan Yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.1 Jumlah Publikasi/Laporan Statistik Peternakan, Perikanan, Dan Kehutanan Yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.1.1 Publikasi/Laporan Statistik Peternakan, Perikanan, dan Kehutanan yang berkualitas dan tepat waktu sebanyak 100%",
            "name": "1.1.1 Publikasi/Laporan Statistik Peternakan, Perikanan, dan Kehutanan yang berkualitas dan tepat waktu sebanyak 100%"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase Publikasi/Laporan Statistik Industri Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Statistik Industri Yang Berkualitas",
    "rks": [
      {
        "value": "1.1 Jumlah Publikasi/Laporan Statistik Industri Yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.1 Jumlah Publikasi/Laporan Statistik Industri Yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.1.1 Kegiatan Statistik Konstruksi Tahun 2025",
            "name": "1.1.1 Kegiatan Statistik Konstruksi Tahun 2025"
          },
          {
            "value": "1.1.2 Kegiatan Statistik Pertambangan, Penggalian, dan Energi",
            "name": "1.1.2 Kegiatan Statistik Pertambangan, Penggalian, dan Energi"
          },
          {
            "value": "1.1.3 Kegiatan Statistik Industri 2025",
            "name": "1.1.3 Kegiatan Statistik Industri 2025"
          }
        ]
      },
      {
        "value": "1.2 Jumlah Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, dan Pariwisata Yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.2 Jumlah Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, dan Pariwisata Yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.2.1 Statistik Keuangan, Teknologi Informasi, dan Pariwisata",
            "name": "1.2.1 Statistik Keuangan, Teknologi Informasi, dan Pariwisata"
          }
        ]
      },
      {
        "value": "1.3 Terlaksananya Pembangunan Zona Integritas Menuju WBK dengan nilai 82,219",
        "name": "1.3 Terlaksananya Pembangunan Zona Integritas Menuju WBK dengan nilai 82,219",
        "proyeks": [
          {
            "value": "1.3.1 Pembangunan Zona Integritas menuju WBK",
            "name": "1.3.1 Pembangunan Zona Integritas menuju WBK"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase Publikasi/Laporan Statistik Distribusi Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Statistik Distribusi Yang Berkualitas",
    "rks": [
      {
        "value": "1.1 Jumlah Publikasi/Laporan Statistik Distribusi Yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.1 Jumlah Publikasi/Laporan Statistik Distribusi Yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.1.1 Publikasi/Laporan Statistik Distribusi",
            "name": "1.1.1 Publikasi/Laporan Statistik Distribusi"
          }
        ]
      },
      {
        "value": "1.2 Jumlah Publikasi/Laporan Sensus Ekonomi Yang Berkualitas dan Tepat Waktu",
        "name": "1.2 Jumlah Publikasi/Laporan Sensus Ekonomi Yang Berkualitas dan Tepat Waktu",
        "proyeks": [
          {
            "value": "1.2.1  Publikasi/Laporan Sensus Ekonomi",
            "name": "1.2.1  Publikasi/Laporan Sensus Ekonomi"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase Publikasi/Laporan Statistik Harga Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Statistik Harga Yang Berkualitas",
    "rks": [
      {
        "value": "1.1 Jumlah Publikasi/Laporan Statistik Harga Yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.1 Jumlah Publikasi/Laporan Statistik Harga Yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.1.1 Publikasi/Laporan Statistik Harga",
            "name": "1.1.1 Publikasi/Laporan Statistik Harga"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, Dan Pariwisata Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, Dan Pariwisata Yang Berkualitas",
    "rks": [
      {
        "value": "1.1 Jumlah Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, Dan Pariwisata Yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.1 Jumlah Publikasi/Laporan Statistik Keuangan, Teknologi Informasi, Dan Pariwisata Yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.1.1 Statistik Keuangan, Teknologi Informasi dan Pariwisata",
            "name": "1.1.1 Statistik Keuangan, Teknologi Informasi dan Pariwisata"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase Publikasi/Laporan Neraca Produksi Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Neraca Produksi Yang Berkualitas",
    "rks": [
      {
        "value": "1.1 Jumlah Publikasi/Laporan Neraca Produksi yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.1 Jumlah Publikasi/Laporan Neraca Produksi yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.1.1 Pelaksaan Kegiatan Neraca Produksi",
            "name": "1.1.1 Pelaksaan Kegiatan Neraca Produksi"
          },
          {
            "value": "1.1.2. PDRB Lapangan Usaha",
            "name": "1.1.2. PDRB Lapangan Usaha"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase Publikasi/Laporan Neraca Pengeluaran Yang Berkualitas",
    "name": "Persentase Publikasi/Laporan Neraca Pengeluaran Yang Berkualitas",
    "rks": [
      {
        "value": "1.2 Jumlah Publikasi/Laporan Neraca Pengeluaran yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.2 Jumlah Publikasi/Laporan Neraca Pengeluaran yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.2.1 Pelaksanaan Kegiatan Neraca Pengeluaran",
            "name": "1.2.1 Pelaksanaan Kegiatan Neraca Pengeluaran"
          },
          {
            "value": "1.2.2 PDRB Pengeluaran",
            "name": "1.2.2 PDRB Pengeluaran"
          }
        ]
      }
    ]
  },
  {
    "iku": "Persentase publikasi/laporan Analisis dan Pengembangan Statistik yang berkualitas",
    "name": "Persentase publikasi/laporan Analisis dan Pengembangan Statistik yang berkualitas",
    "rks": [
      {
        "value": "1.3 Jumlah publikasi/laporan Statistik Lintas Sektor yang Berkualitas dan Terbit Tepat Waktu",
        "name": "1.3 Jumlah publikasi/laporan Statistik Lintas Sektor yang Berkualitas dan Terbit Tepat Waktu",
        "proyeks": [
          {
            "value": "1.3.1 Kegiatan Statistik Lintas Sektor",
            "name": "1.3.1 Kegiatan Statistik Lintas Sektor"
          },
          {
            "value": "1.3.2 Publikasi Analisis Lintas Sektor",
            "name": "1.3.2 Publikasi Analisis Lintas Sektor"
          }
        ]
      }
    ]
  },
  {
    "iku": "Tingkat Penyelenggaraan Pembinaan Statistik Sektoral sesuai standar",
    "name": "Tingkat Penyelenggaraan Pembinaan Statistik Sektoral sesuai standar",
    "rks": [
      {
        "value": "1.1 Nilai Evaluasi Penyelenggaraan Statistik Sektoral sebesar 2,29",
        "name": "1.1 Nilai Evaluasi Penyelenggaraan Statistik Sektoral sebesar 2,29",
        "proyeks": [
          {
            "value": "1.1.1  Publikasi/Laporan Evaluasi Penyelengaraan Statistik Sektoral",
            "name": "1.1.1  Publikasi/Laporan Evaluasi Penyelengaraan Statistik Sektoral"
          }
        ]
      },
      {
        "value": "1.2 Jumlah OPD yang mendapatkan Pembinaan Statistik Sektoral sesuai standar",
        "name": "1.2 Jumlah OPD yang mendapatkan Pembinaan Statistik Sektoral sesuai standar",
        "proyeks": [
          {
            "value": "1.2.1  Publikasi /Laporan Pembinaan Staistik Sektoral",
            "name": "1.2.1  Publikasi /Laporan Pembinaan Staistik Sektoral"
          }
        ]
      }
    ]
  },
  {
    "iku": "Indeks Pelayanan Publik - Penilaian Mandiri",
    "name": "Indeks Pelayanan Publik - Penilaian Mandiri",
    "rks": [
      {
        "value": "1.1 Tercapainya nilai Indeks Pelayanan Publik (Penilaian Mandiri) sebesar 3,33 Poin",
        "name": "1.1 Tercapainya nilai Indeks Pelayanan Publik (Penilaian Mandiri) sebesar 3,33 Poin",
        "proyeks": [
          {
            "value": "1.1.1 Tercapainya Indeks Pelayanan Publik (Penilaian Mandiri) Sebesar 3,33 Poin",
            "name": "1.1.1 Tercapainya Indeks Pelayanan Publik (Penilaian Mandiri) Sebesar 3,33 Poin"
          },
          {
            "value": "1.1.2 Pengolahan dan Diseminasi Statistik",
            "name": "1.1.2 Pengolahan dan Diseminasi Statistik"
          }
        ]
      }
    ]
  },
  {
    "iku": "Nilai SAKIP oleh Inspektorat",
    "name": "Nilai SAKIP oleh Inspektorat",
    "rks": [
      {
        "value": "1.1 Tercapainya Nilai SAKIP oleh Inspektorat sebesar 76,10 poin",
        "name": "1.1 Tercapainya Nilai SAKIP oleh Inspektorat sebesar 76,10 poin",
        "proyeks": [
          {
            "value": "1.1.1 Pelaksanaan Dukungan Layanan Manajemen Internal",
            "name": "1.1.1 Pelaksanaan Dukungan Layanan Manajemen Internal"
          },
          {
            "value": "1.1.2 Pelaksanaan Pengadaan Barang dan Jasa",
            "name": "1.1.2 Pelaksanaan Pengadaan Barang dan Jasa"
          },
          {
            "value": "1.1.3 Pemenuhan Dokumen Pendukung SAKIP yang Lengkap dan Tepat Waktu",
            "name": "1.1.3 Pemenuhan Dokumen Pendukung SAKIP yang Lengkap dan Tepat Waktu"
          },
          {
            "value": "1.1.4 Penyelenggaraan Layanan Umum",
            "name": "1.1.4 Penyelenggaraan Layanan Umum"
          },
          {
            "value": "1.1.5 Pengelolaan Anggaran yang Akuntabel dan Sesuai SOP",
            "name": "1.1.5 Pengelolaan Anggaran yang Akuntabel dan Sesuai SOP"
          }
        ]
      }
    ]
  },
  {
    "iku": "Indeks Implementasi BerAKHLAK",
    "name": "Indeks Implementasi BerAKHLAK",
    "rks": [
      {
        "value": "1.1 Tercapainya Nilai BerAKHLAK sebesar 64,3 persen",
        "name": "1.1 Tercapainya Nilai BerAKHLAK sebesar 64,3 persen",
        "proyeks": [
          {
            "value": "1.1.1 Layanan SDM yang Efektif dan Efisien",
            "name": "1.1.1 Layanan SDM yang Efektif dan Efisien"
          }
        ]
      }
    ]
  }
];
