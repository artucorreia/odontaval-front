import { CalendarOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import type { Dayjs } from 'dayjs';

const { Text } = Typography;

interface AgendaEmptyStateProps {
  date: Dayjs;
}

export default function AgendaEmptyState({ date }: AgendaEmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#f9f0ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CalendarOutlined style={{ fontSize: 22, color: '#722ed1' }} />
      </div>
      <Text style={{ color: '#8c8c8c', textAlign: 'center', fontSize: 14 }}>
        Nenhum exame agendado para{' '}
        <span style={{ fontWeight: 600, color: '#595959' }}>
          {date.format('DD/MM/YYYY')}
        </span>
      </Text>
    </div>
  );
}
