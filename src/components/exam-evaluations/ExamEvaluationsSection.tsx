import { useEffect, useState, useCallback } from 'react';
import { Button, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Exam, Evaluation } from '../../types';
import type { EvaluationRecord, CreateEvaluationValues, EditEvaluationValues } from './types';
import { evaluationService } from '../../services/api';
import { MOCK_STUDENTS } from '../../utils/mockData';
import { MOCK_EVALUATIONS, MOCK_EXAMS } from '../../utils/mockData';
import {
  MOCK_EXAM1_EXTRA_EVALUATIONS,
  MOCK_EXAM2_EXTRA_EVALUATIONS,
  MOCK_EXAM3_EXTRA_EVALUATIONS,
} from '../../utils/examDashboardMocks';
import ExamEvaluationsTable from './ExamEvaluationsTable';
import CreateEvaluationModal from './CreateEvaluationModal';
import EditEvaluationModal from './EditEvaluationModal';
import EvaluationDetailsModal from './EvaluationDetailsModal';

interface Props {
  examId: number;
  exam: Exam | null;
}

function toRecord(e: Evaluation): EvaluationRecord {
  return {
    id: e.id,
    studentId: e.studentId,
    studentName:
      MOCK_STUDENTS.find((s) => s.id === e.studentId)?.name ?? e.student?.name ?? e.studentId,
    examId: e.examId,
    concept: e.concept,
    punctuality: e.punctuality,
    instrumental: e.instrumental,
    organizationOfServiceUnit: e.organizationOfServiceUnit,
    biosecurity: e.biosecurity,
    ethics: e.ethics,
    observations: e.observations,
  };
}

const ALL_MOCK_EVALS: Evaluation[] = [
  ...MOCK_EVALUATIONS,
  ...MOCK_EXAM1_EXTRA_EVALUATIONS,
  ...MOCK_EXAM2_EXTRA_EVALUATIONS,
  ...MOCK_EXAM3_EXTRA_EVALUATIONS,
];

let mockIdCounter = 900;

export default function ExamEvaluationsSection({ examId, exam }: Props) {
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [search, setSearch] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<EvaluationRecord | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [viewTarget, setViewTarget] = useState<EvaluationRecord | null>(null);

  const loadEvaluations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await evaluationService.findAll();
      const all: Evaluation[] = res.data?.data ?? [];
      if (all.length === 0) throw new Error('empty');
      setEvaluations(all.filter((e) => e.examId === examId).map(toRecord));
      setIsMock(false);
    } catch {
      setIsMock(true);
      setEvaluations(ALL_MOCK_EVALS.filter((e) => e.examId === examId).map(toRecord));
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    loadEvaluations();
  }, [loadEvaluations]);

  const handleCreate = async (values: CreateEvaluationValues) => {
    setCreateLoading(true);
    try {
      if (isMock) {
        const newRecord: EvaluationRecord = {
          ...values,
          id: ++mockIdCounter,
          examId,
          studentName:
            MOCK_STUDENTS.find((s) => s.id === values.studentId)?.name ?? values.studentId,
        };
        setEvaluations((prev) => [newRecord, ...prev]);
        message.success('Avaliação criada com sucesso!');
      } else {
        await evaluationService.create({ ...values, examId });
        await loadEvaluations();
        message.success('Avaliação criada com sucesso!');
      }
      setCreateOpen(false);
    } catch {
      message.error('Erro ao criar avaliação.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEdit = async (id: number, values: EditEvaluationValues) => {
    setEditLoading(true);
    try {
      if (isMock) {
        setEvaluations((prev) => prev.map((e) => (e.id === id ? { ...e, ...values } : e)));
        message.success('Avaliação atualizada com sucesso!');
      } else {
        await evaluationService.update(id, values);
        await loadEvaluations();
        message.success('Avaliação atualizada com sucesso!');
      }
      setEditTarget(null);
    } catch {
      message.error('Erro ao atualizar avaliação.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (isMock) {
        setEvaluations((prev) => prev.filter((e) => e.id !== id));
      } else {
        await evaluationService.delete(id);
        setEvaluations((prev) => prev.filter((e) => e.id !== id));
      }
      message.success('Avaliação removida!');
    } catch {
      message.error('Erro ao remover avaliação.');
    }
  };

  const examForContext = exam ?? MOCK_EXAMS.find((x) => x.id === examId) ?? null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div style={{ fontSize: 13, color: '#636E72' }}>
          {evaluations.length} avaliação{evaluations.length !== 1 ? 'ões' : ''} neste exame
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
          style={{ background: '#6C5CE7', borderColor: '#6C5CE7', borderRadius: 8 }}
        >
          Nova Avaliação
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spin tip="Carregando avaliações..." />
        </div>
      ) : (
        <ExamEvaluationsTable
          data={evaluations}
          search={search}
          onSearchChange={setSearch}
          onView={(record) => setViewTarget(record)}
          onEdit={(record) => setEditTarget(record)}
          onDelete={handleDelete}
        />
      )}

      <CreateEvaluationModal
        open={createOpen}
        loading={createLoading}
        examTitle={exam?.title}
        onSubmit={handleCreate}
        onCancel={() => setCreateOpen(false)}
      />

      <EditEvaluationModal
        evaluation={editTarget}
        open={editTarget !== null}
        loading={editLoading}
        onSubmit={handleEdit}
        onCancel={() => setEditTarget(null)}
      />

      <EvaluationDetailsModal
        evaluation={viewTarget}
        exam={examForContext}
        open={viewTarget !== null}
        onClose={() => setViewTarget(null)}
      />
    </div>
  );
}
