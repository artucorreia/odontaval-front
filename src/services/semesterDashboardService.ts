import { evaluationService, specialismService } from './api';
import type { Evaluation, Specialism } from '../types';
import type {
  SemesterDashboardData,
  SemesterKPIs,
  EvaluationsOverTimeDatum,
  SpecialtyPerformanceDatum,
  AverageTrendDatum,
  ConceptDistributionDatum,
  CriteriaComparisonDatum,
  HeatmapCell,
  TopStudentDatum,
} from '../types/semesterDashboard';
import { MOCK_STUDENTS, MOCK_EVALUATIONS, MOCK_SPECIALISMS } from '../utils/mockData';
import { MOCK_STU001_EVALUATIONS, MOCK_CLASS_EVALUATIONS } from '../utils/studentDashboardMocks';
import { MOCK_SEMESTER_EXTRA_EVALUATIONS } from '../utils/semesterDashboardMocks';

type CriterionKey = 'punctuality' | 'instrumental' | 'boxOrganization' | 'biosecurity' | 'ethics' | 'concept';

const CRITERIA_LABELS: Record<CriterionKey, string> = {
  punctuality: 'Pontualidade',
  instrumental: 'Instrumental',
  boxOrganization: 'Organização do Box',
  biosecurity: 'Biossegurança',
  ethics: 'Ética',
  concept: 'Conceito',
};

const MONTH_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function getCriterionValue(e: Evaluation, key: CriterionKey): number {
  const m: Record<CriterionKey, number> = {
    punctuality: e.punctuality,
    instrumental: e.instrumental,
    boxOrganization: e.boxOrganization,
    biosecurity: e.biosecurity,
    ethics: e.ethics,
    concept: e.concept,
  };
  return m[key];
}

function computeKPIs(evals: Evaluation[]): SemesterKPIs {
  const students = new Set(evals.map((e) => e.studentId));
  const grades = evals.map((e) => e.grade);
  const approved = evals.filter((e) => e.grade >= 7).length;
  return {
    totalEvaluations: evals.length,
    totalStudents: students.size,
    totalProfessors: new Set(evals.map((e) => e.professorId)).size,
    avgConcept: round1(avg(grades)),
    approvalRate: evals.length > 0 ? round1((approved / evals.length) * 100) : 0,
  };
}

function computeEvaluationsOverTime(evals: Evaluation[]): EvaluationsOverTimeDatum[] {
  const byMonth: Record<string, { count: number; sumGrade: number }> = {};
  for (const e of evals) {
    if (!e.date) continue;
    const d = new Date(e.date + 'T12:00:00');
    const key = MONTH_PT[d.getMonth()];
    if (!byMonth[key]) byMonth[key] = { count: 0, sumGrade: 0 };
    byMonth[key].count++;
    byMonth[key].sumGrade += e.grade;
  }
  return MONTH_PT.filter((m) => byMonth[m]).map((m) => ({
    period: m.charAt(0).toUpperCase() + m.slice(1),
    count: byMonth[m].count,
    avgConcept: round1(byMonth[m].sumGrade / byMonth[m].count),
  }));
}

function computeSpecialtyPerformance(evals: Evaluation[], specialisms: Specialism[]): SpecialtyPerformanceDatum[] {
  const bySpecialty: Record<string, number[]> = {};
  for (const e of evals) {
    const sp = specialisms.find((s) => s.id === e.specialismId);
    const key = sp?.name ?? 'Outra';
    if (!bySpecialty[key]) bySpecialty[key] = [];
    bySpecialty[key].push(e.grade);
  }
  return Object.entries(bySpecialty)
    .map(([specialty, values]) => ({ specialty, avgConcept: round1(avg(values)), count: values.length }))
    .sort((a, b) => b.avgConcept - a.avgConcept);
}

function computeAverageTrend(evals: Evaluation[]): AverageTrendDatum[] {
  const byMonth: Record<string, number[]> = {};
  for (const e of evals) {
    if (!e.date) continue;
    const d = new Date(e.date + 'T12:00:00');
    const key = MONTH_PT[d.getMonth()];
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(e.grade);
  }
  return MONTH_PT.filter((m) => byMonth[m]).map((m) => ({
    period: m.charAt(0).toUpperCase() + m.slice(1),
    avg: round1(avg(byMonth[m])),
  }));
}

const CONCEPT_BUCKETS: ConceptDistributionDatum[] = [
  { name: 'Excelente', minScore: 9, maxScore: 10, value: 0, pct: 0, color: '#00B894' },
  { name: 'Bom', minScore: 7, maxScore: 9, value: 0, pct: 0, color: '#6C5CE7' },
  { name: 'Regular', minScore: 5, maxScore: 7, value: 0, pct: 0, color: '#FDCB6E' },
  { name: 'Insuficiente', minScore: 0, maxScore: 5, value: 0, pct: 0, color: '#E17055' },
];

