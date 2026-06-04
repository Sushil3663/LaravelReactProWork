import api from '@/shared/api/axiosInstance';

export interface Country {
  id: string;
  title: string;
  code: string | null;
}

export interface Province {
  id: string;
  country_id: string;
  title: string;
  code: string | null;
}

export interface District {
  id: string;
  provience_id: string;
  title: string;
  code: string | null;
}

export interface Municipality {
  id: string;
  district_id: string;
  title: string;
  code: string | null;
}

export interface MasterData {
  country: Country[];
  proviences: Province[];
  district: District[];
  municipilities: Municipality[];
}

interface ApiResponse<T> {
  resCode: string;
  resDesc: string;
  data: T;
}

export const masterDataApi = {
  getAll: () =>
    api.get<ApiResponse<{ masterData: MasterData }>>('/master-data').then(r => r.data),
};
