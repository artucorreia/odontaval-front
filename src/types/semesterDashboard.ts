export interface SemesterKPIs {
  totalExams: number;
  totalEvaluations: number;
  totalStudents: number;
  totalProfessors: number;
  avgConcept: number;
  approvalRate: number;
}

export interface EvaluationsOverTimeDatum {
  period: string;
  count: number;
  avgConcept: number;
}

export interface SpecialtyPerformanceDatum {
  specialty: string;
  avgConcept: number;
  count: number;
}

export interface AverageTrendDatum {
  period: string;
  avg: number;
}

export interface ConceptDistributionDatum {
  name: string;
  value: number;
  pct: number;
  color: string;
  minScore: number;
  maxScore: number;
}

export interface CriteriaComparisonDatum {
  label: string;
  avg: number;
  isBest: boolean;
  isWorst: boolean;
}

export interface HeatmapCell {
  week: number;
  dayOfWeek: number;
  count: number;
}

export interface TopStudentDatum {
  studentId: string;
  studentName: string;
  avgConcept: number;
  totalEvaluations: number;
}

export interface SemesterDashboardData {
  semester: string;
  kpis: SemesterKPIs;
  evaluationsOverTime: EvaluationsOverTimeDatum[];
  specialtyPerformance: SpecialtyPerformanceDatum[];
  averageTrend: AverageTrendDatum[];
  conceptDistribution: ConceptDistributionDatum[];
  criteriaComparison: CriteriaComparisonDatum[];
  heatmap: HeatmapCell[];
  topStudents: TopStudentDatum[];
  usedMock: boolean;
}
