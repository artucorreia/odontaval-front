import { Card, Table, Tag, Empty } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import type { TopStudentDatum } from '../../types/semesterDashboard';

interface Props {
  data: TopStudentDatum[];
}

const RANK_COLORS: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };

const columns = [
  {
    title: '#',
    key: 'rank',
    width: 48,
    render: (_: unknown, __: TopStudentDatum, index: number) => {
      const rank = index + 1;
      const color = RANK_COLORS[rank];
      return color ? (
        <TrophyOutlined style={{ color, fontSize: 16 }} />
      ) : (
        <span style={{ color: '#b2bec3', fontSize: 13 }}>{rank}</span>
      );
    },
  },
  {
    title: 'Aluno',
    dataIndex: 'studentName',
    key: 'studentName',
    render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
  },
  {
    title: 'Média',
    dataIndex: 'avgConcept',
    key: 'avgConcept',
    width: 90,
    render: (v: number) => {
      const color = v >= 9 ? '#00B894' : v >= 7 ? '#6C5CE7' : v >= 5 ? '#FDCB6E' : '#E17055';
      return (
        <Tag color={color} style={{ fontWeight: 700, fontSize: 13, minWidth: 44, textAlign: 'center' }}>
          {v.toFixed(1)}
        </Tag>
      );
    },
  },
  {
    title: 'Avaliações',
    dataIndex: 'totalEvaluations',
    key: 'totalEvaluations',
    width: 100,
    render: (v: number) => <span style={{ color: '#636E72' }}>{v}</span>,
  },
];

export default function SemesterTopStudents({ data }: Props) {
  return (
    <Card
      title={<span className="font-semibold">Top Alunos do Semestre</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0', height: '100%' }}
    >
      {data.length === 0 ? (
        <Empty description="Sem dados de alunos" />
      ) : (
        <Table
          dataSource={data}
          columns={columns}
          rowKey="studentId"
          pagination={false}
          size="small"
        />
      )}
    </Card>
  );
}
