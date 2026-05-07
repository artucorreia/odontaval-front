export interface EvaluationRecord {
  id: number;
  studentId: string;
  studentName: string;
  examId: number;
  concept: number;
  punctuality: number;
  instrumental: number;
  organizationOfServiceUnit: number;
  biosecurity: number;
  ethics: number;
  observations?: string;
}

export interface CreateEvaluationValues {
  studentId: string;
  concept: number;
  punctuality: number;
  instrumental: number;
  organizationOfServiceUnit: number;
  biosecurity: number;
  ethics: number;
  observations?: string;
}

export interface EditEvaluationValues {
  concept: number;
  punctuality: number;
  instrumental: number;
  organizationOfServiceUnit: number;
  biosecurity: number;
  ethics: number;
  observations?: string;
}

export const EVAL_CRITERIA: { key: keyof EditEvaluationValues; label: string }[] = [
  { key: 'punctuality', label: 'Pontualidade' },
  { key: 'instrumental', label: 'Instrumental' },
  { key: 'organizationOfServiceUnit', label: 'Organização do Box' },
  { key: 'biosecurity', label: 'Biossegurança' },
  { key: 'ethics', label: 'Ética' },
  { key: 'concept', label: 'Conceito Final' },
];
