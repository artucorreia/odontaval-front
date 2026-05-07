import { UserOutlined, MedicineBoxOutlined, FileTextOutlined } from '@ant-design/icons';
import { Badge, Tag } from 'antd';
import type { AgendaExam, ExamStatus } from '../../types/agenda';

const STATUS_CONFIG: Record<ExamStatus, { label: string; color: 'processing' | 'warning' | 'success' }> = {
  scheduled: { label: 'Agendado', color: 'processing' },
  in_progress: { label: 'Em andamento', color: 'warning' },
  completed: { label: 'Concluído', color: 'success' },
};

const SPECIALISM_COLORS: Record<number, string> = {
  1: 'purple',
  2: 'blue',
  3: 'orange',
  4: 'green',
  5: 'red',
  6: 'cyan',
};

interface AgendaExamCardProps {
  exam: AgendaExam;
}

export default function AgendaExamCard({ exam }: AgendaExamCardProps) {
  const statusConfig = exam.status ? STATUS_CONFIG[exam.status] : null;
  const specialismColor = SPECIALISM_COLORS[exam.specialismId] ?? 'default';

  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        borderRadius: 10,
        padding: '14px 16px',
        background: '#fff',
        transition: 'box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
      className="agenda-exam-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontWeight: 600, color: '#2D3436', fontSize: 14, lineHeight: '1.4', flex: 1 }}>
          {exam.title}
        </span>
        {statusConfig && (
          <Badge status={statusConfig.color} text={statusConfig.label} style={{ whiteSpace: 'nowrap', fontSize: 12 }} />
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {exam.specialism && (
          <Tag color={specialismColor} style={{ margin: 0, fontSize: 12 }}>
            <MedicineBoxOutlined style={{ marginRight: 4 }} />
            {exam.specialism.name}
          </Tag>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {exam.professor && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#595959', fontSize: 13 }}>
            <UserOutlined style={{ color: '#722ed1', fontSize: 13 }} />
            <span>{exam.professor.name}</span>
          </div>
        )}
        {exam.evaluationCount !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#595959', fontSize: 13 }}>
            <FileTextOutlined style={{ color: '#722ed1', fontSize: 13 }} />
            <span>
              {exam.evaluationCount === 0
                ? 'Sem avaliações'
                : exam.evaluationCount === 1
                  ? '1 avaliação'
                  : `${exam.evaluationCount} avaliações`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
