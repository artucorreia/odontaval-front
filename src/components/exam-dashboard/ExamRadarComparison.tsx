import { Card, Empty } from 'antd';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { RadarComparisonDatum } from '../../types/examDashboard';

interface Props {
  data: RadarComparisonDatum[];
  examTitle?: string;
  semester?: string;
}

export default function ExamRadarComparison({
  data,
  examTitle = 'Este Exame',
  semester = 'Semestre',
}: Props) {
  return (
    <Card
      title={<span className="font-semibold">Radar: Exame vs. Semestre</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0', height: '100%' }}
    >
      {data.length === 0 ? (
        <Empty description="Sem dados para comparação" />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e8e8e8" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 12, fill: '#636E72', fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fontSize: 10, fill: '#b2bec3' }}
                tickCount={6}
              />
              <Radar
                name={examTitle}
                dataKey="thisExam"
                stroke="#6C5CE7"
                fill="#6C5CE7"
                fillOpacity={0.25}
                strokeWidth={2}
                dot={{ r: 4, fill: '#6C5CE7' }}
              />
              <Radar
                name={`Média ${semester}`}
                dataKey="semester"
                stroke="#00B894"
                fill="#00B894"
                fillOpacity={0.15}
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ r: 4, fill: '#00B894' }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [value.toFixed(1), name]}
                contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: '#2D3436' }}>{value}</span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: '#b2bec3', textAlign: 'center', marginTop: 4 }}>
            Roxo = este exame · Verde = média geral do semestre
          </div>
        </>
      )}
    </Card>
  );
}
