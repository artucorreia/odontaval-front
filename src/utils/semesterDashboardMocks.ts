import type { Evaluation } from '../types';
import { MOCK_STUDENTS } from './mockData';
import { MOCK_EXTENDED_EXAMS } from './studentDashboardMocks';

// Extra evaluations for other students on the early-semester exams (10-17)
// This distributes data across Jan-May to make the timeline and heatmap meaningful.
export const MOCK_SEMESTER_EXTRA_EVALUATIONS: Evaluation[] = [
  // === exam 10 (Jan 20, Dentística) ===
  {
    id: 1001, punctuality: 7.0, instrumental: 6.5, organizationOfServiceUnit: 6.5,
    biosecurity: 8.0, ethics: 7.5, concept: 7.0, observations: '',
    studentId: 'stu-002', examId: 10, student: MOCK_STUDENTS[1], exam: MOCK_EXTENDED_EXAMS[0],
  },
  {
    id: 1002, punctuality: 8.0, instrumental: 7.5, organizationOfServiceUnit: 7.5,
    biosecurity: 8.5, ethics: 8.0, concept: 7.8, observations: '',
    studentId: 'stu-003', examId: 10, student: MOCK_STUDENTS[2], exam: MOCK_EXTENDED_EXAMS[0],
  },
  {
    id: 1003, punctuality: 6.5, instrumental: 6.0, organizationOfServiceUnit: 6.0,
    biosecurity: 7.5, ethics: 7.0, concept: 6.5, observations: '',
    studentId: 'stu-004', examId: 10, student: MOCK_STUDENTS[3], exam: MOCK_EXTENDED_EXAMS[0],
  },
  // === exam 11 (Feb 10, Endodontia) ===
  {
    id: 1004, punctuality: 7.5, instrumental: 7.0, organizationOfServiceUnit: 7.0,
    biosecurity: 8.5, ethics: 7.5, concept: 7.3, observations: '',
    studentId: 'stu-004', examId: 11, student: MOCK_STUDENTS[3], exam: MOCK_EXTENDED_EXAMS[1],
  },
  {
    id: 1005, punctuality: 8.5, instrumental: 8.0, organizationOfServiceUnit: 7.5,
    biosecurity: 9.0, ethics: 8.5, concept: 8.2, observations: '',
    studentId: 'stu-007', examId: 11, student: MOCK_STUDENTS[6], exam: MOCK_EXTENDED_EXAMS[1],
  },
  {
    id: 1006, punctuality: 7.0, instrumental: 7.5, organizationOfServiceUnit: 6.5,
    biosecurity: 8.0, ethics: 7.5, concept: 7.2, observations: '',
    studentId: 'stu-006', examId: 11, student: MOCK_STUDENTS[5], exam: MOCK_EXTENDED_EXAMS[1],
  },
  // === exam 12 (Feb 25, Dentística) ===
  {
    id: 1007, punctuality: 8.5, instrumental: 8.5, organizationOfServiceUnit: 8.0,
    biosecurity: 9.5, ethics: 9.0, concept: 8.5, observations: '',
    studentId: 'stu-003', examId: 12, student: MOCK_STUDENTS[2], exam: MOCK_EXTENDED_EXAMS[2],
  },
  {
    id: 1008, punctuality: 7.5, instrumental: 7.5, organizationOfServiceUnit: 7.0,
    biosecurity: 8.0, ethics: 7.5, concept: 7.5, observations: '',
    studentId: 'stu-005', examId: 12, student: MOCK_STUDENTS[4], exam: MOCK_EXTENDED_EXAMS[2],
  },
  {
    id: 1009, punctuality: 6.0, instrumental: 6.0, organizationOfServiceUnit: 5.5,
    biosecurity: 7.0, ethics: 6.5, concept: 6.0, observations: '',
    studentId: 'stu-008', examId: 12, student: MOCK_STUDENTS[7], exam: MOCK_EXTENDED_EXAMS[2],
  },
  // === exam 13 (Mar 15, Periodontia) ===
  {
    id: 1010, punctuality: 8.0, instrumental: 8.0, organizationOfServiceUnit: 7.5,
    biosecurity: 8.5, ethics: 8.0, concept: 8.0, observations: '',
    studentId: 'stu-002', examId: 13, student: MOCK_STUDENTS[1], exam: MOCK_EXTENDED_EXAMS[3],
  },
  {
    id: 1011, punctuality: 7.5, instrumental: 7.5, organizationOfServiceUnit: 7.0,
    biosecurity: 8.0, ethics: 8.0, concept: 7.5, observations: '',
    studentId: 'stu-005', examId: 13, student: MOCK_STUDENTS[4], exam: MOCK_EXTENDED_EXAMS[3],
  },
  {
    id: 1012, punctuality: 8.5, instrumental: 9.0, organizationOfServiceUnit: 8.5,
    biosecurity: 9.5, ethics: 9.0, concept: 8.8, observations: '',
    studentId: 'stu-007', examId: 13, student: MOCK_STUDENTS[6], exam: MOCK_EXTENDED_EXAMS[3],
  },
  {
    id: 1013, punctuality: 6.5, instrumental: 7.0, organizationOfServiceUnit: 6.5,
    biosecurity: 7.5, ethics: 7.0, concept: 6.8, observations: '',
    studentId: 'stu-008', examId: 13, student: MOCK_STUDENTS[7], exam: MOCK_EXTENDED_EXAMS[3],
  },
  // === exam 14 (Mar 28, Ortodontia) ===
  {
    id: 1014, punctuality: 9.0, instrumental: 9.0, organizationOfServiceUnit: 8.5,
    biosecurity: 9.5, ethics: 9.5, concept: 9.0, observations: '',
    studentId: 'stu-003', examId: 14, student: MOCK_STUDENTS[2], exam: MOCK_EXTENDED_EXAMS[4],
  },
  {
    id: 1015, punctuality: 7.5, instrumental: 8.0, organizationOfServiceUnit: 7.5,
    biosecurity: 8.5, ethics: 8.0, concept: 7.8, observations: '',
    studentId: 'stu-004', examId: 14, student: MOCK_STUDENTS[3], exam: MOCK_EXTENDED_EXAMS[4],
  },
  {
    id: 1016, punctuality: 7.0, instrumental: 7.0, organizationOfServiceUnit: 6.5,
    biosecurity: 8.0, ethics: 7.5, concept: 7.0, observations: '',
    studentId: 'stu-006', examId: 14, student: MOCK_STUDENTS[5], exam: MOCK_EXTENDED_EXAMS[4],
  },
  {
    id: 1017, punctuality: 6.5, instrumental: 6.5, organizationOfServiceUnit: 6.0,
    biosecurity: 7.5, ethics: 7.0, concept: 6.5, observations: '',
    studentId: 'stu-008', examId: 14, student: MOCK_STUDENTS[7], exam: MOCK_EXTENDED_EXAMS[4],
  },
  // === exam 15 (Apr 10, Endodontia) ===
  {
    id: 1018, punctuality: 8.5, instrumental: 8.5, organizationOfServiceUnit: 8.0,
    biosecurity: 9.5, ethics: 9.0, concept: 8.5, observations: '',
    studentId: 'stu-002', examId: 15, student: MOCK_STUDENTS[1], exam: MOCK_EXTENDED_EXAMS[5],
  },
  {
    id: 1019, punctuality: 9.0, instrumental: 9.5, organizationOfServiceUnit: 9.0,
    biosecurity: 10.0, ethics: 9.5, concept: 9.2, observations: '',
    studentId: 'stu-003', examId: 15, student: MOCK_STUDENTS[2], exam: MOCK_EXTENDED_EXAMS[5],
  },
  {
    id: 1020, punctuality: 8.5, instrumental: 8.5, organizationOfServiceUnit: 8.0,
    biosecurity: 9.0, ethics: 9.0, concept: 8.5, observations: '',
    studentId: 'stu-007', examId: 15, student: MOCK_STUDENTS[6], exam: MOCK_EXTENDED_EXAMS[5],
  },
  {
    id: 1021, punctuality: 7.0, instrumental: 7.0, organizationOfServiceUnit: 6.5,
    biosecurity: 8.0, ethics: 7.5, concept: 7.0, observations: '',
    studentId: 'stu-008', examId: 15, student: MOCK_STUDENTS[7], exam: MOCK_EXTENDED_EXAMS[5],
  },
  // === exam 16 (Apr 22, Dentística) ===
  {
    id: 1022, punctuality: 9.5, instrumental: 9.5, organizationOfServiceUnit: 9.0,
    biosecurity: 10.0, ethics: 9.5, concept: 9.5, observations: '',
    studentId: 'stu-003', examId: 16, student: MOCK_STUDENTS[2], exam: MOCK_EXTENDED_EXAMS[6],
  },
  {
    id: 1023, punctuality: 8.0, instrumental: 8.0, organizationOfServiceUnit: 7.5,
    biosecurity: 9.0, ethics: 8.5, concept: 8.0, observations: '',
    studentId: 'stu-005', examId: 16, student: MOCK_STUDENTS[4], exam: MOCK_EXTENDED_EXAMS[6],
  },
  {
    id: 1024, punctuality: 7.5, instrumental: 7.5, organizationOfServiceUnit: 7.0,
    biosecurity: 8.5, ethics: 8.0, concept: 7.5, observations: '',
    studentId: 'stu-006', examId: 16, student: MOCK_STUDENTS[5], exam: MOCK_EXTENDED_EXAMS[6],
  },
  {
    id: 1025, punctuality: 9.0, instrumental: 9.0, organizationOfServiceUnit: 8.5,
    biosecurity: 9.5, ethics: 9.5, concept: 9.0, observations: '',
    studentId: 'stu-007', examId: 16, student: MOCK_STUDENTS[6], exam: MOCK_EXTENDED_EXAMS[6],
  },
  // === exam 17 (May 5, Cirurgia Oral) ===
  {
    id: 1026, punctuality: 8.5, instrumental: 9.0, organizationOfServiceUnit: 8.5,
    biosecurity: 9.0, ethics: 9.0, concept: 8.8, observations: '',
    studentId: 'stu-002', examId: 17, student: MOCK_STUDENTS[1], exam: MOCK_EXTENDED_EXAMS[7],
  },
  {
    id: 1027, punctuality: 9.5, instrumental: 9.5, organizationOfServiceUnit: 9.0,
    biosecurity: 10.0, ethics: 10.0, concept: 9.5, observations: '',
    studentId: 'stu-003', examId: 17, student: MOCK_STUDENTS[2], exam: MOCK_EXTENDED_EXAMS[7],
  },
  {
    id: 1028, punctuality: 7.5, instrumental: 8.0, organizationOfServiceUnit: 7.5,
    biosecurity: 8.5, ethics: 8.0, concept: 7.8, observations: '',
    studentId: 'stu-004', examId: 17, student: MOCK_STUDENTS[3], exam: MOCK_EXTENDED_EXAMS[7],
  },
  {
    id: 1029, punctuality: 7.5, instrumental: 7.5, organizationOfServiceUnit: 7.0,
    biosecurity: 8.0, ethics: 8.0, concept: 7.5, observations: '',
    studentId: 'stu-006', examId: 17, student: MOCK_STUDENTS[5], exam: MOCK_EXTENDED_EXAMS[7],
  },
];
