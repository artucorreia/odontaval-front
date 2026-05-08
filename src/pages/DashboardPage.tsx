import { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Avatar, List, Spin, Tag } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  RightOutlined,
  UserOutlined,
  BarChartOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { examService } from '../services/api';
import type { Exam } from '../types';
import { MOCK_DASHBOARD_STATS, MOCK_EXAMS } from '../utils/mockData';

const { Title, Text } = Typography;

const statCards = [
  {
    label: 'Total de Alunos',
    value: MOCK_DASHBOARD_STATS.totalStudents,
    icon: <TeamOutlined style={{ fontSize: 22, color: '#6C5CE7' }} />,
    bg: '#ede9fe',
    isLink: false,
  },
  {
    label: 'Avaliações Realizadas',
    value: MOCK_DASHBOARD_STATS.totalEvaluations,
    icon: <FileTextOutlined style={{ fontSize: 22, color: '#00B894' }} />,
    bg: '#d1fae5',
    isLink: false,
  },
  {
    label: 'Exames Hoje',
    value: MOCK_DASHBOARD_STATS.todayExams,
    icon: <CalendarOutlined style={{ fontSize: 22, color: '#0984e3' }} />,
    bg: '#dbeafe',
    isLink: true,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentExams, setRecentExams] = useState<Exam[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);

  const firstName = user?.name?.split(' ')[0] ?? 'Usuário';

  useEffect(() => {
    examService
      .findAll()
      .then((res) => {
        const exams: Exam[] = res.data?.data ?? [];
        if (exams.length === 0) throw new Error('empty');
        setRecentExams(
          [...exams]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5),
        );
      })
      .catch(() =>
        setRecentExams(
          [...MOCK_EXAMS]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5),
        ),
      )
      .finally(() => setLoadingExams(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
          Dashboard
        </Title>
        <Text style={{ color: '#636E72' }}>Bem-vindo(a) de volta, {firstName}!</Text>
      </div>

      <Row gutter={[16, 16]} className="mb-4">
        {statCards.map((card, i) => (
          <Col xs={24} sm={8} key={i}>
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

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={<span className="font-semibold text-secondary">Exames Recentes</span>}
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: 0 }}
            extra={
              <Button
                type="link"
                size="small"
                style={{ color: '#6C5CE7', padding: 0 }}
                onClick={() => navigate('/exames')}
              >
                Ver todos <RightOutlined />
              </Button>
            }
          >
            {loadingExams ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : (
              <List
                dataSource={recentExams}
                locale={{ emptyText: 'Nenhum exame encontrado' }}
                renderItem={(exam) => (
                  <List.Item
                    style={{
                      padding: '14px 24px',
                      borderBottom: '1px solid #f9f9f9',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/exames/${exam.id}`)}
                    actions={[
                      <Button
                        size="small"
                        style={{ borderColor: '#6C5CE7', color: '#6C5CE7', borderRadius: 6 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/exames/${exam.id}`);
                        }}
                      >
                        Ver
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ background: '#ede9fe' }}
                          icon={<ExperimentOutlined style={{ color: '#6C5CE7' }} />}
                          size={38}
                        />
                      }
                      title={
                        <Text style={{ fontSize: 13.5, color: '#2D3436', fontWeight: 600 }}>
                          {exam.title}
                        </Text>
                      }
                      description={
                        <div className="flex items-center gap-2 flex-wrap">
                          <Text style={{ fontSize: 12, color: '#636E72' }}>
                            {new Date(exam.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </Text>
                          {exam.academicSemester && (
                            <Tag color="purple" style={{ fontSize: 11, borderRadius: 4 }}>
                              {exam.academicSemester}
                            </Tag>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{ borderRadius: 12, border: '1px solid #f0f0f0', height: '100%' }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            <Text className="font-semibold text-secondary block mb-4" style={{ fontSize: 15 }}>
              Ações Rápidas
            </Text>
            <div className="flex flex-col gap-3">
              <Button
                type="primary"
                icon={<ExperimentOutlined />}
                block
                size="large"
                style={{ background: '#6C5CE7', borderColor: '#6C5CE7', borderRadius: 8 }}
                onClick={() => navigate('/exames')}
              >
                Ir para Exames
              </Button>
              <Button
                icon={<UserOutlined />}
                block
                size="large"
                style={{ borderRadius: 8 }}
                onClick={() => navigate('/alunos')}
              >
                Gerenciar Alunos
              </Button>
              <Button
                icon={<BarChartOutlined />}
                block
                size="large"
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
