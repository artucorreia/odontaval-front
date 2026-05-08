import { Card, Empty } from 'antd';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { RadarDatum } from '../../types/studentDashboard';

interface Props {
  data: RadarDatum[];
}

export default function StudentRadarChart({ data }: Props) {
  return (
    <Card
      title={<span className="font-semibold">Perfil de Critérios</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0', height: '100%' }}
    >
      {data.length === 0 ? (
        <Empty description="Sem dados suficientes" />
      ) : (
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
              name="Média"
              dataKey="value"
              stroke="#6C5CE7"
              fill="#6C5CE7"
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ r: 4, fill: '#6C5CE7' }}
            />
            <Tooltip
              formatter={(value: number) => [value.toFixed(1), 'Média']}
              contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
