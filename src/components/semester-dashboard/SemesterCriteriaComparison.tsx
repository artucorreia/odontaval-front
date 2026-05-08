import { Card, Empty } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import type { CriteriaComparisonDatum } from '../../types/semesterDashboard';

interface Props {
  data: CriteriaComparisonDatum[];
}

function barColor(d: CriteriaComparisonDatum): string {
  if (d.isBest) return '#00B894';
  if (d.isWorst) return '#E17055';
  return '#6C5CE7';
}

export default function SemesterCriteriaComparison({ data }: Props) {
  return (
    <Card
      title={<span className="font-semibold">Critérios: Melhor e Pior Desempenho</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
    >
      {data.length === 0 ? (
        <Empty description="Sem dados de critérios" />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 10, right: 30, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: '#2D3436' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 11, fill: '#636E72' }}
                axisLine={false}
                tickLine={false}
                tickCount={6}
              />
              <Tooltip
                formatter={(value: number) => [value.toFixed(1), 'Média']}
                contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
              />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={54}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={barColor(entry)} />
                ))}
                <LabelList
                  dataKey="avg"
                  position="top"
                  formatter={(v: number) => v.toFixed(1)}
                  style={{ fontSize: 12, fontWeight: 700, fill: '#2D3436' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2" style={{ fontSize: 12, color: '#636E72' }}>
            <span style={{ color: '#00B894', fontWeight: 600 }}>■ Melhor critério</span>
            <span style={{ color: '#6C5CE7', fontWeight: 600 }}>■ Demais critérios</span>
            <span style={{ color: '#E17055', fontWeight: 600 }}>■ Critério a melhorar</span>
          </div>
        </>
      )}
    </Card>
  );
}
