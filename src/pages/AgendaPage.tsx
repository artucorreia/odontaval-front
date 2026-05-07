import { useState, useEffect, useMemo } from 'react';
import { Card, Drawer, Typography, Spin } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { fetchAgendaExams, groupExamsByDate } from '../services/agendaService';
import type { AgendaExam, DateExamsMap } from '../types/agenda';
import AgendaCalendar from '../components/agenda/AgendaCalendar';
import AgendaDayDetails from '../components/agenda/AgendaDayDetails';

const { Title, Text } = Typography;

export default function AgendaPage() {
  const today = useMemo(() => dayjs(), []);
  const [exams, setExams] = useState<AgendaExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);
  const [panelDate, setPanelDate] = useState<Dayjs>(today);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchAgendaExams().then((data) => {
      setExams(data);
      setLoading(false);
    });
  }, []);

  const dateExamsMap: DateExamsMap = useMemo(() => groupExamsByDate(exams), [exams]);

  const selectedDayExams = useMemo(
    () => dateExamsMap[selectedDate.format('YYYY-MM-DD')] ?? [],
    [dateExamsMap, selectedDate],
  );

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
    setPanelDate(date);
    if (isMobile) setDrawerOpen(true);
  };

  const handlePanelChange = (value: Dayjs) => {
    setPanelDate(value);
  };

  const panelContent = (
    <AgendaDayDetails selectedDate={selectedDate} exams={selectedDayExams} loading={loading} />
  );

  return (
    <div>
      <div className="mb-6">
        <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
          Agenda
        </Title>
        <Text style={{ color: '#636E72' }}>Visualize os exames agendados</Text>
      </div>

      {loading && exams.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 360px',
            gap: 16,
            alignItems: 'start',
          }}
        >
          <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0', overflow: 'hidden' }} styles={{ body: { padding: 0 } }}>
            <AgendaCalendar
              dateExamsMap={dateExamsMap}
              panelDate={panelDate}
              onDateSelect={handleDateSelect}
              onPanelChange={handlePanelChange}
            />
          </Card>

          {!isMobile && (
            <Card
              style={{
                borderRadius: 12,
                border: '1px solid #f0f0f0',
                overflow: 'hidden',
                position: 'sticky',
                top: 24,
              }}
              styles={{ body: { padding: 0 } }}
            >
              {panelContent}
            </Card>
          )}
        </div>
      )}

      {isMobile && (
        <Drawer
          title={null}
          placement="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          height="auto"
          styles={{
            body: { padding: 0, maxHeight: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
          }}
        >
          {panelContent}
        </Drawer>
      )}
    </div>
  );
}
