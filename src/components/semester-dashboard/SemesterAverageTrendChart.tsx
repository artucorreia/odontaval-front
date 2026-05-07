import { Card, Empty } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { AverageTrendDatum } from '../../types/semesterDashboard';

interface Props {
  data: AverageTrendDatum[];
}

interface TooltipPayload { value: number }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, padding: '8px 14px', fontSize: 13, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <div style={{ color: '#636E72', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 700, color: '#6C5CE7', fontSize: 16 }}>
        Média: {payload[0].value.toFixed(1)}
      </div>
    </div>
  );
}

export default function SemesterAverageTrendChart({ data }: Props) {
  return (
    <Card
      title={<span className="font-semibold">Evolução da Média Geral</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
    >
      {data.length === 0 ? (
        <Empty description="Sem dados de evolução" />
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#636E72' }} axisLine={false} tickLine={false} />
            <YAxis domain={[5, 10]} tick={{ fontSize: 11, fill: '#636E72' }} axisLine={false} tickLine={false} tickCount={6} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={7} stroke="#FDCB6E" strokeDasharray="4 4" strokeWidth={1.5} />
            <Area
              type="monotone"
              dataKey="avg"
              stroke="#6C5CE7"
              strokeWidth={2.5}
              fill="url(#trendGradient)"
              dot={{ r: 5, fill: '#6C5CE7', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      <div style={{ fontSize: 11, color: '#b2bec3', marginTop: 6, textAlign: 'right' }}>
        Linha pontilhada = nota mínima (7.0)
      </div>
    </Card>
  );
}
