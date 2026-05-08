import api from './api';
import type { ApiResponse } from '../types';
import type { SemesterDashboardData } from '../types/semesterDashboard';

export async function fetchSemesterDashboard(semester?: string): Promise<SemesterDashboardData> {
  const res = await api.get<ApiResponse<SemesterDashboardData>>(
    '/api/v1/dashboard/semester',
    { params: semester ? { semester } : undefined },
  );
  return res.data.data;
}
