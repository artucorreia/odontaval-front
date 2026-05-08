import { Card, Statistic, Tooltip } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import type { SemesterKPIs } from '../../types/semesterDashboard';

interface Props {
  kpis: SemesterKPIs;
}

export default function SemesterOverviewCards({ kpis }: Props) {
  const approvalColor =
    kpis.approvalRate >= 80 ? '#00B894' : kpis.approvalRate >= 60 ? '#FDCB6E' : '#E17055';

  const cards = [
    {
      title: 'Avaliações',
      value: kpis.totalEvaluations,
      suffix: undefined,
      precision: 0,
      icon: <FileTextOutlined style={{ fontSize: 20, color: '#6C5CE7' }} />,
      bg: '#6C5CE715',
      tooltip: 'Total de avaliações registradas no semestre',
    },
    {
      title: 'Alunos Avaliados',
      value: kpis.totalStudents,
      suffix: undefined,
      precision: 0,
      icon: <TeamOutlined style={{ fontSize: 20, color: '#00B894' }} />,
      bg: '#00B89415',
      tooltip: 'Alunos únicos que participaram de pelo menos uma avaliação',
    },
    {
      title: 'Professores Ativos',
      value: kpis.totalProfessors,
      suffix: undefined,
      precision: 0,
      icon: <UserSwitchOutlined style={{ fontSize: 20, color: '#FDCB6E' }} />,
      bg: '#FDCB6E15',
      tooltip: 'Professores que conduziram avaliações no semestre',
    },
    {
      title: 'Média Geral',
      value: kpis.avgConcept,
      suffix: '/ 10',
      precision: 1,
      icon: <BarChartOutlined style={{ fontSize: 20, color: '#a29bfe' }} />,
      bg: '#a29bfe15',
      tooltip: 'Média do conceito final de todos os alunos no semestre',
    },
    {
      title: 'Taxa de Aprovação',
      value: kpis.approvalRate,
      suffix: '%',
      precision: 1,
      icon: <CheckCircleOutlined style={{ fontSize: 20, color: approvalColor }} />,
      bg: `${approvalColor}15`,
      tooltip: 'Percentual de alunos com conceito ≥ 7.0',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <Tooltip key={card.title} title={card.tooltip}>
          <Card
            size="small"
            style={{ borderRadius: 12, border: '1px solid #f0f0f0', cursor: 'default' }}
            styles={{ body: { padding: '16px 18px' } }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 11, color: '#636E72', marginBottom: 4, whiteSpace: 'nowrap' }}>
                  {card.title}
                </div>
                <Statistic
                  value={card.value}
                  precision={card.precision}
                  suffix={card.suffix}
                  valueStyle={{ fontSize: 20, fontWeight: 700 }}
                />
              </div>
              <div style={{ background: card.bg, borderRadius: 8, padding: 8, flexShrink: 0 }}>
                {card.icon}
              </div>
            </div>
          </Card>
        </Tooltip>
      ))}
    </div>
  );
}