function computeConceptDistribution(evals: Evaluation[]): ConceptDistributionDatum[] {
  const buckets = CONCEPT_BUCKETS.map((b) => ({ ...b, value: 0, pct: 0 }));
  for (const e of evals) {
    const bucket = buckets.find((b) => e.grade >= b.minScore && e.grade < b.maxScore);
    if (bucket) bucket.value++;
  }
  const total = evals.length || 1;
  return buckets.map((b) => ({ ...b, pct: round1((b.value / total) * 100) }));
}

function computeCriteriaComparison(evals: Evaluation[]): CriteriaComparisonDatum[] {
  if (evals.length === 0) return [];
  // Convert penalty to performance (0-10) for chart display
  const avgs = (Object.keys(CRITERIA_LABELS) as CriterionKey[]).map((key) => ({
    label: CRITERIA_LABELS[key],
    avg: round1(10 + avg(evals.map((e) => getCriterionValue(e, key)))),
  }));
  const maxAvg = Math.max(...avgs.map((a) => a.avg));
  const minAvg = Math.min(...avgs.map((a) => a.avg));
  return avgs.map((a) => ({ ...a, isBest: a.avg === maxAvg, isWorst: a.avg === minAvg }));
}

function computeHeatmap(evals: Evaluation[]): HeatmapCell[] {
  const datesWithData = evals
    .filter((e) => e.date)
    .map((e) => new Date(e.date + 'T12:00:00'));

  if (datesWithData.length === 0) return [];

  const firstDate = datesWithData.reduce((a, b) => (a < b ? a : b));
  const dayOfFirst = firstDate.getDay();
  const semStart = new Date(firstDate);
  semStart.setDate(firstDate.getDate() - (dayOfFirst === 0 ? 6 : dayOfFirst - 1));

  const cells: Record<string, number> = {};

  for (const e of evals) {
    if (!e.date) continue;
    const date = new Date(e.date + 'T12:00:00');
    const dow = date.getDay();
    const mappedDow = dow === 6 ? 4 : dow === 0 ? 0 : dow - 1;
    const diffDays = Math.floor((date.getTime() - semStart.getTime()) / 86400000);
    const week = Math.max(1, Math.floor(diffDays / 7) + 1);
    const key = `${week}-${mappedDow}`;
    cells[key] = (cells[key] ?? 0) + 1;
  }

  return Object.entries(cells).map(([key, count]) => {
    const [week, dayOfWeek] = key.split('-').map(Number);
    return { week, dayOfWeek, count };
  });
}

function computeTopStudents(evals: Evaluation[]): TopStudentDatum[] {
  const byStudent: Record<string, number[]> = {};
  for (const e of evals) {
    if (!byStudent[e.studentId]) byStudent[e.studentId] = [];
    byStudent[e.studentId].push(e.grade);
  }
  return Object.entries(byStudent)
    .map(([studentId, grades]) => ({
      studentId,
      studentName: MOCK_STUDENTS.find((s) => s.id === studentId)?.name ?? studentId,
      avgConcept: round1(avg(grades)),
      totalEvaluations: grades.length,
    }))
    .sort((a, b) => b.avgConcept - a.avgConcept)
    .slice(0, 8);
}

const ALL_MOCK_EVALS: Evaluation[] = [
  ...MOCK_EVALUATIONS,
  ...MOCK_STU001_EVALUATIONS,
  ...MOCK_CLASS_EVALUATIONS,
  ...MOCK_SEMESTER_EXTRA_EVALUATIONS,
];

export async function fetchSemesterDashboardData(semester: string): Promise<SemesterDashboardData> {
  let semesterEvals: Evaluation[] = [];
  let allSpecialisms: Specialism[] = [];
  let usedMock = false;

  try {
    const [evalsRes, spRes] = await Promise.all([
      evaluationService.findAll(),
      specialismService.findAll(),
    ]);
    const allEvals: Evaluation[] = evalsRes.data?.data ?? [];
    allSpecialisms = spRes.data?.data ?? [];

    if (allEvals.length === 0) throw new Error('no data');

    semesterEvals = allEvals.filter((e) => e.academicSemester === semester);
  } catch {
    usedMock = true;
    allSpecialisms = MOCK_SPECIALISMS;
    semesterEvals = ALL_MOCK_EVALS.filter((e) => e.academicSemester === semester);
  }

  return {
    semester,
    kpis: computeKPIs(semesterEvals),
    evaluationsOverTime: computeEvaluationsOverTime(semesterEvals),
    specialtyPerformance: computeSpecialtyPerformance(semesterEvals, allSpecialisms),
    averageTrend: computeAverageTrend(semesterEvals),
    conceptDistribution: computeConceptDistribution(semesterEvals),
    criteriaComparison: computeCriteriaComparison(semesterEvals),
    heatmap: computeHeatmap(semesterEvals),
    topStudents: computeTopStudents(semesterEvals),
    usedMock,
  };
}

export const AVAILABLE_SEMESTERS = ['2026.1', '2026.2', '2025.2', '2025.1'];
