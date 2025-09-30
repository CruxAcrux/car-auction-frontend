import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse, Bid, BidForm, CarAd, CarBrand, CarModel, LoginForm, RegisterForm } from '../types';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: '/api', // ← CHANGE TO THIS
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await useAuthStore.getState().refresh();
        const newToken = localStorage.getItem('accessToken');
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (data: LoginForm): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterForm): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/refresh-token', { refreshToken });
  return response.data;
};

export const getCarAds = async (searchParams: Record<string, any> = {}): Promise<CarAd[]> => {
  const response = await api.post<CarAd[]>('/CarAd/search', searchParams);
  return response.data;
};

export const getCarAdById = async (id: string): Promise<CarAd> => {
  const response = await api.get<CarAd>(`/CarAd/${id}`);
  return response.data;
};

export const createCarAd = async (data: FormData): Promise<CarAd> => {
  const response = await api.post<CarAd>('/CarAd', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateCarAd = async (id: string, data: FormData): Promise<CarAd> => {
  const response = await api.put<CarAd>(`/CarAd/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteCarAd = async (id: string): Promise<void> => {
  await api.delete(`/CarAd/${id}`);
};

export const getBrands = async (): Promise<CarBrand[]> => {
  const response = await api.get<CarBrand[]>('/CarAd/brands');
  return response.data;
};

export const getModelsByBrandId = async (brandId: number): Promise<CarModel[]> => {
  const response = await api.get<CarModel[]>(`/CarAd/brands/${brandId}/models`);
  return response.data;
};

export const placeBid = async (data: BidForm): Promise<Bid> => {
  const response = await api.post<Bid>('/Bid', data);
  return response.data;
};

export const getBidsByCarAdId = async (carAdId: string): Promise<Bid[]> => {
  const response = await api.get<Bid[]>(`/Bid/carAd/${carAdId}`);
  return response.data;
};

export const buyFixedPrice = async (carAdId: string): Promise<void> => {
  await api.post(`/Bid/buy/${carAdId}`);
};