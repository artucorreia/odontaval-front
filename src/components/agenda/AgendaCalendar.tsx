import { Button, Select } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Calendar } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { DateExamsMap } from '../../types/agenda';

interface AgendaCalendarProps {
  dateExamsMap: DateExamsMap;
  panelDate: Dayjs;
  onDateSelect: (date: Dayjs) => void;
  onPanelChange: (value: Dayjs) => void;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const CURRENT_YEAR = dayjs().year();
const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - 5 + i);

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

  const headerRender = ({ value, onChange }: { value: Dayjs; onChange: (date: Dayjs) => void }) => {
    const goTo = (date: Dayjs) => {
      onChange(date);
      onPanelChange(date);
    };

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          gap: 8,
        }}
      >
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => goTo(value.subtract(1, 'month'))}
        />

        <div style={{ display: 'flex', gap: 8, flex: 1, justifyContent: 'center' }}>
          <Select
            value={value.month()}
            onChange={(month) => goTo(value.month(month))}
            style={{ width: 130 }}
            options={MONTHS.map((label, index) => ({ label, value: index }))}
          />
          <Select
            value={value.year()}
            onChange={(year) => goTo(value.year(year))}
            style={{ width: 90 }}
            options={YEARS.map((year) => ({ label: year, value: year }))}
          />
        </div>

        <Button
          type="text"
          icon={<RightOutlined />}
          onClick={() => goTo(value.add(1, 'month'))}
        />
      </div>
    );
  };

  return (
    <Calendar
      value={panelDate}
      mode="month"
      onSelect={(date, info) => {
        if (info.source === 'date') {
          onDateSelect(date);
        }
      }}
      onPanelChange={onPanelChange}
      cellRender={cellRender}
      headerRender={headerRender}
      fullscreen
    />
  );
}
