import { Card, Calendar, Typography, Badge, List } from 'antd';
import type { Dayjs } from 'dayjs';
import { MOCK_EXAMS } from '../utils/mockData';

const { Title, Text } = Typography;

export default function AgendaPage() {
  const getListData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    return MOCK_EXAMS.filter((e) => e.date === dateStr);
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="m-0 p-0" style={{ listStyle: 'none' }}>
        {listData.map((item) => (
          <li key={item.id}>
            <Badge status="processing" text={<span style={{ fontSize: 11 }}>{item.title}</span>} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
          Agenda
        </Title>
        <Text style={{ color: '#636E72' }}>Visualize e gerencie seus compromissos</Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
            <Calendar
              cellRender={(value, info) => {
                if (info.type === 'date') return dateCellRender(value);
                return info.originNode;
              }}
            />
          </Card>
        </div>
        <div>
          <Card title="Próximos Exames" style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
            <List
              dataSource={MOCK_EXAMS}
              renderItem={(exam) => (
                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f9f9f9' }}>
                  <div>
                    <div className="font-semibold text-secondary text-sm">{exam.title}</div>
                    <div className="text-xs text-muted">
                      {new Date(exam.date).toLocaleDateString('pt-BR')} • {exam.serviceUnit}
                    </div>
                    <div className="text-xs" style={{ color: '#6C5CE7' }}>
                      {exam.specialism?.name}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
