import { evaluationService, examService, specialismService } from './api';
import type { Evaluation, Exam, User } from '../types';
import type {
  ExamDashboardData,
  ExamOverviewStats,
  HistogramDatum,
  RankingDatum,
  CriteriaDatum,
  RadarComparisonDatum,
  ExamStudentRecord,
} from '../types/examDashboard';
import { MOCK_STUDENTS, MOCK_EVALUATIONS, MOCK_EXAMS, MOCK_SPECIALISMS } from '../utils/mockData';
import {
  MOCK_EXAM1_EXTRA_EVALUATIONS,
  MOCK_EXAM2_EXTRA_EVALUATIONS,
  MOCK_EXAM3_EXTRA_EVALUATIONS,
} from '../utils/examDashboardMocks';
import {
  MOCK_STU001_EVALUATIONS,
  MOCK_CLASS_EVALUATIONS,
  MOCK_EXTENDED_EXAMS,
} from '../utils/studentDashboardMocks';

const APPROVAL_CUTOFF = 7.0;

type CriterionKey =
  | 'punctuality'
  | 'instrumental'
  | 'organizationOfServiceUnit'
  | 'biosecurity'
  | 'ethics';

const CRITERIA_LABELS: Record<CriterionKey, string> = {
  punctuality: 'Pontualidade',
  instrumental: 'Instrumental',
  organizationOfServiceUnit: 'Organização',
  biosecurity: 'Biossegurança',
  ethics: 'Ética',
};

const CRITERION_KEYS = Object.keys(CRITERIA_LABELS) as CriterionKey[];

