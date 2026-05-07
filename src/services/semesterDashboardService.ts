import { evaluationService, examService, specialismService } from './api';
import type { Evaluation, Exam, Specialism } from '../types';
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
import { MOCK_STUDENTS, MOCK_EVALUATIONS, MOCK_EXAMS, MOCK_SPECIALISMS, MOCK_PROFESSORS } from '../utils/mockData';
import { MOCK_EXTENDED_EXAMS, MOCK_STU001_EVALUATIONS, MOCK_CLASS_EVALUATIONS } from '../utils/studentDashboardMocks';
import { MOCK_EXAM1_EXTRA_EVALUATIONS, MOCK_EXAM2_EXTRA_EVALUATIONS, MOCK_EXAM3_EXTRA_EVALUATIONS } from '../utils/examDashboardMocks';
import { MOCK_SEMESTER_EXTRA_EVALUATIONS } from '../utils/semesterDashboardMocks';

type CriterionKey = 'punctuality' | 'instrumental' | 'organizationOfServiceUnit' | 'biosecurity' | 'ethics';

const CRITERIA_LABELS: Record<CriterionKey, string> = {
  punctuality: 'Pontualidade',
  instrumental: 'Instrumental',
  organizationOfServiceUnit: 'Organização',
  biosecurity: 'Biossegurança',
  ethics: 'Ética',
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
    punctuality: e.punctuality, instrumental: e.instrumental,
    organizationOfServiceUnit: e.organizationOfServiceUnit, biosecurity: e.biosecurity, ethics: e.ethics,
  };
  return m[key];
}

function computeKPIs(evals: Evaluation[], exams: Exam[]): SemesterKPIs {
  const students = new Set(evals.map((e) => e.studentId));
  const concepts = evals.map((e) => e.concept);
  const approved = evals.filter((e) => e.concept >= 7).length;
  return {
    totalExams: exams.length,
    totalEvaluations: evals.length,
    totalStudents: students.size,
    totalProfessors: MOCK_PROFESSORS.length,
    avgConcept: round1(avg(concepts)),
    approvalRate: evals.length > 0 ? round1((approved / evals.length) * 100) : 0,
  };
}

function computeEvaluationsOverTime(evals: Evaluation[], allExams: Exam[]): EvaluationsOverTimeDatum[] {
  const byMonth: Record<string, { count: number; sumConcept: number }> = {};
  for (const e of evals) {
    const exam = allExams.find((x) => x.id === e.examId);
    if (!exam?.date) continue;
    const d = new Date(exam.date + 'T12:00:00');
    const key = MONTH_PT[d.getMonth()];
    if (!byMonth[key]) byMonth[key] = { count: 0, sumConcept: 0 };
    byMonth[key].count++;
    byMonth[key].sumConcept += e.concept;
  }
  return MONTH_PT.filter((m) => byMonth[m]).map((m) => ({
    period: m.charAt(0).toUpperCase() + m.slice(1),
    count: byMonth[m].count,
    avgConcept: round1(byMonth[m].sumConcept / byMonth[m].count),
  }));
}

function computeSpecialtyPerformance(evals: Evaluation[], allExams: Exam[], specialisms: Specialism[]): SpecialtyPerformanceDatum[] {
  const bySpecialty: Record<string, number[]> = {};
  for (const e of evals) {
    const exam = allExams.find((x) => x.id === e.examId);
    const sp = specialisms.find((s) => s.id === exam?.specialismId);
    const key = sp?.name ?? 'Outra';
    if (!bySpecialty[key]) bySpecialty[key] = [];
    bySpecialty[key].push(e.concept);
  }
  return Object.entries(bySpecialty)
    .map(([specialty, values]) => ({ specialty, avgConcept: round1(avg(values)), count: values.length }))
    .sort((a, b) => b.avgConcept - a.avgConcept);
}

function computeAverageTrend(evals: Evaluation[], allExams: Exam[]): AverageTrendDatum[] {
  const byMonth: Record<string, number[]> = {};
  for (const e of evals) {
    const exam = allExams.find((x) => x.id === e.examId);
    if (!exam?.date) continue;
    const d = new Date(exam.date + 'T12:00:00');
    const key = MONTH_PT[d.getMonth()];
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(e.concept);
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
    const bucket = buckets.find((b) => e.concept >= b.minScore && e.concept < b.maxScore);
    if (bucket) bucket.value++;
  }
  const total = evals.length || 1;
  return buckets.map((b) => ({ ...b, pct: round1((b.value / total) * 100) }));
}

