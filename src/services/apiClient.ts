/**
 * API Client Service
 * Centralized HTTP client for all API calls with interceptors
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Handle 403 forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    return Promise.reject(error);
  }
);

// Generic API methods
const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
};

export default apiClient;
