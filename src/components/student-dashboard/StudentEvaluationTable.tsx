import { useState } from 'react';
import { Card, Table, Tag, Button, Empty, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { EnrichedEvaluation } from '../../types/studentDashboard';
import type { EvaluationRecord } from '../exam-evaluations/types';
import type { Exam } from '../../types';
import EvaluationDetailsModal from '../exam-evaluations/EvaluationDetailsModal';

interface Props {
  data: EnrichedEvaluation[];
  studentName?: string;
}

function conceptTag(value: number) {
  const color = value >= 9 ? 'success' : value >= 7 ? 'purple' : value >= 5 ? 'warning' : 'error';
  return (
    <Tag color={color} style={{ fontWeight: 700, fontSize: 14, padding: '2px 10px' }}>
      {value.toFixed(1)}
    </Tag>
  );
}

function toEvalRecord(e: EnrichedEvaluation, studentName: string): EvaluationRecord {
  return {
    id: e.id,
    studentId: e.studentId,
    studentName,
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

function toPartialExam(e: EnrichedEvaluation): Exam {
  return {
    id: e.examId,
    title: e.examTitle,
    date: e.date,
    academicSemester: '',
    goals: '',
    serviceUnit: '',
    procedurePerformed: '',
    professorId: '',
    specialismId: e.specialismId,
    specialism: { id: e.specialismId, name: e.specialismName },
    professor: e.professorName ? { id: '', name: e.professorName, email: '', roles: [] } : undefined,
  };
}

export default function StudentEvaluationTable({ data, studentName = '—' }: Props) {
  const [viewTarget, setViewTarget] = useState<EvaluationRecord | null>(null);
  const [viewExam, setViewExam] = useState<Exam | null>(null);

  const handleView = (record: EnrichedEvaluation) => {
    setViewTarget(toEvalRecord(record, studentName));
    setViewExam(toPartialExam(record));
  };

  const sorted = [...data].sort(
    (a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime(),
  );

  const columns: ColumnsType<EnrichedEvaluation> = [
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      width: 110,
      render: (date: string) =>
        date
          ? new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            })
          : '-',
    },
    {
      title: 'Especialidade',
      dataIndex: 'specialismName',
      key: 'specialismName',
      render: (name: string) => <Tag color="blue">{name}</Tag>,
      responsive: ['sm'],
    },
    {
      title: 'Avaliação',
      dataIndex: 'examTitle',
      key: 'examTitle',
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: 'Professor',
      dataIndex: 'professorName',
      key: 'professorName',
      responsive: ['lg'],
      render: (name: string) => (
        <span style={{ fontSize: 13, color: '#636E72' }}>{name}</span>
      ),
    },
    {
      title: 'Conceito',
      dataIndex: 'concept',
      key: 'concept',
      align: 'center',
      width: 90,
      render: (value: number) => conceptTag(value),
      sorter: (a, b) => a.concept - b.concept,
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Ver detalhes">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{ color: '#6C5CE7' }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Card
      title={<span className="font-semibold">Histórico de Avaliações</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
    >
      {data.length === 0 ? (
        <Empty description="Nenhuma avaliação registrada" />
      ) : (
        <Table
          dataSource={sorted}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (t) => `${t} avaliações` }}
          scroll={{ x: 400 }}
        />
      )}

      <EvaluationDetailsModal
        evaluation={viewTarget}
        exam={viewExam}
        open={viewTarget !== null}
        onClose={() => {
          setViewTarget(null);
          setViewExam(null);
        }}
      />
    </Card>
  );
}
