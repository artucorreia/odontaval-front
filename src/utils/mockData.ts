import type { Evaluation, Exam, Specialism, User } from '../types';

export const MOCK_SPECIALISMS: Specialism[] = [
  { id: 1, name: 'Dentística', description: 'Estética e restauração dental' },
  { id: 2, name: 'Ortodontia', description: 'Correção de má oclusão' },
  { id: 3, name: 'Endodontia', description: 'Tratamento de canal' },
  { id: 4, name: 'Periodontia', description: 'Tratamento gengival' },
  { id: 5, name: 'Cirurgia Oral', description: 'Procedimentos cirúrgicos' },
  { id: 6, name: 'Prótese Dentária', description: 'Reabilitação oral' },
];

export const MOCK_STUDENTS: User[] = [
  {
    id: 'stu-001',
    name: 'Maria Souza',
    email: 'maria.souza@aluno.edu',
    roles: [{ id: 3, name: 'ALUNO' }],
  },
  {
    id: 'stu-002',
    name: 'João Pedro',
    email: 'joao.pedro@aluno.edu',
    roles: [{ id: 3, name: 'ALUNO' }],
  },
  {
    id: 'stu-003',
    name: 'Ana Clara da Silva',
    email: 'ana.clara@aluno.edu',
    roles: [{ id: 3, name: 'ALUNO' }],
  },
  {
    id: 'stu-004',
    name: 'Carlos Henrique',
    email: 'carlos.h@aluno.edu',
    roles: [{ id: 3, name: 'ALUNO' }],
  },
  {
    id: 'stu-005',
    name: 'Juliana Oliveira',
    email: 'juliana.o@aluno.edu',
    roles: [{ id: 3, name: 'ALUNO' }],
  },
  {
    id: 'stu-006',
    name: 'Marcos Vinicius',
    email: 'marcos.v@aluno.edu',
    roles: [{ id: 3, name: 'ALUNO' }],
  },
  {
    id: 'stu-007',
    name: 'Fernanda Lima',
    email: 'fernanda.l@aluno.edu',
    roles: [{ id: 3, name: 'ALUNO' }],
  },
  {
    id: 'stu-008',
    name: 'Rafael Costa',
    email: 'rafael.c@aluno.edu',
    roles: [{ id: 3, name: 'ALUNO' }],
  },
];

export const MOCK_PROFESSORS: User[] = [
  {
    id: 'prof-001',
    name: 'Dr. João Silva',
    email: 'joao.silva@odontaval.com',
    roles: [{ id: 2, name: 'PROFESSOR' }],
  },
  {
    id: 'prof-002',
    name: 'Dra. Mariana Costa',
    email: 'mariana.costa@odontaval.com',
    roles: [{ id: 2, name: 'PROFESSOR' }],
  },
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 1,
    title: 'Avaliação Clínica - Dentística',
    date: '2025-05-20',
    academicSemester: '2025.1',
    goals: 'Avaliar restauração composta classe II',
    serviceUnit: 'Box 01',
    procedurePerformed: 'Restauração composta',
    professorId: 'prof-001',
    specialismId: 1,
    specialism: MOCK_SPECIALISMS[0],
    professor: MOCK_PROFESSORS[0],
  },
  {
    id: 2,
    title: 'Avaliação Clínica - Endodontia',
    date: '2025-05-18',
    academicSemester: '2025.1',
    goals: 'Avaliar tratamento de canal',
    serviceUnit: 'Box 03',
    procedurePerformed: 'Tratamento de canal',
    professorId: 'prof-002',
    specialismId: 3,
    specialism: MOCK_SPECIALISMS[2],
    professor: MOCK_PROFESSORS[1],
  },
  {
    id: 3,
    title: 'Avaliação Inicial - Ortodontia',
    date: '2025-05-15',
    academicSemester: '2025.1',
    goals: 'Avaliação diagnóstica inicial',
    serviceUnit: 'Box 02',
    procedurePerformed: 'Diagnóstico ortodôntico',
    professorId: 'prof-001',
    specialismId: 2,
    specialism: MOCK_SPECIALISMS[1],
    professor: MOCK_PROFESSORS[0],
  },
];

export const MOCK_EVALUATIONS: Evaluation[] = [
  {
    id: 1,
    punctuality: 9,
    instrumental: 8.5,
    organizationOfServiceUnit: 9,
    biosecurity: 10,
    ethics: 9.5,
    concept: 9,
    observations: 'Bom desempenho geral durante o atendimento.',
    studentId: 'stu-001',
    examId: 1,
    student: MOCK_STUDENTS[0],
    exam: MOCK_EXAMS[0],
  },
  {
    id: 2,
    punctuality: 8,
    instrumental: 7.5,
    organizationOfServiceUnit: 8,
    biosecurity: 9,
    ethics: 8.5,
    concept: 8,
    observations: 'Precisa melhorar organização do box.',
    studentId: 'stu-002',
    examId: 2,
    student: MOCK_STUDENTS[1],
    exam: MOCK_EXAMS[1],
  },
  {
    id: 3,
    punctuality: 10,
    instrumental: 9,
    organizationOfServiceUnit: 9.5,
    biosecurity: 10,
    ethics: 10,
    concept: 9.5,
    observations: 'Excelente desempenho.',
    studentId: 'stu-003',
    examId: 3,
    student: MOCK_STUDENTS[2],
    exam: MOCK_EXAMS[2],
  },
  {
    id: 4,
    punctuality: 7,
    instrumental: 8,
    organizationOfServiceUnit: 7,
    biosecurity: 9,
    ethics: 8,
    concept: 7.5,
    observations: 'Aluno apresentou dificuldade com instrumental.',
    studentId: 'stu-004',
    examId: 1,
    student: MOCK_STUDENTS[3],
    exam: MOCK_EXAMS[0],
  },
  {
    id: 5,
    punctuality: 9.5,
    instrumental: 9,
    organizationOfServiceUnit: 9,
    biosecurity: 10,
    ethics: 9.5,
    concept: 9.5,
    observations: 'Ótimo desempenho clínico.',
    studentId: 'stu-005',
    examId: 2,
    student: MOCK_STUDENTS[4],
    exam: MOCK_EXAMS[1],
  },
];

export const MOCK_DASHBOARD_STATS = {
  totalStudents: 128,
  studentsThisMonth: 12,
  totalEvaluations: 342,
  evaluationsThisMonth: 18,
  todayExams: 8,
  pendingEvaluations: 5,
};

export const MOCK_ACTIVITY = [
  {
    id: 1,
    type: 'evaluation',
    message: 'Maria Souza realizou uma nova avaliação',
    time: 'Hoje, 10:30',
    userId: 'stu-001',
  },
  {
    id: 2,
    type: 'evaluation_update',
    message: 'João Pedro teve avaliação atualizada',
    time: 'Hoje, 09:15',
    userId: 'stu-002',
  },
  {
    id: 3,
    type: 'student',
    message: 'Ana Clara da Silva - nova aluna cadastrada',
    time: 'Ontem, 16:45',
    userId: 'stu-003',
  },
  { id: 4, type: 'report', message: 'Relatório mensal gerado', time: 'Ontem, 14:20', userId: null },
];

export const MOCK_UPCOMING = [
  { time: '10:00', student: 'Maria Souza', id: 'stu-001' },
  { time: '11:00', student: 'João Pedro', id: 'stu-002' },
  { time: '14:00', student: 'Ana Clara da Silva', id: 'stu-003' },
  { time: '15:00', student: 'Carlos Henrique', id: 'stu-004' },
];
