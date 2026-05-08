import { Card, Statistic, Tooltip } from 'antd';
import { TrophyOutlined, BarChartOutlined, StarOutlined, WarningOutlined } from '@ant-design/icons';
import type { StudentOverviewStats } from '../../types/studentDashboard';

interface Props {
  stats: StudentOverviewStats;
}

export default function StudentOverviewCards({ stats }: Props) {
  const cards = [
    {
      title: 'Média Geral',
      value: stats.avgConcept,
      precision: 1,
      suffix: '/ 10',
      icon: <BarChartOutlined style={{ fontSize: 20, color: '#6C5CE7' }} />,
      color: '#6C5CE7',
      tooltip: 'Média do conceito final em todas as avaliações',
    },
    {
      title: 'Avaliações',
      value: stats.totalEvaluations,
      precision: 0,
      suffix: undefined,
      icon: <TrophyOutlined style={{ fontSize: 20, color: '#0984E3' }} />,
      color: '#0984E3',
      tooltip: 'Total de avaliações realizadas',
    },
    {
      title: 'Melhor Critério',
      value: stats.bestCriterion.value,
      precision: 1,
      suffix: undefined,
      label: stats.bestCriterion.label,
      icon: <StarOutlined style={{ fontSize: 20, color: '#FDCB6E' }} />,
      color: '#FDCB6E',
      tooltip: 'Critério com maior média histórica',
    },
    {
      title: 'Critério a Melhorar',
      value: stats.worstCriterion.value,
      precision: 1,
      suffix: undefined,
      label: stats.worstCriterion.label,
      icon: <WarningOutlined style={{ fontSize: 20, color: '#E17055' }} />,
      color: '#E17055',
      tooltip: 'Critério com menor média histórica',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
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
                  valueStyle={{ fontSize: 22, fontWeight: 700, color: card.color }}
                />
                {card.label && (
                  <div style={{ fontSize: 11, color: '#636E72', marginTop: 2 }}>{card.label}</div>
                )}
              </div>
              <div
                style={{
                  background: `${card.color}15`,
                  borderRadius: 8,
                  padding: 8,
                  flexShrink: 0,
                }}
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
