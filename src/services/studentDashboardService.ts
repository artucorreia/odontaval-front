import { evaluationService, examService, specialismService, userService } from './api';
import type { Evaluation, Exam, Specialism, User } from '../types';
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
import { MOCK_STUDENTS, MOCK_EVALUATIONS, MOCK_EXAMS, MOCK_SPECIALISMS, MOCK_PROFESSORS } from '../utils/mockData';
import {
  MOCK_EXTENDED_EXAMS,
  MOCK_STU001_EVALUATIONS,
  MOCK_CLASS_EVALUATIONS,
} from '../utils/studentDashboardMocks';

function getCriterionValue(e: EnrichedEvaluation, key: CriterionKey): number {
  const map: Record<CriterionKey, number> = {
    punctuality: e.punctuality,
    instrumental: e.instrumental,
    organizationOfServiceUnit: e.organizationOfServiceUnit,
    biosecurity: e.biosecurity,
    ethics: e.ethics,
  };
  return map[key];
}

function enrichEvaluations(
  evaluations: Evaluation[],
  exams: Exam[],
  specialisms: Specialism[],
  professors: User[],
): EnrichedEvaluation[] {
  return evaluations.map((ev) => {
    const exam = exams.find((e) => e.id === ev.examId) ?? ev.exam;
    const specialism =
      exam?.specialism ??
      (exam ? specialisms.find((s) => s.id === exam.specialismId) : undefined);
    const professor =
      exam?.professor ??
      (exam ? professors.find((p) => p.id === exam.professorId) : undefined);

    return {
      id: ev.id,
      date: exam?.date ?? '',
      examTitle: exam?.title ?? 'Avaliação Clínica',
      specialismName: specialism?.name ?? 'Especialidade',
      specialismId: exam?.specialismId ?? 0,
      professorName: professor?.name ?? 'Professor',
      concept: ev.concept,
      punctuality: ev.punctuality,
      instrumental: ev.instrumental,
      organizationOfServiceUnit: ev.organizationOfServiceUnit,
      biosecurity: ev.biosecurity,
      ethics: ev.ethics,
      observations: ev.observations,
      examId: ev.examId,
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
      avgConcept: 0,
      totalEvaluations: 0,
      bestCriterion: { label: '-', value: 0 },
      worstCriterion: { label: '-', value: 0 },
      trend: 'stable',
      trendDelta: 0,
    };
  }

  const avgConcept = round1(avg(evals.map((e) => e.concept)));

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
      const recentAvg = avg(sorted.slice(-half).map((e) => e.concept));
      const olderAvg = avg(sorted.slice(0, half).map((e) => e.concept));
      const delta = recentAvg - olderAvg;
      trendDelta = round1(Math.abs(delta));
      if (delta > 0.3) trend = 'up';
      else if (delta < -0.3) trend = 'down';
    }
  }

  return { avgConcept, totalEvaluations: evals.length, bestCriterion: best, worstCriterion: worst, trend, trendDelta };
}

function computeRadarData(evals: EnrichedEvaluation[]): RadarDatum[] {
  if (evals.length === 0) return [];
  return (Object.keys(CRITERIA_LABELS) as CriterionKey[]).map((key) => ({
    subject: CRITERIA_LABELS[key],
    value: round1(avg(evals.map((e) => getCriterionValue(e, key)))),
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
      concept: e.concept,
    }));
}

function computeSpecialtyData(evals: EnrichedEvaluation[]): SpecialtyDatum[] {
  const bySpecialty: Record<string, number[]> = {};
  for (const e of evals) {
    if (!bySpecialty[e.specialismName]) bySpecialty[e.specialismName] = [];
    bySpecialty[e.specialismName].push(e.concept);
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
    student: round1(avg(studentEvals.map((e) => getCriterionValue(e, key)))),
    turma: round1(
      otherEvals.length > 0
        ? avg(otherEvals.map((e) => getCriterionValue(e, key)))
        : avg(studentEvals.map((e) => getCriterionValue(e, key))),
    ),
  }));
}

export async function fetchStudentDashboardData(studentId: string): Promise<StudentDashboardData> {
  let student: User | null = null;
  let enrichedStudentEvals: EnrichedEvaluation[] = [];
  let enrichedAllEvals: EnrichedEvaluation[] = [];
  let usedMock = false;

  try {
    const [evalsRes, examsRes, specialismsRes] = await Promise.all([
      evaluationService.findAll(),
      examService.findAll(),
      specialismService.findAll(),
    ]);

    const evaluations: Evaluation[] = evalsRes.data?.data ?? [];
    const exams: Exam[] = examsRes.data?.data ?? [];
    const specialisms: Specialism[] = specialismsRes.data?.data ?? [];

    if (evaluations.length === 0) throw new Error('no data');

    enrichedStudentEvals = enrichEvaluations(
      evaluations.filter((e) => e.studentId === studentId),
      exams,
      specialisms,
      MOCK_PROFESSORS,
    );
    enrichedAllEvals = enrichEvaluations(evaluations, exams, specialisms, MOCK_PROFESSORS);

    try {
      const userRes = await userService.findById(studentId);
      student = userRes.data?.data ?? null;
    } catch {
      student = MOCK_STUDENTS.find((s) => s.id === studentId) ?? null;
    }
  } catch {
    usedMock = true;

    const allEvals = [...MOCK_EVALUATIONS, ...MOCK_STU001_EVALUATIONS, ...MOCK_CLASS_EVALUATIONS];
    const allExams = [...MOCK_EXAMS, ...MOCK_EXTENDED_EXAMS];

    enrichedStudentEvals = enrichEvaluations(
      allEvals.filter((e) => e.studentId === studentId),
      allExams,
      MOCK_SPECIALISMS,
      MOCK_PROFESSORS,
    );
    enrichedAllEvals = enrichEvaluations(allEvals, allExams, MOCK_SPECIALISMS, MOCK_PROFESSORS);
    student = MOCK_STUDENTS.find((s) => s.id === studentId) ?? MOCK_STUDENTS[0];
  }

  return {
    student,
    enrichedEvals: enrichedStudentEvals,
    overviewStats: computeOverviewStats(enrichedStudentEvals),
    radarData: computeRadarData(enrichedStudentEvals),
    progressData: computeProgressData(enrichedStudentEvals),
    specialtyData: computeSpecialtyData(enrichedStudentEvals),
    comparisonData: computeClassComparison(enrichedStudentEvals, enrichedAllEvals, studentId),
    usedMock,
  };
}
