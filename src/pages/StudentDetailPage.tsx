import { useEffect, useState } from 'react';
import { Card, Button, Typography, Tag, Avatar, Descriptions, Breadcrumb, Spin, Alert } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { fetchStudentDashboardData } from '../services/studentDashboardService';
import type { StudentDashboardData } from '../types/studentDashboard';
import StudentOverviewCards from '../components/student-dashboard/StudentOverviewCards';
import StudentRadarChart from '../components/student-dashboard/StudentRadarChart';
import StudentProgressChart from '../components/student-dashboard/StudentProgressChart';
import StudentSpecialtyChart from '../components/student-dashboard/StudentSpecialtyChart';
import StudentComparisonChart from '../components/student-dashboard/StudentComparisonChart';
import StudentEvaluationTable from '../components/student-dashboard/StudentEvaluationTable';

const { Title } = Typography;

export default function StudentDetailPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const id = paramId ?? user?.id;
  const isSelfView = !paramId;
  const navigate = useNavigate();

  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchStudentDashboardData(id)
      .then(setData)
      .catch(() => setError('Não foi possível carregar os dados do aluno.'))
      .finally(() => setLoading(false));
  }, [id]);

  const student = data?.student;
  const initials = student
    ? student.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
    : '?';

  return (
    <div>
      {!isSelfView && (
        <Breadcrumb
          items={[
            { title: <a onClick={() => navigate('/alunos')}>Alunos</a> },
            { title: student?.name ?? 'Detalhes' },
          ]}
          style={{ marginBottom: 16 }}
        />
      )}

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {!isSelfView && (
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/alunos')} />
          )}
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#2D3436' }}>
            {isSelfView ? 'Meu Desempenho' : 'Detalhes do Aluno'}
          </Title>
        </div>
      </div>

      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spin size="large" tip="Carregando dashboard..." />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Profile + Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
              <div className="text-center mb-4">
                <Avatar style={{ background: '#6C5CE7', fontSize: 24, fontWeight: 700 }} size={72}>
                  {initials}
                </Avatar>
                <Title level={4} style={{ margin: '12px 0 4px', color: '#2D3436' }}>
                  {student?.name ?? '-'}
                </Title>
                <Tag className="rounded-full mb-4" color="purple">
                  Aluno
                </Tag>
              </div>
              <Descriptions column={1} size="small" labelStyle={{ color: '#636E72', fontSize: 13 }}>
                <Descriptions.Item label="E-mail">
                  <span style={{ fontSize: 12 }}>{student?.email ?? '-'}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Avaliações">
                  <span style={{ fontWeight: 600, color: '#6C5CE7' }}>
                    {data?.overviewStats.totalEvaluations ?? 0}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Média Geral">
                  <span style={{ fontWeight: 600, color: '#6C5CE7', fontSize: 15 }}>
                    {data?.overviewStats.avgConcept.toFixed(1) ?? '-'}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <div className="lg:col-span-3">
              {data && <StudentOverviewCards stats={data.overviewStats} />}
            </div>
          </div>

          {/* Progress Chart */}
          {data && <StudentProgressChart data={data.progressData} />}

          {/* Radar + Specialty Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data && <StudentRadarChart data={data.radarData} />}
            {data && <StudentSpecialtyChart data={data.specialtyData} />}
          </div>

          {/* Comparison Chart */}
          {data && (
            <StudentComparisonChart
              data={data.comparisonData}
              studentName={student?.name?.split(' ')[0] ?? 'Aluno'}
            />
          )}

          {/* History Table */}
          {data && <StudentEvaluationTable data={data.enrichedEvals} studentName={student?.name} />}
        </div>
      )}
    </div>
  );
}