function getCriterionValue(e: Evaluation, key: CriterionKey): number {
  const map: Record<CriterionKey, number> = {
    punctuality: e.punctuality,
    instrumental: e.instrumental,
    organizationOfServiceUnit: e.organizationOfServiceUnit,
    biosecurity: e.biosecurity,
    ethics: e.ethics,
  };
  return map[key];
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function resolveStudentName(studentId: string, students: User[]): string {
  return students.find((s) => s.id === studentId)?.name ?? studentId;
}

function computeOverviewStats(evals: Evaluation[]): ExamOverviewStats {
  if (evals.length === 0) {
    return { totalStudents: 0, avgConcept: 0, highestConcept: 0, lowestConcept: 0, approvalRate: 0, approvalCutoff: APPROVAL_CUTOFF };
  }
  const concepts = evals.map((e) => e.concept);
  const approved = evals.filter((e) => e.concept >= APPROVAL_CUTOFF).length;
  return {
    totalStudents: evals.length,
    avgConcept: round1(avg(concepts)),
    highestConcept: Math.max(...concepts),
    lowestConcept: Math.min(...concepts),
    approvalRate: round1((approved / evals.length) * 100),
    approvalCutoff: APPROVAL_CUTOFF,
  };
}

const HISTOGRAM_BUCKETS = [
  { range: '0 – 4', min: 0, max: 4, color: '#E17055' },
  { range: '4 – 6', min: 4, max: 6, color: '#FDCB6E' },
  { range: '6 – 8', min: 6, max: 8, color: '#74B9FF' },
  { range: '8 – 10', min: 8, max: 10.01, color: '#00B894' },
];

function computeHistogram(evals: Evaluation[]): HistogramDatum[] {
  return HISTOGRAM_BUCKETS.map((bucket) => {
    const count = evals.filter((e) => e.concept >= bucket.min && e.concept < bucket.max).length;
    return {
      range: bucket.range,
      count,
      pct: evals.length > 0 ? round1((count / evals.length) * 100) : 0,
      color: bucket.color,
    };
  });
}

function computeRanking(evals: Evaluation[], students: User[]): RankingDatum[] {
  return [...evals]
    .sort((a, b) => b.concept - a.concept)
    .map((e, index) => ({
      rank: index + 1,
      studentId: e.studentId,
      studentName: resolveStudentName(e.studentId, students),
      concept: e.concept,
      approved: e.concept >= APPROVAL_CUTOFF,
    }));
}

function computeCriteria(evals: Evaluation[]): CriteriaDatum[] {
  if (evals.length === 0) return [];
  return CRITERION_KEYS.map((key) => ({
    criterion: key,
    label: CRITERIA_LABELS[key],
    avg: round1(avg(evals.map((e) => getCriterionValue(e, key)))),
  }));
}

function computeRadarComparison(
  examEvals: Evaluation[],
  semesterEvals: Evaluation[],
): RadarComparisonDatum[] {
  if (examEvals.length === 0) return [];
  return CRITERION_KEYS.map((key) => ({
    subject: CRITERIA_LABELS[key],
    thisExam: round1(avg(examEvals.map((e) => getCriterionValue(e, key)))),
    semester: round1(avg(semesterEvals.map((e) => getCriterionValue(e, key)))),
    fullMark: 10,
  }));
}

function buildStudentsData(evals: Evaluation[], students: User[]): ExamStudentRecord[] {
  return [...evals]
    .sort((a, b) => b.concept - a.concept)
    .map((e) => ({
      evaluationId: e.id,
      studentId: e.studentId,
      studentName: resolveStudentName(e.studentId, students),
      concept: e.concept,
      punctuality: e.punctuality,
      instrumental: e.instrumental,
      organizationOfServiceUnit: e.organizationOfServiceUnit,
      biosecurity: e.biosecurity,
      ethics: e.ethics,
      observations: e.observations,
    }));
}

export async function fetchExamDashboardData(examId: number): Promise<ExamDashboardData> {
  let exam: Exam | null = null;
  let examEvals: Evaluation[] = [];
  let semesterEvals: Evaluation[] = [];
  let usedMock = false;
  const students: User[] = MOCK_STUDENTS;

  try {
    const [examRes, evalsRes, examsRes] = await Promise.all([
      examService.findById(examId),
      evaluationService.findAll(),
      examService.findAll(),
    ]);

    exam = examRes.data?.data ?? null;

    const allEvals: Evaluation[] = evalsRes.data?.data ?? [];
    const allExams: Exam[] = examsRes.data?.data ?? [];

    if (allEvals.length === 0) throw new Error('no data');

    examEvals = allEvals.filter((e) => e.examId === examId);

    const examSemester = exam?.academicSemester ?? '';
    const semesterExamIds = new Set(
      allExams.filter((x) => x.academicSemester === examSemester).map((x) => x.id),
    );
    semesterEvals = allEvals.filter((e) => semesterExamIds.has(e.examId));
  } catch {
    usedMock = true;

    const allMockEvals = [
      ...MOCK_EVALUATIONS,
      ...MOCK_EXAM1_EXTRA_EVALUATIONS,
      ...MOCK_EXAM2_EXTRA_EVALUATIONS,
      ...MOCK_EXAM3_EXTRA_EVALUATIONS,
      ...MOCK_STU001_EVALUATIONS,
      ...MOCK_CLASS_EVALUATIONS,
    ];
    const allMockExams = [...MOCK_EXAMS, ...MOCK_EXTENDED_EXAMS];

    exam = allMockExams.find((x) => x.id === examId) ?? null;

    examEvals = allMockEvals.filter((e) => e.examId === examId);

    const examSemester = exam?.academicSemester ?? '2025.1';
    const semesterExamIds = new Set(
      allMockExams
        .filter((x) => x.academicSemester === examSemester)
        .map((x) => x.id),
    );
    semesterEvals = allMockEvals.filter((e) => semesterExamIds.has(e.examId));

    if (exam && !exam.specialism) {
      exam = {
        ...exam,
        specialism: MOCK_SPECIALISMS.find((s) => s.id === exam!.specialismId),
      };
    }
  }

  return {
    exam,
    overviewStats: computeOverviewStats(examEvals),
    histogramData: computeHistogram(examEvals),
    rankingData: computeRanking(examEvals, students),
    criteriaData: computeCriteria(examEvals),
    radarData: computeRadarComparison(examEvals, semesterEvals),
    studentsData: buildStudentsData(examEvals, students),
    usedMock,
  };
}
