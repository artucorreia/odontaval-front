import { useState } from 'react';
import { Card, Tag, InputNumber, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
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
  const [weights, setWeights] = useState<Record<string, number | null>>({});

  if (data.length === 0) return null;

  const setWeight = (period: string, value: number | null) => {
    setWeights((prev) => ({ ...prev, [period]: value }));
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-semibold">Desempenho por Período Avaliativo</span>
          <Tooltip title="Informe o peso de cada período para calcular a nota final prática. Fórmula: Nota do Período = Média × Peso">
            <InfoCircleOutlined style={{ color: '#b2bec3', fontSize: 14, cursor: 'help' }} />
          </Tooltip>
        </div>
      }
      style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
    >
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {data.map((p) => {
          const color = gradeColor(p.avgGrade);
          const bg = gradeBg(p.avgGrade);
          const peso = weights[p.period];
          const notaPeriodo =
            peso != null && peso > 0
              ? Math.round(p.avgGrade * peso * 100) / 100
              : null;
          const notaColor = notaPeriodo != null ? gradeColor(notaPeriodo) : '#2D3436';
          const notaBg = notaPeriodo != null ? gradeBg(notaPeriodo) : '#f8fafc';

          return (
            <div
              key={p.period}
              style={{
                flex: '1 1 180px',
                background: '#fafbfc',
                borderRadius: 10,
                padding: '16px 20px',
                border: '1px solid #f0f0f0',
                minWidth: 180,
              }}
            >
              {/* ── Period badge + count ─────────────────────────── */}
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

              {/* ── Average grade ring ───────────────────────────── */}
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

              {/* ── Min / Max ────────────────────────────────────── */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: 10,
                  marginBottom: 14,
                }}
              >
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>
                    {p.max.toFixed(1)}
                  </div>
                  <div style={{ fontSize: 10, color: '#b2bec3', marginTop: 2 }}>Máx</div>
                </div>
                <div style={{ width: 1, background: '#f0f0f0', margin: '0 8px' }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#e17055', fontWeight: 700 }}>
                    {p.min.toFixed(1)}
                  </div>
                  <div style={{ fontSize: 10, color: '#b2bec3', marginTop: 2 }}>Mín</div>
                </div>
              </div>

              {/* ── Weight input ─────────────────────────────────── */}
              <div
                style={{
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Peso da {p.period}
                  </span>
                  <InputNumber
                    min={0}
                    max={1}
                    step={0.1}
                    precision={2}
                    value={peso ?? undefined}
                    onChange={(v) => setWeight(p.period, v)}
                    placeholder="0.00"
                    size="small"
                    style={{ width: 72, borderRadius: 6, fontSize: 13 }}
                  />
                </div>

                {/* ── Weighted final grade ──────────────────────── */}
                <div
                  style={{
                    background: notaBg,
                    borderRadius: 8,
                    padding: '10px 12px',
                    border: `1px solid ${notaPeriodo != null ? notaColor + '33' : '#f0f0f0'}`,
                    textAlign: 'center',
                    minHeight: 52,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {notaPeriodo != null ? (
                    <>
                      <span style={{ fontSize: 22, fontWeight: 800, color: notaColor, lineHeight: 1 }}>
                        {notaPeriodo.toFixed(2)}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: '#94a3b8',
                          marginTop: 3,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {p.avgGrade.toFixed(1)} × {peso!.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: 11, color: '#b2bec3' }}>
                      Informe o peso para calcular
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
