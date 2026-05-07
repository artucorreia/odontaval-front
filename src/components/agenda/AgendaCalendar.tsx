import { Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import type { DateExamsMap } from '../../types/agenda';

interface AgendaCalendarProps {
  dateExamsMap: DateExamsMap;
  panelDate: Dayjs;
  onDateSelect: (date: Dayjs) => void;
  onPanelChange: (value: Dayjs) => void;
}

export default function AgendaCalendar({
  dateExamsMap,
  panelDate,
  onDateSelect,
  onPanelChange,
}: AgendaCalendarProps) {
  const cellRender = (current: Dayjs, info: { type: string; originNode: React.ReactNode }) => {
    if (info.type !== 'date') return info.originNode;

    const exams = dateExamsMap[current.format('YYYY-MM-DD')];

    if (!exams || exams.length === 0) return null;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#722ed1',
            flexShrink: 0,
          }}
        />
      </div>
    );
  };

  return (
    <Calendar
      value={panelDate}
      onSelect={(date, info) => {
        if (info.source === 'date') {
          onDateSelect(date);
        }
      }}
      onPanelChange={onPanelChange}
      cellRender={cellRender}
      fullscreen
    />
  );
}
