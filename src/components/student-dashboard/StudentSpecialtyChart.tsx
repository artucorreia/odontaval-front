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
import type { SpecialtyDatum } from '../../types/studentDashboard';

interface Props {
  data: SpecialtyDatum[];
}

const COLORS = ['#6C5CE7', '#00B894', '#0984E3', '#FDCB6E', '#E17055', '#74B9FF'];

export default function StudentSpecialtyChart({ data }: Props) {
  return (
    <Card
      title={<span className="font-semibold">Desempenho por Especialidade</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0', height: '100%' }}
    >
      {data.length === 0 ? (
        <Empty description="Sem dados por especialidade" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 50, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
            <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 11, fill: '#636E72' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="specialty"
              tick={{ fontSize: 12, fill: '#2D3436' }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number, _name: string, props: { payload: SpecialtyDatum }) => [
                `${value.toFixed(1)} (${props.payload.count} aval.)`,
                'Média',
              ]}
              contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
            />
            <Bar dataKey="avg" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList
                dataKey="avg"
                position="right"
                formatter={(v: number) => v.toFixed(1)}
                style={{ fontSize: 12, fontWeight: 600, fill: '#2D3436' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
