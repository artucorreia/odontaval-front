import { Card, Empty } from 'antd';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { EvaluationsOverTimeDatum } from '../../types/semesterDashboard';

interface Props {
  data: EvaluationsOverTimeDatum[];
}

export default function SemesterEvaluationsChart({ data }: Props) {
  return (
    <Card
      title={<span className="font-semibold">Avaliações por Mês</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
    >
      {data.length === 0 ? (
        <Empty description="Sem dados para o período" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12, fill: '#636E72' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: '#636E72' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[5, 10]}
              tick={{ fontSize: 11, fill: '#636E72' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
              formatter={(value: number, name: string) => [
                name === 'Avaliações' ? value : value.toFixed(1),
                name,
              ]}
            />
            <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
            <Bar
              yAxisId="left"
              dataKey="count"
              name="Avaliações"
              fill="#6C5CE7"
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
              maxBarSize={48}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgGrade"
              name="Média da Nota"
              stroke="#00B894"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#00B894' }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
