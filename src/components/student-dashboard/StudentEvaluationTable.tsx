import { useState } from 'react';
import { Card, Table, Tag, Empty, Button, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { EnrichedEvaluation } from '../../types/studentDashboard';
import EvaluationDetailsModal from '../evaluations/EvaluationDetailsModal';

interface Props {
  data: EnrichedEvaluation[];
}

function gradeTag(value: number) {
  const color = value >= 9 ? 'success' : value >= 7 ? 'purple' : value >= 5 ? 'warning' : 'error';
  return (
    <Tag color={color} style={{ fontWeight: 700, fontSize: 14, padding: '2px 10px' }}>
      {value.toFixed(1)}
    </Tag>
  );
}

export default function StudentEvaluationTable({ data }: Props) {
  const [selectedEval, setSelectedEval] = useState<EnrichedEvaluation | null>(null);

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
      title: 'Período',
      dataIndex: 'evaluationNumber',
      key: 'evaluationNumber',
      width: 80,
      render: (v: string) => <Tag color="purple">{v}</Tag>,
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
      dataIndex: 'title',
      key: 'title',
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
      title: 'Nota',
      dataIndex: 'grade',
      key: 'grade',
      align: 'center',
      width: 90,
      render: (value: number) => gradeTag(value),
      sorter: (a, b) => a.grade - b.grade,
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      width: 48,
      render: (_, record) => (
        <Tooltip title="Ver detalhes">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined style={{ color: '#6C5CE7' }} />}
            onClick={() => setSelectedEval(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
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
      </Card>

      <EvaluationDetailsModal
        evaluation={selectedEval}
        open={!!selectedEval}
        onClose={() => setSelectedEval(null)}
      />
    </>
  );
}
