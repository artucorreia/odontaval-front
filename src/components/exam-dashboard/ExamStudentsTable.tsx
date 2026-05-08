import { useState } from 'react';
import { Card, Table, Tag, Button, Empty, Tooltip } from 'antd';
import { EyeOutlined, TrophyOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { ExamStudentRecord } from '../../types/examDashboard';
import type { EvaluationRecord } from '../exam-evaluations/types';
import type { Exam } from '../../types';
import EvaluationDetailsModal from '../exam-evaluations/EvaluationDetailsModal';

interface Props {
  data: ExamStudentRecord[];
  approvalCutoff?: number;
  exam?: Exam | null;
}

function toEvalRecord(record: ExamStudentRecord, examId: number): EvaluationRecord {
  return {
    id: record.evaluationId,
    studentId: record.studentId,
    studentName: record.studentName,
    examId,
    concept: record.concept,
    punctuality: record.punctuality,
    instrumental: record.instrumental,
    organizationOfServiceUnit: record.organizationOfServiceUnit,
    biosecurity: record.biosecurity,
    ethics: record.ethics,
    observations: record.observations,
  };
}

export default function ExamStudentsTable({ data, approvalCutoff = 7.0, exam = null }: Props) {
  const [viewTarget, setViewTarget] = useState<EvaluationRecord | null>(null);

  const columns: ColumnsType<ExamStudentRecord> = [
    {
      title: '#',
      key: 'rank',
      width: 44,
      render: (_v, _r, index) => (
        <span
          style={{
            fontWeight: 700,
            color: index === 0 ? '#FDCB6E' : '#b2bec3',
            fontSize: index === 0 ? 16 : 13,
          }}
        >
          {index === 0 ? <TrophyOutlined /> : index + 1}
        </span>
      ),
    },
    {
      title: 'Aluno',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name: string) => <span className="font-semibold">{name}</span>,
    },
    {
      title: 'Conceito',
      dataIndex: 'concept',
      key: 'concept',
      align: 'center',
      width: 100,
      sorter: (a, b) => b.concept - a.concept,
      render: (value: number) => (
        <Tag
          color={value >= approvalCutoff ? 'purple' : 'error'}
          style={{ fontWeight: 700, fontSize: 14, padding: '2px 10px' }}
        >
          {value.toFixed(1)}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      align: 'center',
      width: 110,
      responsive: ['sm'],
      render: (_v, record) => (
        <Tag color={record.concept >= approvalCutoff ? 'success' : 'error'}>
          {record.concept >= approvalCutoff ? 'Aprovado' : 'Reprovado'}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 50,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Ver avaliação">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            style={{ color: '#6C5CE7' }}
            onClick={() => setViewTarget(toEvalRecord(record, exam?.id ?? 0))}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Card
      title={<span className="font-semibold">Desempenho Individual</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
    >
      {data.length === 0 ? (
        <Empty description="Nenhum aluno avaliado neste exame" />
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey="evaluationId"
          size="small"
          pagination={false}
          scroll={{ x: 400 }}
        />
      )}

      <EvaluationDetailsModal
        evaluation={viewTarget}
        exam={exam}
        open={viewTarget !== null}
        onClose={() => setViewTarget(null)}
      />
    </Card>
  );
}
