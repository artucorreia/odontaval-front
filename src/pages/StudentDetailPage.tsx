import { Card, Button, Typography, Tag, Avatar, Descriptions, Breadcrumb } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import { MOCK_STUDENTS, MOCK_EVALUATIONS } from '../utils/mockData';

const { Title } = Typography;

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = MOCK_STUDENTS.find((s) => s.id === id) ?? MOCK_STUDENTS[0];
  const evaluations = MOCK_EVALUATIONS.filter((e) => e.studentId === student.id);

  const initials = student.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  const avgScore = evaluations.length
    ? evaluations.reduce((acc, e) => acc + e.concept, 0) / evaluations.length
    : 0;

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/alunos')}>Alunos</a> },
          { title: student.name },
        ]}
        style={{ marginBottom: 16 }}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/alunos')} />
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#2D3436' }}>
            Detalhes do Aluno
          </Title>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile Card */}
        <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
          <div className="text-center mb-4">
            <Avatar style={{ background: '#6C5CE7', fontSize: 24, fontWeight: 700 }} size={72}>
              {initials}
            </Avatar>
            <Title level={4} style={{ margin: '12px 0 4px', color: '#2D3436' }}>
              {student.name}
            </Title>
            <Tag className="tag-role-aluno rounded-full mb-4">Aluno</Tag>
          </div>

          <Descriptions column={1} size="small" labelStyle={{ color: '#636E72', fontSize: 13 }}>
            <Descriptions.Item label="E-mail">{student.email}</Descriptions.Item>
            <Descriptions.Item label="Média Geral">
              <span style={{ color: '#6C5CE7', fontWeight: 600 }}>{avgScore.toFixed(1)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Avaliações">{evaluations.length}</Descriptions.Item>
          </Descriptions>

        </Card>

        {/* Evaluations History */}
        <Card
          style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
          className="lg:col-span-2"
          title={<span className="font-semibold">Histórico de Avaliações</span>}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="small"
              style={{ background: '#6C5CE7', borderColor: '#6C5CE7', borderRadius: 6 }}
              onClick={() => navigate('/avaliacoes/nova')}
            >
              Nova Avaliação
            </Button>
          }
        >
          {evaluations.length === 0 ? (
            <div className="text-center py-8 text-muted">
              <CalendarOutlined style={{ fontSize: 32, marginBottom: 8 }} />
              <p>Nenhuma avaliação registrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {evaluations.map((ev) => (
                <Card
                  key={ev.id}
                  size="small"
                  style={{ borderRadius: 8, border: '1px solid #f0f0f0', background: '#fafafa' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div
                        style={{
                          background: '#6C5CE7',
                          color: 'white',
                          borderRadius: 6,
                          padding: '4px 10px',
                          textAlign: 'center',
                          minWidth: 52,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {ev.exam?.date
                          ? new Date(ev.exam.date)
                              .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                              .toUpperCase()
                          : '--'}
                      </div>
                      <div>
                        <div className="font-semibold text-secondary text-sm">
                          {ev.exam?.title ?? 'Avaliação Clínica'}
                        </div>
                        <div className="text-xs text-muted">
                          {ev.exam?.specialism?.name} • Prof. {ev.exam?.professor?.name}
                        </div>
                        <div className="text-xs text-muted mt-1">{ev.observations}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#6C5CE7' }}>
                        {ev.concept.toFixed(1)}
                      </div>
                      <Button
                        size="small"
                        style={{
                          borderColor: '#6C5CE7',
                          color: '#6C5CE7',
                          borderRadius: 6,
                          fontSize: 11,
                        }}
                        onClick={() => navigate(`/avaliacoes/${ev.id}`)}
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
