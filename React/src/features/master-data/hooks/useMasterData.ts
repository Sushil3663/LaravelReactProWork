import { useQuery } from '@tanstack/react-query';
import { masterDataApi, type Province, type District, type Municipality } from '@/features/master-data/api/masterDataApi';

export function useMasterData() {
  return useQuery({
    queryKey: ['master-data'],
    queryFn: () => masterDataApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProvinces(countryId: string | undefined, provinces: Province[] | undefined) {
  if (!countryId || !provinces) return [];
  return provinces.filter(p => p.country_id === countryId);
}

export function useDistricts(provinceId: string | undefined, districts: District[] | undefined) {
  if (!provinceId || !districts) return [];
  return districts.filter(d => d.provience_id === provinceId);
}

export function useMunicipalities(districtId: string | undefined, municipalities: Municipality[] | undefined) {
  if (!districtId || !municipalities) return [];
  return municipalities.filter(m => m.district_id === districtId);
}
