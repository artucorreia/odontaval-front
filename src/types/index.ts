export type RoleName = 'ADMIN' | 'PROFESSOR' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  createdAt?: string;
  deleted?: boolean;
}

export interface Role {
  id: number;
  name: RoleName;
}

export interface Specialism {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  deleted?: boolean;
  deletedAt?: string;
}

export interface Evaluation {
  id: number;
  title: string;
  punctuality: number;
  instrumental: number;
  boxOrganization: number;
  biosecurity: number;
  ethics: number;
  concept: number;
  grade: number;
  observations?: string;
  evaluationNumber: string;
  date: string;
  academicSemester: string;
  goals: string;
  box: string;
  procedurePerformed: string;
  professorId: string;
  professorName?: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  specialismId: number;
  specialismName?: string;
  deleted?: boolean;
  deletedAt?: string;
}

export interface CreateEvaluationRequest {
  title: string;
  punctuality: number;
  instrumental: number;
  boxOrganization: number;
  biosecurity: number;
  ethics: number;
  concept: number;
  grade: number;
  observations?: string;
  evaluationNumber: string;
  date: string;
  academicSemester: string;
  goals: string;
  box: string;
  procedurePerformed: string;
  studentId: string;
  specialismId: number;
}

export interface UpdateEvaluationRequest {
  title?: string;
  punctuality?: number;
  instrumental?: number;
  boxOrganization?: number;
  biosecurity?: number;
  ethics?: number;
  concept?: number;
  grade?: number;
  observations?: string;
  evaluationNumber?: string;
  date?: string;
  academicSemester?: string;
  goals?: string;
  box?: string;
  procedurePerformed?: string;
}

export interface AuthLoginResponse {
  success: boolean;
  code: number;
  data: {
    userId: string;
    userRole: RoleName;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  data: T;
}

export interface RecentEvaluation {
  id: number;
  title: string;
  evaluationNumber: string;
  grade: number;
  studentName?: string;
  specialismName?: string;
  academicSemester: string;
  date: string;
}

export interface AdminCreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: RoleName;
}

export interface UpdateRoleRequest {
  role: RoleName;
}

export interface DashboardStats {
  totalStudents: number;
  totalEvaluations: number;
  evaluationsThisMonth: number;
  recentEvaluations: RecentEvaluation[];
}
