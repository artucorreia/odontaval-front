import type { Exam } from './index';

export interface ExamOverviewStats {
  totalStudents: number;
  avgConcept: number;
  highestConcept: number;
  lowestConcept: number;
  approvalRate: number;
  approvalCutoff: number;
}

export interface HistogramDatum {
  range: string;
  count: number;
  pct: number;
  color: string;
}

export interface RankingDatum {
  rank: number;
  studentId: string;
  studentName: string;
  concept: number;
  approved: boolean;
}

export interface CriteriaDatum {
  criterion: string;
  label: string;
  avg: number;
}

export interface RadarComparisonDatum {
  subject: string;
  thisExam: number;
  semester: number;
  fullMark: number;
}

export interface ExamStudentRecord {
  evaluationId: number;
  studentId: string;
  studentName: string;
  concept: number;
  punctuality: number;
  instrumental: number;
  organizationOfServiceUnit: number;
  biosecurity: number;
  ethics: number;
  observations?: string;
}

export interface ExamDashboardData {
  exam: Exam | null;
  overviewStats: ExamOverviewStats;
  histogramData: HistogramDatum[];
  rankingData: RankingDatum[];
  criteriaData: CriteriaDatum[];
  radarData: RadarComparisonDatum[];
  studentsData: ExamStudentRecord[];
  usedMock: boolean;
}
