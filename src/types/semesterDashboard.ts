export interface SemesterKPIs {
  totalEvaluations: number;
  totalStudents: number;
  totalProfessors: number;
  avgGrade: number;
}

export interface EvaluationsOverTimeDatum {
  period: string;
  count: number;
  avgGrade: number;
}

export interface SpecialtyPerformanceDatum {
  specialty: string;
  avgGrade: number;
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
  avgGrade: number;
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
  availableSemesters: string[];
}
