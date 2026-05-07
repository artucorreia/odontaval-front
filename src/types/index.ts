export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  createdAt?: string;
}

export interface Role {
  id: number;
  name: 'ADMIN' | 'PROFESSOR' | 'STUDENT';
}

export interface Specialism {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Exam {
  id: number;
  title: string;
  date: string;
  academicSemester: string;
  goals: string;
  serviceUnit: string;
  procedurePerformed: string;
  professorId: string;
  specialismId: number;
  specialism?: Specialism;
  professor?: User;
  createdAt?: string;
}

export interface Evaluation {
  id: number;
  punctuality: number;
  instrumental: number;
  organizationOfServiceUnit: number;
  biosecurity: number;
  ethics: number;
  concept: number;
  observations?: string;
  studentId: string;
  examId: number;
  student?: User;
  exam?: Exam;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  code: number;
  data: {
    userId: string;
    token: string;
    role: {
      id: number;
      name: string;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  code: number;
  data: T[];
  total?: number;
  page?: number;
  pageSize?: number;
}
