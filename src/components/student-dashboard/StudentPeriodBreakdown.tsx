import { Card, Tag } from 'antd';
import type { PeriodStats } from '../../types/studentDashboard';

interface Props {
  data: PeriodStats[];
}

function gradeColor(grade: number): string {
  if (grade >= 7) return '#10b981';
  if (grade >= 5) return '#f59e0b';
  return '#ef4444';
}

function gradeBg(grade: number): string {
  if (grade >= 7) return '#ecfdf5';
  if (grade >= 5) return '#fffbeb';
  return '#fef2f2';
}

export default function StudentPeriodBreakdown({ data }: Props) {
  if (data.length === 0) return null;

  return (
    <Card
      title={<span className="font-semibold">Desempenho por Período Avaliativo</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
    >
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {data.map((p) => {
          const color = gradeColor(p.avgGrade);
          const bg = gradeBg(p.avgGrade);
          return (
            <div
              key={p.period}
              style={{
                flex: '1 1 180px',
                background: '#fafbfc',
                borderRadius: 10,
                padding: '16px 20px',
                border: '1px solid #f0f0f0',
                minWidth: 160,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Tag
                  color="purple"
                  style={{ borderRadius: 20, margin: 0, fontWeight: 700, fontSize: 13 }}
                >
                  {p.period}
                </Tag>
                <span style={{ fontSize: 12, color: '#636E72' }}>
                  {p.count} {p.count === 1 ? 'avaliação' : 'avaliações'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  background: bg,
                  borderRadius: 10,
                  padding: '14px 8px',
                  marginBottom: 12,
                  border: `1.5px solid ${color}33`,
                }}
              >
                <span style={{ fontSize: 34, fontWeight: 800, color, lineHeight: 1 }}>
                  {p.avgGrade.toFixed(1)}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    color: '#94a3b8',
                    marginTop: 4,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Média do período
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: 10,
                }}
              >
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>
                    {p.max.toFixed(1)}
                  </div>
                  <div style={{ fontSize: 10, color: '#b2bec3', marginTop: 2 }}>Máx</div>
                </div>
                <div
                  style={{ width: 1, background: '#f0f0f0', margin: '0 8px' }}
                />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#e17055', fontWeight: 700 }}>
                    {p.min.toFixed(1)}
                  </div>
                  <div style={{ fontSize: 10, color: '#b2bec3', marginTop: 2 }}>Mín</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
