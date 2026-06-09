import { useQuery } from '@tanstack/react-query';
import type { WilayahItem } from '@/types/registration';

const WILAYAH_BASE = 'https://www.emsifa.com/api-wilayah-indonesia/api';

async function fetchProvinces(): Promise<WilayahItem[]> {
  const res = await fetch(`${WILAYAH_BASE}/provinces.json`);
  if (!res.ok) throw new Error('Gagal memuat data provinsi');
  return res.json() as Promise<WilayahItem[]>;
}

async function fetchRegencies(provinceId: string): Promise<WilayahItem[]> {
  const res = await fetch(`${WILAYAH_BASE}/regencies/${provinceId}.json`);
  if (!res.ok) throw new Error('Gagal memuat data kota/kabupaten');
  return res.json() as Promise<WilayahItem[]>;
}

export function useProvinces() {
  return useQuery({
    queryKey: ['wilayah', 'provinces'],
    queryFn: fetchProvinces,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useRegencies(provinceId: string) {
  return useQuery({
    queryKey: ['wilayah', 'regencies', provinceId],
    queryFn: () => fetchRegencies(provinceId),
    enabled: Boolean(provinceId),
    staleTime: 1000 * 60 * 60 * 24,
  });
}
