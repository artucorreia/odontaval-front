import { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Button, Avatar, List, Spin, Tag, Alert } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  FormOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ArrowRightOutlined,
  RightOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/api';
import type { DashboardStats } from '../types';

const { Title, Text } = Typography;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function gradeColor(grade: number) {
  if (grade >= 7) return '#10b981';
  if (grade >= 5) return '#f59e0b';
  return '#ef4444';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.roles?.some((r) => r.name === 'ADMIN') ?? false;
  const evaluationsRoute = isAdmin ? '/admin/avaliacoes' : '/avaliacoes';

  const firstName = user?.name?.split(' ')[0] ?? 'Usuário';
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const fetchStats = () => {
    setLoading(true);
    setError(null);
    dashboardService
      .getStats()
      .then((res) => setStats(res.data?.data ?? null))
      .catch(() => setError('Não foi possível carregar os dados. Verifique a conexão com o servidor.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const kpiCards = [
    {
      label: 'Total de Alunos',
      value: stats?.totalStudents ?? '—',
      sub: 'cadastrados no sistema',
      icon: <TeamOutlined style={{ fontSize: 18, color: '#6C5CE7' }} />,
    },
    {
      label: 'Avaliações Realizadas',
      value: stats?.totalEvaluations ?? '—',
      sub: 'em todos os semestres',
      icon: <FileTextOutlined style={{ fontSize: 18, color: '#6C5CE7' }} />,
    },
    {
      label: 'Avaliações este mês',
      value: stats?.evaluationsThisMonth ?? '—',
      sub: 'no mês corrente',
      icon: <CalendarOutlined style={{ fontSize: 18, color: '#6C5CE7' }} />,
    },
  ];

  const quickActions = isAdmin
    ? [
        { label: 'Gerenciar Usuários',      icon: <TeamOutlined />,    route: '/admin/usuarios' },
        { label: 'Gerenciar Especialidades', icon: <StarOutlined />,    route: '/admin/especialidades' },
        { label: 'Ver Avaliações',           icon: <FileTextOutlined />, route: '/admin/avaliacoes' },
        { label: 'Ver Relatórios',           icon: <BarChartOutlined />, route: '/admin/relatorios' },
      ]
    : [
        { label: 'Nova Avaliação',   icon: <FormOutlined />,    route: '/avaliacoes/nova' },
        { label: 'Gerenciar Alunos', icon: <UserOutlined />,    route: '/alunos' },
        { label: 'Ver Relatórios',   icon: <BarChartOutlined />, route: '/relatorios' },
      ];

  return (
    <div>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="mb-5">
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#2D3436' }}>
          {greeting()}, {firstName}!
        </Title>
        <Text style={{ color: '#636E72' }}>{today}</Text>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchStats}>
              Tentar novamente
            </Button>
          }
          style={{ marginBottom: 20 }}
          showIcon
        />
      )}

      {/* ── KPI cards ────────────────────────────────────────────────── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {kpiCards.map((card) => (
          <Col xs={24} sm={8} key={card.label}>
            <Card
              style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
              styles={{ body: { padding: '20px 24px' } }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {card.label}
                  </Text>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#2D3436', lineHeight: 1.2, marginTop: 6, marginBottom: 4, minHeight: 36, display: 'flex', alignItems: 'center' }}>
                    {loading ? <Spin size="small" /> : card.value}
                  </div>
                  <Text style={{ color: '#b2bec3', fontSize: 12 }}>{card.sub}</Text>
                </div>
                <div style={{ background: '#f5f3ff', borderRadius: 8, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ── Recent evaluations + Quick actions ───────────────────────── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={<span style={{ fontWeight: 600, color: '#2D3436' }}>Avaliações Recentes</span>}
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
            styles={{ body: { padding: 0 } }}
            extra={
              <Button
                type="link"
                size="small"
                style={{ color: '#6C5CE7', padding: 0 }}
                onClick={() => navigate(evaluationsRoute)}
              >
                Ver todas <RightOutlined />
              </Button>
            }
          >
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
                <Spin />
              </div>
            ) : (
              <List
                dataSource={stats?.recentEvaluations ?? []}
                locale={{ emptyText: 'Nenhuma avaliação encontrada' }}
                renderItem={(evaluation, idx) => (
                  <List.Item
                    style={{
                      padding: '14px 24px',
                      cursor: 'pointer',
                      borderBottom:
                        idx < (stats?.recentEvaluations.length ?? 1) - 1
                          ? '1px solid #fafafa'
                          : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => navigate(evaluationsRoute)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ background: '#ede9fe', flexShrink: 0 }}
                          icon={<FormOutlined style={{ color: '#6C5CE7' }} />}
                          size={38}
                        />
                      }
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <Text style={{ fontSize: 13.5, color: '#2D3436', fontWeight: 600 }}>
                            {evaluation.title}
                          </Text>
                          <Tag
                            color="purple"
                            style={{ borderRadius: 20, margin: 0, fontSize: 11 }}
                          >
                            {evaluation.evaluationNumber}
                          </Tag>
                        </div>
                      }
                      description={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            flexWrap: 'wrap',
                            marginTop: 2,
                          }}
                        >
                          {evaluation.studentName && (
                            <Text style={{ fontSize: 12, color: '#636E72' }}>
                              {evaluation.studentName}
                            </Text>
                          )}
                          {evaluation.studentName && (
                            <span style={{ color: '#d1d5db', fontSize: 10 }}>•</span>
                          )}
                          <Text style={{ fontSize: 12, color: '#b2bec3' }}>
                            {new Date(evaluation.date + 'T12:00:00').toLocaleDateString('pt-BR')}
                          </Text>
                          {evaluation.specialismName && (
                            <>
                              <span style={{ color: '#d1d5db', fontSize: 10 }}>•</span>
                              <Text style={{ fontSize: 12, color: '#b2bec3' }}>
                                {evaluation.specialismName}
                              </Text>
                            </>
                          )}
                        </div>
                      }
                    />
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 18,
                        color: gradeColor(evaluation.grade),
                        minWidth: 42,
                        textAlign: 'right',
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
            title={<span style={{ fontWeight: 600, color: '#2D3436' }}>Ações Rápidas</span>}
            style={{ borderRadius: 12, border: '1px solid #f0f0f0', height: '100%' }}
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.route)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: '#fafafa',
                    border: '1px solid #f0f0f0',
                    borderRadius: 8,
                    padding: '12px 14px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f3ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fafafa')}
                >
                  <span style={{ fontSize: 15, color: '#6C5CE7', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {action.icon}
                  </span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: '#2D3436' }}>
                    {action.label}
                  </span>
                  <ArrowRightOutlined style={{ fontSize: 10, color: '#b2bec3', marginLeft: 'auto' }} />
                </button>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
