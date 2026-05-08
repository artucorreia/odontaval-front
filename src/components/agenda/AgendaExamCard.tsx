import dayjs from 'dayjs';
import { UserOutlined, MedicineBoxOutlined, FileTextOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import type { AgendaExam, ExamStatus } from '../../types/agenda';

const STATUS_CONFIG: Record<ExamStatus, { label: string; color: string }> = {
  scheduled:   { label: 'Agendado',      color: 'blue' },
  in_progress: { label: 'Em Andamento',  color: 'orange' },
  completed:   { label: 'Concluído',     color: 'green' },
};

const SPECIALISM_COLORS: Record<number, string> = {
  1: 'purple',
  2: 'blue',
  3: 'orange',
  4: 'green',
  5: 'red',
  6: 'cyan',
};

function getStatus(date: string): ExamStatus {
  const today = dayjs().startOf('day');
  const examDate = dayjs(date).startOf('day');
  if (examDate.isBefore(today)) return 'completed';
  if (examDate.isSame(today)) return 'in_progress';
  return 'scheduled';
}

interface AgendaExamCardProps {
  exam: AgendaExam;
}

export default function AgendaExamCard({ exam }: AgendaExamCardProps) {
  const statusConfig = STATUS_CONFIG[getStatus(exam.date)];
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
        <Tag color={statusConfig.color} style={{ whiteSpace: 'nowrap', margin: 0, fontSize: 12 }}>
          {statusConfig.label}
        </Tag>
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
