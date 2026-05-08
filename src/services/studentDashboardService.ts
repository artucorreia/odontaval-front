import { evaluationService, specialismService, userService } from './api';
import type { Evaluation, Specialism, User } from '../types';
import type {
  EnrichedEvaluation,
  StudentDashboardData,
  StudentOverviewStats,
  RadarDatum,
  ProgressDatum,
  SpecialtyDatum,
  ComparisonDatum,
  CriterionKey,
} from '../types/studentDashboard';
import { CRITERIA_LABELS } from '../types/studentDashboard';

function getCriterionValue(e: EnrichedEvaluation, key: CriterionKey): number {
  const map: Record<CriterionKey, number> = {
    punctuality: e.punctuality,
    instrumental: e.instrumental,
    boxOrganization: e.boxOrganization,
    biosecurity: e.biosecurity,
    ethics: e.ethics,
    concept: e.concept,
  };
  return map[key];
}

function enrichEvaluations(
  evaluations: Evaluation[],
  specialisms: Specialism[],
  professors: User[],
): EnrichedEvaluation[] {
  return evaluations.map((ev) => {
    const specialism = specialisms.find((s) => s.id === ev.specialismId);
    const professor = professors.find((p) => p.id === ev.professorId);
    return {
      id: ev.id,
      title: ev.title,
      date: ev.date,
      evaluationNumber: ev.evaluationNumber,
      academicSemester: ev.academicSemester,
      specialismName: specialism?.name ?? 'Especialidade',
      specialismId: ev.specialismId,
      professorName: professor?.name ?? '—',
      punctuality: ev.punctuality,
      instrumental: ev.instrumental,
      boxOrganization: ev.boxOrganization,
      biosecurity: ev.biosecurity,
      ethics: ev.ethics,
      concept: ev.concept,
      grade: ev.grade,
      observations: ev.observations,
      studentId: ev.studentId,
    };
  });
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function computeOverviewStats(evals: EnrichedEvaluation[]): StudentOverviewStats {
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

function computeRadarData(evals: EnrichedEvaluation[]): RadarDatum[] {
  if (evals.length === 0) return [];
  return (Object.keys(CRITERIA_LABELS) as CriterionKey[]).map((key) => ({
    subject: CRITERIA_LABELS[key],
    value: round1(10 + avg(evals.map((e) => getCriterionValue(e, key)))),
    fullMark: 10,
  }));
}

function computeProgressData(evals: EnrichedEvaluation[]): ProgressDatum[] {
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

function computeSpecialtyData(evals: EnrichedEvaluation[]): SpecialtyDatum[] {
  const bySpecialty: Record<string, number[]> = {};
  for (const e of evals) {
    if (!bySpecialty[e.specialismName]) bySpecialty[e.specialismName] = [];
    bySpecialty[e.specialismName].push(e.grade);
  }
  return Object.entries(bySpecialty)
    .map(([specialty, values]) => ({
      specialty,
      avg: round1(avg(values)),
      count: values.length,
    }))
    .sort((a, b) => b.avg - a.avg);
}

function computeClassComparison(
  studentEvals: EnrichedEvaluation[],
  allEvals: EnrichedEvaluation[],
  studentId: string,
): ComparisonDatum[] {
  if (studentEvals.length === 0) return [];
  const otherEvals = allEvals.filter((e) => e.studentId !== studentId);

  return (Object.keys(CRITERIA_LABELS) as CriterionKey[]).map((key) => ({
    criterion: key,
    label: CRITERIA_LABELS[key],
    student: round1(10 + avg(studentEvals.map((e) => getCriterionValue(e, key)))),
    turma: round1(
      10 +
        (otherEvals.length > 0
          ? avg(otherEvals.map((e) => getCriterionValue(e, key)))
          : avg(studentEvals.map((e) => getCriterionValue(e, key)))),
    ),
  }));
}

export async function fetchStudentDashboardData(studentId: string): Promise<StudentDashboardData> {
  // Fetch all required data in parallel.
  //
  // API GAP #1: No GET /api/v1/users/{id} endpoint.
  //   Workaround: fetch all students and professors separately, filter client-side.
  //   Fix: expose UserService.findById() in UserController (method already exists).
  //
  // API GAP #2: No GET /api/v1/evaluations?studentId= query param.
  //   Workaround: fetch all evaluations, filter client-side by studentId.
  //   Fix: add @RequestParam(required = false) String studentId to EvaluationController.findAll().
  const [evalsRes, specialismsRes, studentsRes, professorsRes] = await Promise.all([
    evaluationService.findAll(),
    specialismService.findAll(),
    userService.findAll('STUDENT'),   // GAP #1 workaround
    userService.findAll('PROFESSOR'), // needed for professor name enrichment
  ]);

  const allEvaluations: Evaluation[] = evalsRes.data?.data ?? [];
  const specialisms: Specialism[] = specialismsRes.data?.data ?? [];
  const students: User[] = studentsRes.data?.data ?? [];
  const professors: User[] = professorsRes.data?.data ?? [];

  // GAP #1 workaround: find the student by filtering the full list
  const student = students.find((u) => u.id === studentId) ?? null;

  // GAP #2 workaround: filter evaluations client-side
  const studentEvals = allEvaluations.filter((e) => e.studentId === studentId);

  const enrichedStudentEvals = enrichEvaluations(studentEvals, specialisms, professors);
  const enrichedAllEvals = enrichEvaluations(allEvaluations, specialisms, professors);

  return {
    student,
    enrichedEvals: enrichedStudentEvals,
    overviewStats: computeOverviewStats(enrichedStudentEvals),
    radarData: computeRadarData(enrichedStudentEvals),
    progressData: computeProgressData(enrichedStudentEvals),
    specialtyData: computeSpecialtyData(enrichedStudentEvals),
    comparisonData: computeClassComparison(enrichedStudentEvals, enrichedAllEvals, studentId),
    usedMock: false,
  };
}
