import { Card, Table, Tag, Button, Empty, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { EnrichedEvaluation } from '../../types/studentDashboard';

interface Props {
  data: EnrichedEvaluation[];
}

function conceptColor(value: number): string {
  if (value >= 9) return '#00B894';
  if (value >= 7) return '#6C5CE7';
  if (value >= 5) return '#FDCB6E';
  return '#E17055';
}

function conceptTag(value: number) {
  const color = value >= 9 ? 'success' : value >= 7 ? 'purple' : value >= 5 ? 'warning' : 'error';
  return (
    <Tag color={color} style={{ fontWeight: 700, fontSize: 14, padding: '2px 10px' }}>
      {value.toFixed(1)}
    </Tag>
  );
}

export default function StudentEvaluationTable({ data }: Props) {
  const navigate = useNavigate();

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
            onClick={() => navigate(`/avaliacoes/${record.id}`)}
            style={{ color: '#6C5CE7' }}
          />
        </Tooltip>
      ),
    },
  ];

  const expandedRowRender = (record: EnrichedEvaluation) => (
    <div style={{ padding: '8px 16px', background: '#fafafa', borderRadius: 6 }}>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
        {[
          { label: 'Pontualidade', value: record.punctuality },
          { label: 'Instrumental', value: record.instrumental },
          { label: 'Organização', value: record.organizationOfServiceUnit },
          { label: 'Biossegurança', value: record.biosecurity },
          { label: 'Ética', value: record.ethics },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#636E72' }}>{item.label}</div>
            <div style={{ fontWeight: 700, color: conceptColor(item.value), fontSize: 15 }}>
              {item.value.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
      {record.observations && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#636E72', fontStyle: 'italic' }}>
          "{record.observations}"
        </div>
      )}
    </div>
  );

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
          expandable={{ expandedRowRender, expandRowByClick: false }}
          scroll={{ x: 400 }}
        />
      )}
    </Card>
  );
}
