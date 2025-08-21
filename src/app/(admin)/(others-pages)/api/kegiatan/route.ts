import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      iku,
      rk,
      proyek,
      nama_kegiatan,
      tanggal_mulai,
      tanggal_selesai,
      pegawai,
      mitra,
      target_petugas,
      satuan_target
    } = body;

    // Validasi data required
    if (!iku || !rk || !proyek || !nama_kegiatan || !tanggal_mulai || !tanggal_selesai || !target_petugas) {
      return NextResponse.json(
        { error: 'Data yang diperlukan tidak lengkap' },
        { status: 400 }
      );
    }

    // Simpan ke Firestore
    const docRef = await addDoc(collection(db, 'kegiatan'), {
      iku,
      rk,
      proyek,
      nama_kegiatan,
      tanggal_mulai,
      tanggal_selesai,
      pegawai: pegawai || null,
      mitra: mitra || null,
      target_petugas: parseInt(target_petugas),
      satuan_target: satuan_target || 'rumah_tangga',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });

    return NextResponse.json({
      success: true,
      message: 'Kegiatan berhasil disimpan',
      id: docRef.id
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving kegiatan:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}