import { useState, useEffect, useCallback } from 'react';
import { Select, Typography, Spin, Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { fetchSemesterDashboard } from '../services/semesterDashboardService';
import type { SemesterDashboardData } from '../types/semesterDashboard';
import SemesterOverviewCards from '../components/semester-dashboard/SemesterOverviewCards';
import SemesterEvaluationsChart from '../components/semester-dashboard/SemesterEvaluationsChart';
import SemesterSpecialtyChart from '../components/semester-dashboard/SemesterSpecialtyChart';
import SemesterAverageTrendChart from '../components/semester-dashboard/SemesterAverageTrendChart';
import SemesterConceptDistributionChart from '../components/semester-dashboard/SemesterConceptDistributionChart';
import SemesterCriteriaComparison from '../components/semester-dashboard/SemesterCriteriaComparison';
import SemesterActivityHeatmap from '../components/semester-dashboard/SemesterActivityHeatmap';
import SemesterTopStudents from '../components/semester-dashboard/SemesterTopStudents';

const { Title, Text } = Typography;

export default function ReportsPage() {
  const [semester, setSemester] = useState<string | null>(null);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [data, setData] = useState<SemesterDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((sem?: string) => {
    setLoading(true);
    setError(null);
    fetchSemesterDashboard(sem)
      .then((d) => {
        setData(d);
        setSemesters(d.availableSemesters);
        setSemester(d.semester ?? null);
      })
      .catch(() => setError('Erro ao carregar dados. Verifique a conexão com o servidor.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSemesterChange = (newSem: string) => {
    setSemester(newSem);
    load(newSem);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
            Dashboard do Semestre
          </Title>
          <Text style={{ color: '#636E72' }}>Análise consolidada de avaliações e desempenho</Text>
        </div>
        <Select
          value={semester ?? undefined}
          onChange={handleSemesterChange}
          style={{ width: 130 }}
          loading={loading}
          disabled={loading || semesters.length === 0}
          options={semesters.map((s) => ({ value: s, label: s }))}
          placeholder="Semestre"
        />
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={() => load(semester ?? undefined)}>
              Tentar novamente
            </Button>
          }
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: 400 }}>
          <Spin size="large" />
        </div>
      ) : !data || data.kpis.totalEvaluations === 0 ? (
        <div
          style={{
            minHeight: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#b2bec3', fontSize: 15 }}>
            {semester
              ? `Nenhuma avaliação encontrada para o semestre ${semester}.`
              : 'Nenhuma avaliação cadastrada no sistema.'}
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <SemesterOverviewCards kpis={data.kpis} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SemesterEvaluationsChart data={data.evaluationsOverTime} />
            <SemesterAverageTrendChart data={data.averageTrend} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SemesterSpecialtyChart data={data.specialtyPerformance} />
            <SemesterConceptDistributionChart data={data.conceptDistribution} />
          </div>

          <SemesterCriteriaComparison data={data.criteriaComparison} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SemesterActivityHeatmap data={data.heatmap} />
            <SemesterTopStudents data={data.topStudents} />
          </div>
        </div>
      )}
    </div>
  );
}
