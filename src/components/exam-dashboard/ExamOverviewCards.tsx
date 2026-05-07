import { Card, Statistic, Tooltip, Progress } from 'antd';
import {
  TeamOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ExamOverviewStats } from '../../types/examDashboard';

interface Props {
  stats: ExamOverviewStats;
}

export default function ExamOverviewCards({ stats }: Props) {
  const approvalColor =
    stats.approvalRate >= 80 ? '#00B894' : stats.approvalRate >= 60 ? '#FDCB6E' : '#E17055';

  const cards = [
    {
      title: 'Alunos Avaliados',
      value: stats.totalStudents,
      precision: 0,
      suffix: undefined,
      icon: <TeamOutlined style={{ fontSize: 20, color: '#0984E3' }} />,
      iconBg: '#0984E315',
      tooltip: 'Total de alunos que realizaram este exame',
      extra: null,
    },
    {
      title: 'Média da Turma',
      value: stats.avgConcept,
      precision: 1,
      suffix: '/ 10',
      icon: <BarChartOutlined style={{ fontSize: 20, color: '#6C5CE7' }} />,
      iconBg: '#6C5CE715',
      tooltip: 'Média do conceito final de todos os alunos',
      extra: null,
    },
    {
      title: 'Maior Nota',
      value: stats.highestConcept,
      precision: 1,
      suffix: undefined,
      icon: <ArrowUpOutlined style={{ fontSize: 20, color: '#00B894' }} />,
      iconBg: '#00B89415',
      tooltip: 'Melhor desempenho individual neste exame',
      extra: null,
    },
    {
      title: 'Menor Nota',
      value: stats.lowestConcept,
      precision: 1,
      suffix: undefined,
      icon: <ArrowDownOutlined style={{ fontSize: 20, color: '#E17055' }} />,
      iconBg: '#E1705515',
      tooltip: 'Menor desempenho individual neste exame',
      extra: null,
    },
    {
      title: 'Taxa de Aprovação',
      value: stats.approvalRate,
      precision: 1,
      suffix: '%',
      icon: <CheckCircleOutlined style={{ fontSize: 20, color: approvalColor }} />,
      iconBg: `${approvalColor}15`,
      tooltip: `Percentual de alunos com nota ≥ ${stats.approvalCutoff}`,
      extra: (
        <Progress
          percent={stats.approvalRate}
          showInfo={false}
          strokeColor={approvalColor}
          trailColor="#f0f0f0"
          strokeWidth={4}
          style={{ marginTop: 6 }}
        />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
      {cards.map((card) => (
        <Tooltip key={card.title} title={card.tooltip}>
          <Card
            size="small"
            style={{ borderRadius: 12, border: '1px solid #f0f0f0', cursor: 'default' }}
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div style={{ fontSize: 12, color: '#636E72', marginBottom: 4 }}>{card.title}</div>
                <Statistic
                  value={card.value}
                  precision={card.precision}
                  suffix={card.suffix}
                  valueStyle={{ fontSize: 22, fontWeight: 700 }}
                />
                {card.extra}
              </div>
              <div
                style={{ background: card.iconBg, borderRadius: 8, padding: 8, flexShrink: 0 }}
              >
                {card.icon}
              </div>
            </div>
          </Card>
        </Tooltip>
      ))}
    </div>
  );
}
