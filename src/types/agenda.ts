import type { Specialism, User } from './index';

export type ExamStatus = 'scheduled' | 'in_progress' | 'completed';

export interface AgendaExam {
  id: number;
  title: string;
  date: string;
  specialismId: number;
  specialism?: Specialism;
  professorId: string;
  professor?: User;
  academicSemester: string;
  goals: string;
  serviceUnit: string;
  procedurePerformed: string;
  evaluationCount?: number;
  status?: ExamStatus;
}

export type DateExamsMap = Record<string, AgendaExam[]>;
