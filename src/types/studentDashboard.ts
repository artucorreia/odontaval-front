import type { User } from './index';

export type CriterionKey =
  | 'punctuality'
  | 'instrumental'
  | 'organizationOfServiceUnit'
  | 'biosecurity'
  | 'ethics';

export const CRITERIA_LABELS: Record<CriterionKey, string> = {
  punctuality: 'Pontualidade',
  instrumental: 'Instrumental',
  organizationOfServiceUnit: 'Organização',
  biosecurity: 'Biossegurança',
  ethics: 'Ética',
};

export interface EnrichedEvaluation {
  id: number;
  date: string;
  examTitle: string;
  specialismName: string;
  specialismId: number;
  professorName: string;
  concept: number;
  punctuality: number;
  instrumental: number;
  organizationOfServiceUnit: number;
  biosecurity: number;
  ethics: number;
  observations?: string;
  examId: number;
  studentId: string;
}

export interface StudentOverviewStats {
  avgConcept: number;
  totalEvaluations: number;
  bestCriterion: { label: string; value: number };
  worstCriterion: { label: string; value: number };
  trend: 'up' | 'stable' | 'down';
  trendDelta: number;
}

export interface RadarDatum {
  subject: string;
  value: number;
  fullMark: number;
}

export interface ProgressDatum {
  date: string;
  concept: number;
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
