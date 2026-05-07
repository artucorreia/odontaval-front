import { Card, Empty, Tooltip } from 'antd';
import type { HeatmapCell } from '../../types/semesterDashboard';

interface Props {
  data: HeatmapCell[];
}

const DAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

function cellColor(count: number, max: number): string {
  if (count === 0 || max === 0) return '#f0f0f0';
  const intensity = count / max;
  if (intensity < 0.25) return '#d4c8f8';
  if (intensity < 0.5) return '#a29bfe';
  if (intensity < 0.75) return '#7c6ff7';
  return '#6C5CE7';
}

export default function SemesterActivityHeatmap({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card
        title={<span className="font-semibold">Mapa de Atividade</span>}
        style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
      >
        <Empty description="Sem dados de atividade" />
      </Card>
    );
  }

  const maxWeek = Math.max(...data.map((c) => c.week));
  const maxCount = Math.max(...data.map((c) => c.count));

  const cellMap: Record<string, number> = {};
  for (const cell of data) {
    cellMap[`${cell.week}-${cell.dayOfWeek}`] = cell.count;
  }

  return (
    <Card
      title={<span className="font-semibold">Mapa de Atividade (Semana × Dia)</span>}
      style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
    >
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start', minWidth: 'max-content' }}>
          {/* Day labels column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 22 }}>
            {DAY_LABELS.map((label) => (
              <div
                key={label}
                style={{ height: 22, width: 28, fontSize: 11, color: '#636E72', display: 'flex', alignItems: 'center' }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Week columns */}
          {Array.from({ length: maxWeek }, (_, wi) => {
            const week = wi + 1;
            return (
              <div key={week} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ height: 18, fontSize: 10, color: '#b2bec3', textAlign: 'center' }}>
                  S{week}
                </div>
                {DAY_LABELS.map((_, di) => {
                  const count = cellMap[`${week}-${di}`] ?? 0;
                  return (
                    <Tooltip
                      key={di}
                      title={count > 0 ? `Semana ${week}, ${DAY_LABELS[di]}: ${count} avaliação${count > 1 ? 'ões' : ''}` : undefined}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 4,
                          background: cellColor(count, maxCount),
                          cursor: count > 0 ? 'pointer' : 'default',
                          transition: 'opacity 0.15s',
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 11, color: '#b2bec3' }}>
          <span>Menos</span>
          {['#f0f0f0', '#d4c8f8', '#a29bfe', '#7c6ff7', '#6C5CE7'].map((c) => (
            <div key={c} style={{ width: 16, height: 16, borderRadius: 3, background: c }} />
          ))}
          <span>Mais avaliações</span>
        </div>
      </div>
    </Card>
  );
}
