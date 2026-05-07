import { examService } from './api';
import type { AgendaExam, DateExamsMap } from '../types/agenda';
import { MOCK_AGENDA_EXAMS } from '../utils/agendaMocks';

export async function fetchAgendaExams(): Promise<AgendaExam[]> {
  try {
    const response = await examService.findAll();
    const rawData = response.data?.data;
    if (Array.isArray(rawData) && rawData.length > 0) {
      return rawData as AgendaExam[];
    }
    return MOCK_AGENDA_EXAMS;
  } catch {
    return MOCK_AGENDA_EXAMS;
  }
}

export function groupExamsByDate(exams: AgendaExam[]): DateExamsMap {
  return exams.reduce<DateExamsMap>((map, exam) => {
    const key = exam.date;
    if (!map[key]) map[key] = [];
    map[key].push(exam);
    return map;
  }, {});
}
