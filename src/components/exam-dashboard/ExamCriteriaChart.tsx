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
  ReferenceLine,
} from 'recharts';
import type { CriteriaDatum } from '../../types/examDashboard';

interface Props {
  data: CriteriaDatum[];
}

function barColor(value: number): string {
  if (value >= 8.5) return '#00B894';
  if (value >= 7) return '#6C5CE7';
  if (value >= 5) return '#FDCB6E';
  return '#E17055';
}

export default function ExamCriteriaChart({ data }: Props) {
  return (
    <Card
      title={<span className="font-semibold">Média por Critério</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0', height: '100%' }}
    >
      {data.length === 0 ? (
        <Empty description="Sem dados de critérios" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#636E72' }}
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
            <ReferenceLine y={7} stroke="#FDCB6E" strokeDasharray="4 4" strokeWidth={1.5} />
            <Bar dataKey="avg" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, index) => (
                <Cell key={index} fill={barColor(entry.avg)} />
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
      )}
      <div style={{ fontSize: 11, color: '#b2bec3', marginTop: 4, textAlign: 'right' }}>
        Verde ≥ 8.5 · Roxo ≥ 7 · Amarelo ≥ 5 · Vermelho &lt; 5
      </div>
    </Card>
  );
}
