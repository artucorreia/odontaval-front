import { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Avatar, List, Spin, Tag } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  RightOutlined,
  UserOutlined,
  BarChartOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { evaluationService, dashboardService } from '../services/api';
import type { Evaluation } from '../types';
import { MOCK_DASHBOARD_STATS, MOCK_EVALUATIONS } from '../utils/mockData';

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentEvaluations, setRecentEvaluations] = useState<Evaluation[]>([]);
  const [loadingEvaluations, setLoadingEvaluations] = useState(true);
  const [stats, setStats] = useState(MOCK_DASHBOARD_STATS);

  const firstName = user?.name?.split(' ')[0] ?? 'Usuário';

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => {
        if (res.data?.data) setStats(res.data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    evaluationService
      .findAll()
      .then((res) => {
        const evaluations: Evaluation[] = res.data?.data ?? [];
        if (evaluations.length === 0) throw new Error('empty');
        setRecentEvaluations(
          [...evaluations]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5),
        );
      })
      .catch(() =>
        setRecentEvaluations(
          [...MOCK_EVALUATIONS]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5),
        ),
      )
      .finally(() => setLoadingEvaluations(false));
  }, []);

  const statCards = [
    {
      label: 'Total de Alunos',
      value: stats.totalStudents,
      delta: `+${stats.studentsThisMonth} este mês`,
      icon: <TeamOutlined style={{ fontSize: 22, color: '#6C5CE7' }} />,
      bg: '#ede9fe',
      onClick: undefined,
    },
    {
      label: 'Avaliações Realizadas',
      value: stats.totalEvaluations,
      delta: `+${stats.evaluationsThisMonth} este mês`,
      icon: <FileTextOutlined style={{ fontSize: 22, color: '#00B894' }} />,
      bg: '#d1fae5',
      onClick: undefined,
    },
    {
      label: 'Avaliações Pendentes',
      value: stats.pendingEvaluations,
      delta: 'Ver avaliações',
      icon: <FormOutlined style={{ fontSize: 22, color: '#0984e3' }} />,
      bg: '#dbeafe',
      onClick: () => navigate('/avaliacoes'),
    },
  ];

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
                  {card.onClick ? (
                    <a
                      className="text-xs mt-1 block"
                      style={{ color: '#6C5CE7' }}
                      onClick={card.onClick}
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

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={<span className="font-semibold text-secondary">Avaliações Recentes</span>}
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: 0 }}
            extra={
              <Button
                type="link"
                size="small"
                style={{ color: '#6C5CE7', padding: 0 }}
                onClick={() => navigate('/avaliacoes')}
              >
                Ver todas <RightOutlined />
              </Button>
            }
          >
            {loadingEvaluations ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : (
              <List
                dataSource={recentEvaluations}
                locale={{ emptyText: 'Nenhuma avaliação encontrada' }}
                renderItem={(evaluation) => (
                  <List.Item
                    style={{
                      padding: '14px 24px',
                      borderBottom: '1px solid #f9f9f9',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/avaliacoes')}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ background: '#ede9fe' }}
                          icon={<FormOutlined style={{ color: '#6C5CE7' }} />}
                          size={38}
                        />
                      }
                      title={
                        <Text style={{ fontSize: 13.5, color: '#2D3436', fontWeight: 600 }}>
                          {evaluation.title}
                        </Text>
                      }
                      description={
                        <div className="flex items-center gap-2 flex-wrap">
                          <Text style={{ fontSize: 12, color: '#636E72' }}>
                            {new Date(evaluation.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </Text>
                          <Tag color="purple" style={{ fontSize: 11, borderRadius: 4 }}>
                            {evaluation.evaluationNumber}
                          </Tag>
                          <Tag style={{ fontSize: 11, borderRadius: 4 }}>
                            {evaluation.academicSemester}
                          </Tag>
                        </div>
                      }
                    />
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: evaluation.grade >= 7 ? '#00B894' : evaluation.grade >= 5 ? '#e17055' : '#d63031',
                      }}
                    >
                      {evaluation.grade.toFixed(1)}
                    </div>
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
                icon={<FormOutlined />}
                block
                size="large"
                style={{ background: '#6C5CE7', borderColor: '#6C5CE7', borderRadius: 8 }}
                onClick={() => navigate('/avaliacoes/nova')}
              >
                Nova Avaliação
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
