import { useEffect, useMemo, useState } from 'react';
import { Card, Button, Typography, Tag, Avatar, Descriptions, Breadcrumb, Spin, Alert, Empty, Select } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchStudentDashboardData,
  computeOverviewStats,
  computeRadarData,
  computeProgressData,
  computeSpecialtyData,
  computeClassComparison,
  computePeriodStats,
} from '../services/studentDashboardService';
import type { StudentDashboardData } from '../types/studentDashboard';
import StudentOverviewCards from '../components/student-dashboard/StudentOverviewCards';
import StudentRadarChart from '../components/student-dashboard/StudentRadarChart';
import StudentProgressChart from '../components/student-dashboard/StudentProgressChart';
import StudentSpecialtyChart from '../components/student-dashboard/StudentSpecialtyChart';
import StudentComparisonChart from '../components/student-dashboard/StudentComparisonChart';
import StudentEvaluationTable from '../components/student-dashboard/StudentEvaluationTable';
import StudentPeriodBreakdown from '../components/student-dashboard/StudentPeriodBreakdown';

const { Title, Text } = Typography;

const SEMESTER_ALL = 'ALL';

export default function StudentDetailPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const id = paramId ?? user?.id;
  const isSelfView = !paramId;
  const navigate = useNavigate();

  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSemester, setActiveSemester] = useState<string>(SEMESTER_ALL);

  const fetchData = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchStudentDashboardData(id)
      .then((result) => {
        setData(result);
        setActiveSemester(SEMESTER_ALL);
      })
      .catch(() =>
        setError('Não foi possível carregar os dados do aluno. Verifique a conexão com o servidor.'),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ── semester-filtered evaluations ─────────────────────────────────────────

  const filteredStudentEvals = useMemo(() => {
    if (!data) return [];
    return activeSemester === SEMESTER_ALL
      ? data.enrichedEvals
      : data.enrichedEvals.filter((e) => e.academicSemester === activeSemester);
  }, [data, activeSemester]);

  // ── re-computed stats for the active semester ─────────────────────────────

  const displayStats = useMemo(
    () => computeOverviewStats(filteredStudentEvals),
    [filteredStudentEvals],
  );
  const displayRadar = useMemo(
    () => computeRadarData(filteredStudentEvals),
    [filteredStudentEvals],
  );
  const displayProgress = useMemo(
    () => computeProgressData(filteredStudentEvals),
    [filteredStudentEvals],
  );
  const displaySpecialty = useMemo(
    () => computeSpecialtyData(filteredStudentEvals),
    [filteredStudentEvals],
  );
  const displayComparison = useMemo(
    () => data ? computeClassComparison(filteredStudentEvals, data.classAverages) : [],
    [filteredStudentEvals, data],
  );
  const displayPeriods = useMemo(
    () => computePeriodStats(filteredStudentEvals),
    [filteredStudentEvals],
  );

  // ── derived values ────────────────────────────────────────────────────────

  const student = data?.student;
  const initials = student
    ? student.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
    : '?';

  const hasEvaluations = filteredStudentEvals.length > 0;

  const listHref = window.location.pathname.startsWith('/admin') ? '/admin/usuarios' : '/alunos';
  const listLabel = window.location.pathname.startsWith('/admin') ? 'Usuários' : 'Alunos';

  return (
    <div>
      {!isSelfView && (
        <Breadcrumb
          items={[
            { title: <a onClick={() => navigate(listHref)}>{listLabel}</a> },
            { title: student?.name ?? 'Detalhes' },
          ]}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {!isSelfView && (
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/alunos')} />
          )}
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#2D3436' }}>
              {isSelfView ? 'Meu Desempenho' : 'Detalhes do Aluno'}
            </Title>
            {student && (
              <Text style={{ color: '#636E72' }}>{student.email}</Text>
            )}
          </div>
        </div>

        {/* Semester filter */}
        {data && data.availableSemesters.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FilterOutlined style={{ color: '#636E72', fontSize: 14 }} />
            <Select
              value={activeSemester}
              onChange={setActiveSemester}
              style={{ minWidth: 150 }}
              size="middle"
              options={[
                { label: 'Todos os semestres', value: SEMESTER_ALL },
                ...data.availableSemesters.map((s) => ({ label: s, value: s })),
              ]}
            />
          </div>
        )}
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchData}>
              Tentar novamente
            </Button>
          }
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spin size="large" tip="Carregando dashboard..." />
        </div>
      ) : (
        !error && (
          <div className="space-y-4">
            {/* ── Profile + Overview Cards ──────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
                <div className="text-center mb-4">
                  <Avatar
                    style={{ background: '#6C5CE7', fontSize: 24, fontWeight: 700 }}
                    size={72}
                  >
                    {initials}
                  </Avatar>
                  <Title level={4} style={{ margin: '12px 0 4px', color: '#2D3436' }}>
                    {student?.name ?? '—'}
                  </Title>
                  <Tag className="rounded-full mb-4" color="purple">
                    Aluno
                  </Tag>
                </div>
                <Descriptions column={1} size="small" labelStyle={{ color: '#636E72', fontSize: 13 }}>
                  <Descriptions.Item label="E-mail">
                    <span style={{ fontSize: 12 }}>{student?.email ?? '—'}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Avaliações">
                    <span style={{ fontWeight: 600, color: '#6C5CE7' }}>
                      {displayStats.totalEvaluations}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Média Geral">
                    <span style={{ fontWeight: 600, color: '#6C5CE7', fontSize: 15 }}>
                      {hasEvaluations ? displayStats.avgGrade.toFixed(1) : '—'}
                    </span>
                  </Descriptions.Item>
                  {student?.createdAt && (
                    <Descriptions.Item label="Membro desde">
                      <span style={{ fontSize: 12 }}>
                        {new Date(student.createdAt).toLocaleDateString('pt-BR', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>

              <div className="lg:col-span-3">
                <StudentOverviewCards stats={displayStats} />
              </div>
            </div>

            {/* ── Period Breakdown ──────────────────────────────────── */}
            {displayPeriods.length > 0 && (
              <StudentPeriodBreakdown data={displayPeriods} />
            )}

            {/* ── Empty state when no evaluations ─────────────────── */}
            {!hasEvaluations ? (
              <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
                <Empty
                  description={
                    activeSemester === SEMESTER_ALL
                      ? 'Nenhuma avaliação registrada para este aluno'
                      : `Nenhuma avaliação registrada em ${activeSemester}`
                  }
                  style={{ padding: '32px 0' }}
                />
              </Card>
            ) : (
              <>
                {/* Progress Chart */}
                <StudentProgressChart data={displayProgress} />

                {/* Radar + Specialty Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <StudentRadarChart data={displayRadar} />
                  <StudentSpecialtyChart data={displaySpecialty} />
                </div>

                {/* Comparison Chart */}
                <StudentComparisonChart
                  data={displayComparison}
                  studentName={student?.name?.split(' ')[0] ?? 'Aluno'}
                />

                {/* History Table */}
                <StudentEvaluationTable data={filteredStudentEvals} />
              </>
            )}
          </div>
        )
      )}
    </div>
  );
}
