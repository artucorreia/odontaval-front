import { Card, Empty } from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ConceptDistributionDatum } from '../../types/semesterDashboard';

interface Props {
  data: ConceptDistributionDatum[];
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  pct: number;
}

const RADIAN = Math.PI / 180;

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, pct }: LabelProps) {
  if (pct < 5) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
      {pct.toFixed(0)}%
    </text>
  );
}

export default function SemesterConceptDistributionChart({ data }: Props) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <Card
      title={<span className="font-semibold">Distribuição de Notas</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0', height: '100%' }}
    >
      {!hasData ? (
        <Empty description="Sem dados de distribuição" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={(props) => renderCustomLabel({ ...props, pct: props.pct })}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, _name: string, props: { payload: ConceptDistributionDatum }) => [
                `${value} alunos (${props.payload.pct.toFixed(1)}%)`,
                props.payload.name,
              ]}
              contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
            />
            <Legend
              formatter={(value) => <span style={{ fontSize: 12, color: '#2D3436' }}>{value}</span>}
              iconType="circle"
              iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
