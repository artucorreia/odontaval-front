import { Card, Table, Tag, Button, Empty, Tooltip, Progress } from 'antd';
import { EyeOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { ExamStudentRecord } from '../../types/examDashboard';

interface Props {
  data: ExamStudentRecord[];
  approvalCutoff?: number;
}

const CRITERIA = [
  { key: 'punctuality' as const, label: 'Pontualidade' },
  { key: 'instrumental' as const, label: 'Instrumental' },
  { key: 'organizationOfServiceUnit' as const, label: 'Organização' },
  { key: 'biosecurity' as const, label: 'Biossegurança' },
  { key: 'ethics' as const, label: 'Ética' },
];

function scoreColor(v: number): string {
  if (v >= 8.5) return '#00B894';
  if (v >= 7) return '#6C5CE7';
  if (v >= 5) return '#FDCB6E';
  return '#E17055';
}

export default function ExamStudentsTable({ data, approvalCutoff = 7.0 }: Props) {
  const navigate = useNavigate();

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
            onClick={() => navigate(`/avaliacoes/${record.evaluationId}`)}
          />
        </Tooltip>
      ),
    },
  ];

  const expandedRowRender = (record: ExamStudentRecord) => (
    <div style={{ padding: '10px 16px', background: '#fafafa', borderRadius: 6 }}>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {CRITERIA.map(({ key, label }) => {
          const value = record[key];
          return (
            <div key={key}>
              <div style={{ fontSize: 11, color: '#636E72', marginBottom: 4 }}>{label}</div>
              <Progress
                percent={value * 10}
                showInfo={false}
                strokeColor={scoreColor(value)}
                trailColor="#f0f0f0"
                strokeWidth={6}
                style={{ marginBottom: 2 }}
              />
              <div style={{ fontWeight: 700, color: scoreColor(value), fontSize: 13 }}>
                {value.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
      {record.observations && (
        <div style={{ marginTop: 10, fontSize: 12, color: '#636E72', fontStyle: 'italic' }}>
          "{record.observations}"
        </div>
      )}
    </div>
  );

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
          expandable={{ expandedRowRender, expandRowByClick: false }}
          scroll={{ x: 400 }}
        />
      )}
    </Card>
  );
}
