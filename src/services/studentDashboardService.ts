import { evaluationService, userService, dashboardService } from './api';
import type { Evaluation } from '../types';
import type {
  EnrichedEvaluation,
  StudentDashboardData,
  StudentOverviewStats,
  RadarDatum,
  ProgressDatum,
  SpecialtyDatum,
  ComparisonDatum,
  PeriodStats,
  CriterionKey,
  ClassAverages,
} from '../types/studentDashboard';
import { CRITERIA_LABELS } from '../types/studentDashboard';

// ─── helpers ─────────────────────────────────────────────────────────────────

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function getCriterionValue(e: EnrichedEvaluation, key: CriterionKey): number {
  return e[key] as number;
}

// Converts a raw API Evaluation to EnrichedEvaluation, guaranteeing name fields are strings.
// The API already returns professorName/specialismName (backend enrichment via @Transactional mapper).
function toEnriched(ev: Evaluation): EnrichedEvaluation {
  return {
    ...ev,
    professorName: ev.professorName ?? '—',
    specialismName: ev.specialismName ?? 'Especialidade',
  };
}

// ─── computation functions (exported for semester-filter re-use in page) ─────

export function computeOverviewStats(evals: EnrichedEvaluation[]): StudentOverviewStats {
  if (evals.length === 0) {
    return {
      avgGrade: 0,
      totalEvaluations: 0,
      bestCriterion: { label: '-', value: 0 },
      worstCriterion: { label: '-', value: 0 },
      trend: 'stable',
      trendDelta: 0,
    };
  }

  const avgGrade = round1(avg(evals.map((e) => e.grade)));

  const criteriaAvgs = (Object.keys(CRITERIA_LABELS) as CriterionKey[]).map((key) => ({
    label: CRITERIA_LABELS[key],
    value: round1(avg(evals.map((e) => getCriterionValue(e, key)))),
  }));

  // criteria values are penalties (0 to -10); best = closest to 0, worst = most negative
  const best = criteriaAvgs.reduce((a, b) => (a.value >= b.value ? a : b));
  const worst = criteriaAvgs.reduce((a, b) => (a.value <= b.value ? a : b));

  let trend: 'up' | 'stable' | 'down' = 'stable';
  let trendDelta = 0;

  if (evals.length >= 4) {
    const sorted = [...evals]
      .filter((e) => e.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (sorted.length >= 4) {
      const half = Math.floor(sorted.length / 2);
      const recentAvg = avg(sorted.slice(-half).map((e) => e.grade));
      const olderAvg = avg(sorted.slice(0, half).map((e) => e.grade));
      const delta = recentAvg - olderAvg;
      trendDelta = round1(Math.abs(delta));
      if (delta > 0.3) trend = 'up';
      else if (delta < -0.3) trend = 'down';
    }
  }

  return { avgGrade, totalEvaluations: evals.length, bestCriterion: best, worstCriterion: worst, trend, trendDelta };
}

export function computeRadarData(evals: EnrichedEvaluation[]): RadarDatum[] {
  if (evals.length === 0) return [];
  return (Object.keys(CRITERIA_LABELS) as CriterionKey[]).map((key) => ({
    subject: CRITERIA_LABELS[key],
    value: round1(10 + avg(evals.map((e) => getCriterionValue(e, key)))),
    fullMark: 10,
  }));
}

export function computeProgressData(evals: EnrichedEvaluation[]): ProgressDatum[] {
  return [...evals]
    .filter((e) => e.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({
      date: new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      }),
      grade: e.grade,
    }));
}

export function computeSpecialtyData(evals: EnrichedEvaluation[]): SpecialtyDatum[] {
  const bySpecialty: Record<string, number[]> = {};
  for (const e of evals) {
    if (!bySpecialty[e.specialismName]) bySpecialty[e.specialismName] = [];
    bySpecialty[e.specialismName].push(e.grade);
  }
  return Object.entries(bySpecialty)
    .map(([specialty, values]) => ({ specialty, avg: round1(avg(values)), count: values.length }))
    .sort((a, b) => b.avg - a.avg);
}

export function computeClassComparison(
  studentEvals: EnrichedEvaluation[],
  classAverages: ClassAverages,
): ComparisonDatum[] {
  if (studentEvals.length === 0) return [];
  return (Object.keys(CRITERIA_LABELS) as CriterionKey[]).map((key) => ({
    criterion: key,
    label: CRITERIA_LABELS[key],
    student: round1(10 + avg(studentEvals.map((e) => getCriterionValue(e, key)))),
    turma: round1(10 + (classAverages[key] as number)),
  }));
}

export function computePeriodStats(evals: EnrichedEvaluation[]): PeriodStats[] {
  const PERIODS: Array<'AV1' | 'AV2' | 'AV3'> = ['AV1', 'AV2', 'AV3'];
  return PERIODS.flatMap((period) => {
    const periodEvals = evals.filter((e) => e.evaluationNumber === period);
    if (periodEvals.length === 0) return [];
    const grades = periodEvals.map((e) => e.grade);
    return [{
      period,
      count: periodEvals.length,
      avgGrade: round1(avg(grades)),
      min: Math.min(...grades),
      max: Math.max(...grades),
    }];
  });
}

// ─── main fetch function ──────────────────────────────────────────────────────

export async function fetchStudentDashboardData(studentId: string): Promise<StudentDashboardData> {
  const [studentEvalsRes, classAvgsRes, studentRes] = await Promise.all([
    evaluationService.findAll(studentId),
    dashboardService.getClassAverages(studentId),
    userService.findById(studentId),
  ]);

  const studentEvaluations: Evaluation[] = studentEvalsRes.data?.data ?? [];
  const classAverages: ClassAverages = classAvgsRes.data?.data ?? {
    punctuality: 0, instrumental: 0, boxOrganization: 0,
    biosecurity: 0, ethics: 0, concept: 0,
  };
  const student = studentRes.data?.data ?? null;

  const enrichedStudentEvals = studentEvaluations.map(toEnriched);

  const availableSemesters = [...new Set(enrichedStudentEvals.map((e) => e.academicSemester))]
    .filter(Boolean)
    .sort()
    .reverse();

  return {
    student,
    enrichedEvals: enrichedStudentEvals,
    classAverages,
    overviewStats: computeOverviewStats(enrichedStudentEvals),
    radarData: computeRadarData(enrichedStudentEvals),
    progressData: computeProgressData(enrichedStudentEvals),
    specialtyData: computeSpecialtyData(enrichedStudentEvals),
    comparisonData: computeClassComparison(enrichedStudentEvals, classAverages),
    periodStats: computePeriodStats(enrichedStudentEvals),
    availableSemesters,
  };
}
