import { Card, Empty } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ComparisonDatum } from '../../types/studentDashboard';

interface Props {
  data: ComparisonDatum[];
  studentName?: string;
}

export default function StudentComparisonChart({ data, studentName = 'Aluno' }: Props) {
  return (
    <Card
      title={<span className="font-semibold">Comparativo com a Turma</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
    >
      {data.length === 0 ? (
        <Empty description="Sem dados para comparação" />
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
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
              formatter={(value: number, name: string) => [value.toFixed(1), name]}
              contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
            />
            <Legend
              formatter={(value) => (
                <span style={{ fontSize: 12, color: '#2D3436' }}>{value}</span>
              )}
            />
            <Bar dataKey="student" name={studentName} fill="#6C5CE7" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <Bar dataKey="turma" name="Média da Turma" fill="#B2BEC3" radius={[4, 4, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
