import axios from 'axios';

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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Auth
export const authService = {
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/api/auth/register', { name, email, password }),
};

// Specialisms
export const specialismService = {
  findAll: () => api.get('/api/v1/specialisms'),
  findById: (id: string | number) => api.get(`/api/v1/specialisms/${id}`),
  create: (data: { name: string; description?: string }) => api.post('/api/v1/specialisms', data),
  update: (id: string | number, data: { name?: string; description?: string }) =>
    api.put(`/api/v1/specialisms/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/v1/specialisms/${id}`),
};

// Exams
export const examService = {
  findAll: () => api.get('/api/v1/exams'),
  findById: (id: string | number) => api.get(`/api/v1/exams/${id}`),
  create: (data: {
    title: string;
    date: string;
    specialismId: number;
    academicSemester: string;
    goals: string;
    serviceUnit: string;
    procedurePerformed: string;
  }) => api.post('/api/v1/exams', data),
  update: (
    id: string | number,
    data: Partial<{
      title: string;
      date: string;
      specialismId: number;
      academicSemester: string;
      goals: string;
      serviceUnit: string;
      procedurePerformed: string;
    }>,
  ) => api.put(`/api/v1/exams/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/v1/exams/${id}`),
};

// Evaluations
export const evaluationService = {
  findAll: () => api.get('/api/v1/evaluations'),
  findById: (id: string | number) => api.get(`/api/v1/evaluations/${id}`),
  create: (data: {
    punctuality: number;
    instrumental: number;
    organizationOfServiceUnit: number;
    biosecurity: number;
    ethics: number;
    concept: number;
    observations?: string;
    examId: number;
    studentId: string;
  }) => api.post('/api/v1/evaluations', data),
  update: (
    id: string | number,
    data: Partial<{
      punctuality: number;
      instrumental: number;
      organizationOfServiceUnit: number;
      biosecurity: number;
      ethics: number;
      concept: number;
      observations?: string;
    }>,
  ) => api.put(`/api/v1/evaluations/${id}`, data),
  delete: (id: string | number) => api.delete(`/api/v1/evaluations/${id}`),
};

// MOCK endpoints (not available in spec - to be implemented on backend)
// GET /api/v1/users - list all users
// Expected Request: GET /api/v1/users?role=ALUNO (optional filter)
// Expected Response:
// {
//   "success": true,
//   "code": 200,
//   "data": [
//     {
//       "id": "uuid",
//       "name": "string",
//       "email": "string",
//       "roles": [{ "id": 1, "name": "ALUNO" }],
//       "createdAt": "ISO timestamp"
//     }
//   ]
// }
export const userService = {
  findAll: (role?: string) => api.get('/api/v1/users', { params: role ? { role } : {} }),
  findById: (id: string) => api.get(`/api/v1/users/${id}`),
};

// GET /api/v1/dashboard/stats
// Expected Response:
// {
//   "success": true,
//   "code": 200,
//   "data": {
//     "totalStudents": 128,
//     "totalEvaluations": 342,
//     "evaluationsThisMonth": 18,
//     "studentsThisMonth": 12,
//     "pendingEvaluations": 5,
//     "todayExams": 8
//   }
// }
export const dashboardService = {
  getStats: () => api.get('/api/v1/dashboard/stats'),
  getRecentActivity: () => api.get('/api/v1/dashboard/activity'),
};

export default api;
