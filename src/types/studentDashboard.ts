import type { Evaluation } from './index';

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

// Extends Evaluation, guaranteeing professor/specialism names are always resolved strings.
export interface EnrichedEvaluation extends Evaluation {
  professorName: string;
  specialismName: string;
}

export interface StudentOverviewStats {
  avgGrade: number;
  totalEvaluations: number;
  bestCriterion: { label: string; value: number };
  worstCriterion: { label: string; value: number };
  trend: 'up' | 'stable' | 'down';
  trendDelta: number;
}

export interface PeriodStats {
  period: 'AV1' | 'AV2' | 'AV3';
  count: number;
  avgGrade: number;
  min: number;
  max: number;
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

export interface ClassAverages {
  punctuality: number;
  instrumental: number;
  boxOrganization: number;
  biosecurity: number;
  ethics: number;
  concept: number;
}

export interface StudentDashboardData {
  student: import('./index').User | null;
  enrichedEvals: EnrichedEvaluation[];
  classAverages: ClassAverages;
  overviewStats: StudentOverviewStats;
  radarData: RadarDatum[];
  progressData: ProgressDatum[];
  specialtyData: SpecialtyDatum[];
  comparisonData: ComparisonDatum[];
  periodStats: PeriodStats[];
  availableSemesters: string[];
}
