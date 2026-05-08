import type { User } from './index';

// Criteria keys match the Evaluation fields (penalty values: 0 to -10)
export type CriterionKey =
  | 'punctuality'
  | 'instrumental'
  | 'boxOrganization'
  | 'biosecurity'
  | 'ethics'
  | 'concept';

export const CRITERIA_LABELS: Record<CriterionKey, string> = {
  punctuality: 'Pontualidade',
  instrumental: 'Instrumental',
  boxOrganization: 'Organização do Box',
  biosecurity: 'Biossegurança',
  ethics: 'Ética',
  concept: 'Conceito',
};

// Evaluation enriched with resolved specialism/professor names
export interface EnrichedEvaluation {
  id: number;
  title: string;
  date: string;
  evaluationNumber: string;
  academicSemester: string;
  specialismName: string;
  specialismId: number;
  professorName: string;
  // criteria (0 to -10, penalties)
  punctuality: number;
  instrumental: number;
  boxOrganization: number;
  biosecurity: number;
  ethics: number;
  concept: number;
  // final grade (0 to 10)
  grade: number;
  observations?: string;
  studentId: string;
}

export interface StudentOverviewStats {
  avgGrade: number;
  totalEvaluations: number;
  bestCriterion: { label: string; value: number };
  worstCriterion: { label: string; value: number };
  trend: 'up' | 'stable' | 'down';
  trendDelta: number;
}

export interface RadarDatum {
  subject: string;
  // display value 0-10 (converted: 10 + penalty)
  value: number;
  fullMark: number;
}

export interface ProgressDatum {
  date: string;
  grade: number;
}

export interface SpecialtyDatum {
  specialty: string;
  avg: number;
  count: number;
}

export interface ComparisonDatum {
  criterion: string;
  label: string;
  student: number;
  turma: number;
}

export interface StudentDashboardData {
  student: User | null;
  enrichedEvals: EnrichedEvaluation[];
  overviewStats: StudentOverviewStats;
  radarData: RadarDatum[];
  progressData: ProgressDatum[];
  specialtyData: SpecialtyDatum[];
  comparisonData: ComparisonDatum[];
  usedMock: boolean;
}
