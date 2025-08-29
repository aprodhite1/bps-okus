import { useState, useMemo } from 'react';
import { Kegiatan } from '@/types/typeKegiatan';

export function useKegiatanFilter(kegiatan: Kegiatan[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredKegiatan = useMemo(() => {
    return kegiatan.filter((item) => {
      const matchesSearch = item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.proyek.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [kegiatan, searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredKegiatan
  };
}