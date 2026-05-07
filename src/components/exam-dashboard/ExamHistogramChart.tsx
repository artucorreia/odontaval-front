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
import type { HistogramDatum } from '../../types/examDashboard';

interface Props {
  data: HistogramDatum[];
  totalStudents: number;
}

interface TooltipPayload {
  payload: HistogramDatum;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        padding: '8px 14px',
        fontSize: 13,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Faixa {d.range}</div>
      <div style={{ color: '#636E72' }}>
        {d.count} aluno{d.count !== 1 ? 's' : ''} ({d.pct}%)
      </div>
    </div>
  );
}

export default function ExamHistogramChart({ data, totalStudents }: Props) {
  const difficulty =
    totalStudents === 0
      ? null
      : (() => {
          const high = data.find((d) => d.range === '8 – 10')?.pct ?? 0;
          const low = (data.find((d) => d.range === '0 – 4')?.pct ?? 0) + (data.find((d) => d.range === '4 – 6')?.pct ?? 0);
          if (high >= 60) return { label: 'Exame Acessível', color: '#00B894' };
          if (low >= 40) return { label: 'Exame Desafiador', color: '#E17055' };
          return { label: 'Exame Equilibrado', color: '#6C5CE7' };
        })();

  return (
    <Card
      title={
        <div className="flex items-center gap-3">
          <span className="font-semibold">Distribuição de Notas</span>
          {difficulty && (
            <span
              style={{
                fontSize: 12,
                background: `${difficulty.color}15`,
                color: difficulty.color,
                padding: '2px 10px',
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              {difficulty.label}
            </span>
          )}
        </div>
      }
      style={{ borderRadius: 12, border: '1px solid #f0f0f0', height: '100%' }}
    >
      {data.every((d) => d.count === 0) ? (
        <Empty description="Sem dados de distribuição" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 12, fill: '#636E72' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#636E72' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
              <LabelList
                dataKey="count"
                position="top"
                style={{ fontSize: 13, fontWeight: 700, fill: '#2D3436' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
