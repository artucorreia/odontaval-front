import axios from 'axios';
import type { CreateEvaluationRequest, UpdateEvaluationRequest } from '../types';

const BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
    api.post<{ success: boolean; code: number; data: { userId: string; userRole: string; token: string } }>(
      '/api/auth/login',
      { email, password },
    ),
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
};

export const evaluationService = {
  findAll: () => api.get('/api/v1/evaluations'),
  findById: (id: string | number) => api.get(`/api/v1/evaluations/${id}`),
  create: (data: CreateEvaluationRequest) => api.post('/api/v1/evaluations', data),
  update: (id: string | number, data: UpdateEvaluationRequest) =>
    api.put(`/api/v1/evaluations/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/v1/evaluations/${id}`),
};

export const userService = {
  findAll: (role?: string) =>
    api.get('/api/v1/users', { params: role ? { role } : {} }),
};

export const dashboardService = {
  getStats: () => api.get('/api/v1/dashboard/stats'),
};

export default api;
