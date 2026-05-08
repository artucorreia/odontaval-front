export type RoleName = 'ADMIN' | 'PROFESSOR' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  createdAt?: string;
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
  studentId: string;
  specialismId: number;
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

export type UpdateEvaluationRequest = CreateEvaluationRequest;

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
