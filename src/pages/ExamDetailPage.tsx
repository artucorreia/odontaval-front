import { useEffect, useState } from 'react';
import { Card, Button, Typography, Tag, Descriptions, Breadcrumb, Spin, Alert, Tabs } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  ExperimentOutlined,
  BarChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { fetchExamDashboardData } from '../services/examDashboardService';
import type { ExamDashboardData } from '../types/examDashboard';
import ExamOverviewCards from '../components/exam-dashboard/ExamOverviewCards';
import ExamHistogramChart from '../components/exam-dashboard/ExamHistogramChart';
import ExamCriteriaChart from '../components/exam-dashboard/ExamCriteriaChart';
import ExamRadarComparison from '../components/exam-dashboard/ExamRadarComparison';
import ExamStudentsTable from '../components/exam-dashboard/ExamStudentsTable';
import ExamEvaluationsSection from '../components/exam-evaluations/ExamEvaluationsSection';

const { Title, Text } = Typography;

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<ExamDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const examId = Number(id);

  useEffect(() => {
    if (!examId) return;
    setLoading(true);
    setError(null);
    fetchExamDashboardData(examId)
      .then(setData)
      .catch(() => setError('Não foi possível carregar os dados do exame.'))
      .finally(() => setLoading(false));
  }, [examId]);

  const exam = data?.exam ?? null;

  const DashboardContent = () => (
    <div className="space-y-4">
      {data && <ExamOverviewCards stats={data.overviewStats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data && (
          <ExamHistogramChart
            data={data.histogramData}
            totalStudents={data.overviewStats.totalStudents}
          />
        )}
        {data && (
          <ExamRadarComparison
            data={data.radarData}
            examTitle={exam?.title ?? 'Este Exame'}
            semester={exam?.academicSemester ?? 'Semestre'}
          />
        )}
      </div>

      {data && <ExamCriteriaChart data={data.criteriaData} />}

      {data && (
        <ExamStudentsTable
          data={data.studentsData}
          approvalCutoff={data.overviewStats.approvalCutoff}
          exam={data.exam}
        />
      )}
    </div>
  );

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/exames')}>Exames</a> },
          { title: exam?.title ?? 'Dashboard' },
        ]}
        style={{ marginBottom: 16 }}
      />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/exames')} />
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#2D3436' }}>
              {exam?.title ?? 'Carregando...'}
            </Title>
            {exam && (
              <Text style={{ color: '#636E72', fontSize: 13 }}>
                {exam.specialism?.name && (
                  <Tag color="purple" style={{ marginRight: 6 }}>
                    {exam.specialism.name}
                  </Tag>
                )}
                {exam.academicSemester} ·{' '}
                {new Date(exam.date + 'T12:00:00').toLocaleDateString('pt-BR')}
              </Text>
            )}
          </div>
        </div>
        {exam && (
          <div
            style={{
              background: '#f9f7ff',
              borderRadius: 10,
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#6C5CE7',
            }}
          >
            <ExperimentOutlined />
            <span className="hidden sm:inline">{exam.procedurePerformed}</span>
          </div>
        )}
      </div>

      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} showIcon />}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spin size="large" tip="Carregando..." />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Exam Info */}
          {exam && (
            <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
              <Descriptions
                size="small"
                column={{ xs: 1, sm: 2, md: 4 }}
                labelStyle={{ color: '#636E72', fontSize: 13 }}
              >
                <Descriptions.Item label="Unidade">{exam.serviceUnit}</Descriptions.Item>
                <Descriptions.Item label="Procedimento">
                  {exam.procedurePerformed}
                </Descriptions.Item>
                <Descriptions.Item label="Semestre">{exam.academicSemester}</Descriptions.Item>
                <Descriptions.Item label="Objetivos">
                  <span style={{ fontSize: 12 }}>{exam.goals}</span>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {/* Tabs: Dashboard + Avaliações */}
          <Tabs
            defaultActiveKey="dashboard"
            size="large"
            items={[
              {
                key: 'dashboard',
                label: (
                  <span>
                    <BarChartOutlined style={{ marginRight: 6 }} />
                    Dashboard Analítico
                  </span>
                ),
                children: <DashboardContent />,
              },
              {
                key: 'avaliacoes',
                label: (
                  <span>
                    <FileTextOutlined style={{ marginRight: 6 }} />
                    Avaliações
                  </span>
                ),
                children: (
                  <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
                    <ExamEvaluationsSection examId={examId} exam={exam} />
                  </Card>
                ),
              },
            ]}
            style={{ background: 'transparent' }}
          />
        </div>
      )}
    </div>
  );
}
