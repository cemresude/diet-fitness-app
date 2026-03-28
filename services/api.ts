import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Expo dev sunucusunun host bilgisini kullanarak API base URL'ini otomatik hesapla.
const resolveApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const [host, portSegment] = hostUri.split(':');
    const port = portSegment?.split('/')[0] || '8081';
    return `http://${host}:${port}/api`;
  }

  // Geliştirici ortamı için varsayılan.
  return 'http://localhost:8081/api';
};

const API_URL = resolveApiBaseUrl();

// Axios instance oluştur
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token ekleme
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token geçersiz, logout yap
      await SecureStore.deleteItemAsync('auth_token');
      // Navigation ile login sayfasına yönlendir
    }
    return Promise.reject(error);
  }
);

// API Response tipi
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export default api;
