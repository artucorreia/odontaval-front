import axios from 'axios';
import type { AdminCreateUserRequest, ApiResponse, AuthLoginResponse, CreateEvaluationRequest, DashboardStats, UpdateEvaluationRequest, UpdateRoleRequest } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const API_KEY = import.meta.env.VITE_API_KEY as string;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  config.headers['x-api-key'] = API_KEY;
  if (!config.url?.startsWith('/api/auth/')) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: (email: string, password: string) =>
    api.post<AuthLoginResponse>('/api/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/api/auth/register', { name, email, password }),
};

export const specialismService = {
  findAll: () => api.get('/api/v1/specialisms'),
  findById: (id: string | number) => api.get(`/api/v1/specialisms/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/api/v1/specialisms', data),
  update: (id: string | number, data: { name?: string; description?: string }) =>
    api.put(`/api/v1/specialisms/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/v1/specialisms/${id}`),
  reactivate: (id: string | number) => api.put(`/api/v1/specialisms/${id}/reactivate`),
};

export const evaluationService = {
  findAll: (studentId?: string) =>
    api.get('/api/v1/evaluations', { params: studentId ? { studentId } : undefined }),
  findAllAdmin: () => api.get('/api/v1/evaluations/all'),
  findById: (id: string | number) => api.get(`/api/v1/evaluations/${id}`),
  create: (data: CreateEvaluationRequest) => api.post('/api/v1/evaluations', data),
  update: (id: string | number, data: UpdateEvaluationRequest) =>
    api.put(`/api/v1/evaluations/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/v1/evaluations/${id}`),
  reactivate: (id: string | number) => api.put(`/api/v1/evaluations/${id}/reactivate`),
};

export const userService = {
  findAllAdmin: () => api.get('/api/v1/users/all'),
  findAll: (role: string) => api.get('/api/v1/users', { params: { role } }),
  findById: (id: string) => api.get(`/api/v1/users/${id}`),
  create: (data: AdminCreateUserRequest) => api.post('/api/v1/users', data),
  update: (id: string, data: { name?: string; email?: string }) =>
    api.put(`/api/v1/users/${id}`, data),
  updatePassword: (id: string, data: { currentPassword: string; newPassword: string }) =>
    api.put(`/api/v1/users/${id}/password`, data),
  updateRole: (id: string, data: UpdateRoleRequest) =>
    api.put(`/api/v1/users/${id}/role`, data),
  adminResetPassword: (id: string, data: { newPassword: string }) =>
    api.put(`/api/v1/users/${id}/admin-reset-password`, data),
  delete: (id: string) => api.delete(`/api/v1/users/${id}`),
  reactivate: (id: string) => api.put(`/api/v1/users/${id}/reactivate`),
};

export const dashboardService = {
  getStats: () => api.get<ApiResponse<DashboardStats>>('/api/v1/dashboard/stats'),
  getClassAverages: (excludeStudentId?: string) =>
    api.get('/api/v1/dashboard/class-averages', {
      params: excludeStudentId ? { excludeStudentId } : undefined,
    }),
};

export default api;
