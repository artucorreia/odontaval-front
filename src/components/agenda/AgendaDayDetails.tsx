import { Skeleton, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import type { AgendaExam } from '../../types/agenda';
import AgendaExamCard from './AgendaExamCard';
import AgendaEmptyState from './AgendaEmptyState';

const { Text } = Typography;

interface AgendaDayDetailsProps {
  selectedDate: Dayjs;
  exams: AgendaExam[];
  loading: boolean;
}

export default function AgendaDayDetails({ selectedDate, exams, loading }: AgendaDayDetailsProps) {
  const isToday = selectedDate.isSame(new Date(), 'day');
  const weekday = selectedDate.format('dddd');
  const formattedDate = selectedDate.format('DD [de] MMMM [de] YYYY');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f0f0f0',
          background: '#fafafa',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#2D3436', textTransform: 'capitalize' }}>
            {weekday}
          </span>
          {isToday && (
            <span
              style={{
                background: '#722ed1',
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                padding: '1px 8px',
                borderRadius: 10,
              }}
            >
              Hoje
            </span>
          )}
        </div>
        <Text style={{ color: '#8c8c8c', fontSize: 13 }}>{formattedDate}</Text>
        {!loading && (
          <div style={{ marginTop: 4 }}>
            <Text style={{ color: '#722ed1', fontSize: 13, fontWeight: 500 }}>
              {exams.length > 0
                ? `${exams.length} exame${exams.length !== 1 ? 's' : ''}`
                : 'Nenhum exame'}
            </Text>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton active paragraph={{ rows: 3 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : exams.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {exams.map((exam) => (
              <AgendaExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <AgendaEmptyState date={selectedDate} />
        )}
      </div>
    </div>
  );
}
