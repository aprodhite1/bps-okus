// types/Kegiatan.ts

export interface ProgressData {
  target: number;
  tercapai: number;
  progress_percentage: number;
  last_updated?: Date;
  catatan?: string;
}

export interface PetugasTarget {
  pegawai: string;
  target: number;
}

export interface Kegiatan {
  id: string;
  nama_kegiatan: string;
  iku: string;
  rk: string;
  proyek: string;
  tanggal_mulai: Date | string;   // bisa Date atau string dari Firestore
  tanggal_selesai: Date | string;
  petugas_target: PetugasTarget[];
  satuan_target: string;
  status: string;
  created_at: Date;
  updated_at?: Date;
  created_by: string;
  mitra?: string | null;
  progress?: Record<string, ProgressData>;
}
