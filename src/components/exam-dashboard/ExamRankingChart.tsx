import { Card, Empty, Tag } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import type { RankingDatum } from '../../types/examDashboard';

interface Props {
  data: RankingDatum[];
  approvalCutoff: number;
}

interface TooltipPayload {
  payload: RankingDatum;
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
      <div style={{ fontWeight: 600, marginBottom: 2 }}>
        {d.rank}º {d.studentName}
      </div>
      <div style={{ color: '#636E72' }}>
        Conceito: <strong style={{ color: d.approved ? '#00B894' : '#E17055' }}>{d.concept.toFixed(1)}</strong>
      </div>
      <Tag color={d.approved ? 'success' : 'error'} style={{ marginTop: 4, fontSize: 11 }}>
        {d.approved ? 'Aprovado' : 'Reprovado'}
      </Tag>
    </div>
  );
}

function firstName(name: string): string {
  return name.split(' ')[0];
}

export default function ExamRankingChart({ data, approvalCutoff }: Props) {
  return (
    <Card
      title={<span className="font-semibold">Ranking dos Alunos</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
    >
      {data.length === 0 ? (
        <Empty description="Sem dados de ranking" />
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(200, data.length * 38)}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 60, bottom: 5, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 10]}
              tick={{ fontSize: 11, fill: '#636E72' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="studentName"
              tickFormatter={firstName}
              width={80}
              tick={{ fontSize: 12, fill: '#2D3436' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={approvalCutoff}
              stroke="#E17055"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{ value: `Mínimo ${approvalCutoff}`, position: 'top', fontSize: 11, fill: '#E17055' }}
            />
            <Bar dataKey="concept" radius={[0, 6, 6, 0]} maxBarSize={22}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.concept >= approvalCutoff ? '#6C5CE7' : '#E17055'}
                  fillOpacity={entry.rank === 1 ? 1 : 0.7 + (data.length - entry.rank) * 0.03}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      <div style={{ fontSize: 11, color: '#b2bec3', marginTop: 4, textAlign: 'right' }}>
        Linha vermelha = nota mínima para aprovação
      </div>
    </Card>
  );
}