function computeCriteriaComparison(evals: Evaluation[]): CriteriaComparisonDatum[] {
  if (evals.length === 0) return [];
  const avgs = (Object.keys(CRITERIA_LABELS) as CriterionKey[]).map((key) => ({
    label: CRITERIA_LABELS[key],
    avg: round1(avg(evals.map((e) => getCriterionValue(e, key)))),
  }));
  const maxAvg = Math.max(...avgs.map((a) => a.avg));
  const minAvg = Math.min(...avgs.map((a) => a.avg));
  return avgs.map((a) => ({ ...a, isBest: a.avg === maxAvg, isWorst: a.avg === minAvg }));
}

function computeHeatmap(evals: Evaluation[], allExams: Exam[]): HeatmapCell[] {
  const examDates: Record<number, Date> = {};
  for (const exam of allExams) {
    if (exam.date) examDates[exam.id] = new Date(exam.date + 'T12:00:00');
  }

  const semesterDates = Object.values(examDates).filter(Boolean);
  if (semesterDates.length === 0) return [];

  const firstDate = semesterDates.reduce((a, b) => (a < b ? a : b));
  // Snap to previous Monday
  const dayOfFirst = firstDate.getDay();
  const semStart = new Date(firstDate);
  semStart.setDate(firstDate.getDate() - (dayOfFirst === 0 ? 6 : dayOfFirst - 1));

  const cells: Record<string, number> = {};

  for (const e of evals) {
    const date = examDates[e.examId];
    if (!date) continue;
    const dow = date.getDay(); // 0=Sun
    const mappedDow = dow === 6 ? 4 : dow === 0 ? 0 : dow - 1; // Sat→Fri, Sun→Mon, else Mon-Fri = 0-4
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
    byStudent[e.studentId].push(e.concept);
  }
  return Object.entries(byStudent)
    .map(([studentId, concepts]) => ({
      studentId,
      studentName: MOCK_STUDENTS.find((s) => s.id === studentId)?.name ?? studentId,
      avgConcept: round1(avg(concepts)),
      totalEvaluations: concepts.length,
    }))
    .sort((a, b) => b.avgConcept - a.avgConcept)
    .slice(0, 8);
}

const ALL_MOCK_EVALS: Evaluation[] = [
  ...MOCK_EVALUATIONS,
  ...MOCK_STU001_EVALUATIONS,
  ...MOCK_CLASS_EVALUATIONS,
  ...MOCK_EXAM1_EXTRA_EVALUATIONS,
  ...MOCK_EXAM2_EXTRA_EVALUATIONS,
  ...MOCK_EXAM3_EXTRA_EVALUATIONS,
  ...MOCK_SEMESTER_EXTRA_EVALUATIONS,
];
const ALL_MOCK_EXAMS: Exam[] = [...MOCK_EXAMS, ...MOCK_EXTENDED_EXAMS];

export async function fetchSemesterDashboardData(semester: string): Promise<SemesterDashboardData> {
  let semesterEvals: Evaluation[] = [];
  let semesterExams: Exam[] = [];
  let allSpecialisms: Specialism[] = [];
  let usedMock = false;

  try {
    const [evalsRes, examsRes, spRes] = await Promise.all([
      evaluationService.findAll(),
      examService.findAll(),
      specialismService.findAll(),
    ]);
    const allEvals: Evaluation[] = evalsRes.data?.data ?? [];
    const allExams: Exam[] = examsRes.data?.data ?? [];
    allSpecialisms = spRes.data?.data ?? [];

    if (allEvals.length === 0) throw new Error('no data');

    semesterExams = allExams.filter((x) => x.academicSemester === semester);
    const semExamIds = new Set(semesterExams.map((x) => x.id));
    semesterEvals = allEvals.filter((e) => semExamIds.has(e.examId));
  } catch {
    usedMock = true;
    allSpecialisms = MOCK_SPECIALISMS;
    semesterExams = ALL_MOCK_EXAMS.filter((x) => x.academicSemester === semester);
    const semExamIds = new Set(semesterExams.map((x) => x.id));
    semesterEvals = ALL_MOCK_EVALS.filter((e) => semExamIds.has(e.examId));
  }

  return {
    semester,
    kpis: computeKPIs(semesterEvals, semesterExams),
    evaluationsOverTime: computeEvaluationsOverTime(semesterEvals, ALL_MOCK_EXAMS),
    specialtyPerformance: computeSpecialtyPerformance(semesterEvals, ALL_MOCK_EXAMS, allSpecialisms),
    averageTrend: computeAverageTrend(semesterEvals, ALL_MOCK_EXAMS),
    conceptDistribution: computeConceptDistribution(semesterEvals),
    criteriaComparison: computeCriteriaComparison(semesterEvals),
    heatmap: computeHeatmap(semesterEvals, ALL_MOCK_EXAMS),
    topStudents: computeTopStudents(semesterEvals),
    usedMock,
  };
}

export const AVAILABLE_SEMESTERS = ['2025.1', '2025.2', '2024.2', '2024.1'];
