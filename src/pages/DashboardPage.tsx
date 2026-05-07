import React from 'react';
import { Card, Row, Col, Typography, Button, Avatar, List } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
  UserOutlined,
  EditOutlined,
  PlusOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_DASHBOARD_STATS, MOCK_ACTIVITY, MOCK_UPCOMING } from '../utils/mockData';

const { Title, Text } = Typography;

const statCards = [
  {
    label: 'Total de Alunos',
    value: MOCK_DASHBOARD_STATS.totalStudents,
    delta: `+${MOCK_DASHBOARD_STATS.studentsThisMonth} este mês`,
    icon: <TeamOutlined style={{ fontSize: 22, color: '#6C5CE7' }} />,
    bg: '#ede9fe',
  },
  {
    label: 'Avaliações Realizadas',
    value: MOCK_DASHBOARD_STATS.totalEvaluations,
    delta: `+${MOCK_DASHBOARD_STATS.evaluationsThisMonth} este mês`,
    icon: <FileTextOutlined style={{ fontSize: 22, color: '#00B894' }} />,
    bg: '#d1fae5',
  },
  {
    label: 'Exames Hoje',
    value: MOCK_DASHBOARD_STATS.todayExams,
    delta: 'Ver agenda',
    isLink: true,
    icon: <CalendarOutlined style={{ fontSize: 22, color: '#0984e3' }} />,
    bg: '#dbeafe',
  },
  {
    label: 'Pendências',
    value: MOCK_DASHBOARD_STATS.pendingEvaluations,
    delta: 'Ver pendências',
    isAlert: true,
    isLink: true,
    icon: <ExclamationCircleOutlined style={{ fontSize: 22, color: '#E17055' }} />,
    bg: '#fee2e2',
  },
];

const activityIconMap: Record<string, React.ReactNode> = {
  evaluation: <FileTextOutlined style={{ color: '#6C5CE7' }} />,
  evaluation_update: <EditOutlined style={{ color: '#0984e3' }} />,
  student: <UserOutlined style={{ color: '#00B894' }} />,
  report: <BarChartOutlined style={{ color: '#636E72' }} />,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name?.split(' ')[0] ?? 'Usuário';

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
          Dashboard
        </Title>
        <Text style={{ color: '#636E72' }}>Bem-vindo(a) de volta, {firstName}!</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        {statCards.map((card, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card
              className="stat-card"
              style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <Text style={{ color: '#636E72', fontSize: 13 }}>{card.label}</Text>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      color: '#2D3436',
                      lineHeight: 1.2,
                      marginTop: 4,
                    }}
                  >
                    {card.value}
                  </div>
                  {card.isLink ? (
                    <a
                      className="text-xs mt-1 block"
                      style={{ color: card.isAlert ? '#E17055' : '#6C5CE7' }}
                      onClick={() => navigate(card.isAlert ? '/avaliacoes' : '/agenda')}
                    >
                      {card.delta}
                    </a>
                  ) : (
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpOutlined style={{ fontSize: 11, color: '#00B894' }} />
                      <Text style={{ color: '#00B894', fontSize: 12 }}>{card.delta}</Text>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    background: card.bg,
                    borderRadius: 10,
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Activity + Schedule */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={<span className="font-semibold text-secondary">Atividades Recentes</span>}
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: 0 }}
          >
            <List
              dataSource={MOCK_ACTIVITY}
              renderItem={(item) => (
                <List.Item
                  style={{ padding: '14px 24px', borderBottom: '1px solid #f9f9f9' }}
                  actions={[
                    <Button
                      size="small"
                      style={{ borderColor: '#6C5CE7', color: '#6C5CE7', borderRadius: 6 }}
                      onClick={() => navigate('/avaliacoes')}
                    >
                      Ver
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ background: '#ede9fe' }}
                        icon={activityIconMap[item.type]}
                        size={38}
                      />
                    }
                    title={<Text style={{ fontSize: 13.5, color: '#2D3436' }}>{item.message}</Text>}
                    description={
                      <Text style={{ fontSize: 12, color: '#636E72' }}>{item.time}</Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={<span className="font-semibold text-secondary">Próximos Compromissos</span>}
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: 0 }}
            extra={
              <Button
                type="link"
                size="small"
                style={{ color: '#6C5CE7', padding: 0 }}
                onClick={() => navigate('/agenda')}
              >
                Ver agenda completa <RightOutlined />
              </Button>
            }
          >
            <List
              dataSource={MOCK_UPCOMING}
              renderItem={(item) => (
                <List.Item style={{ padding: '14px 24px', borderBottom: '1px solid #f9f9f9' }}>
                  <div className="flex items-center gap-4 w-full">
                    <div
                      style={{
                        fontWeight: 600,
                        color: '#6C5CE7',
                        fontSize: 14,
                        minWidth: 52,
                      }}
                    >
                      {item.time}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        borderLeft: '2px solid #ede9fe',
                        paddingLeft: 12,
                        color: '#2D3436',
                        fontSize: 14,
                      }}
                    >
                      {item.student}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* Quick actions */}
          <Card
            style={{ borderRadius: 12, border: '1px solid #f0f0f0', marginTop: 16 }}
            bodyStyle={{ padding: '16px 24px' }}
          >
            <Text className="font-semibold text-secondary block mb-3">Ações Rápidas</Text>
            <div className="flex flex-col gap-2">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                block
                style={{ background: '#6C5CE7', borderColor: '#6C5CE7', borderRadius: 8 }}
                onClick={() => navigate('/exames')}
              >
                Ir para Exames
              </Button>
              <Button
                icon={<UserOutlined />}
                block
                style={{ borderRadius: 8 }}
                onClick={() => navigate('/alunos')}
              >
                Gerenciar Alunos
              </Button>
              <Button
                icon={<BarChartOutlined />}
                block
                style={{ borderRadius: 8 }}
                onClick={() => navigate('/relatorios')}
              >
                Ver Relatórios
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
