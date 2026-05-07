import { useState, useEffect } from 'react';
import { Select, Typography, Spin, Alert } from 'antd';
import { fetchSemesterDashboardData, AVAILABLE_SEMESTERS } from '../services/semesterDashboardService';
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
  const [semester, setSemester] = useState('2025.1');
  const [data, setData] = useState<SemesterDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchSemesterDashboardData(semester)
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setError('Erro ao carregar dados do semestre.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [semester]);

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
          value={semester}
          onChange={setSemester}
          style={{ width: 130 }}
          options={AVAILABLE_SEMESTERS.map((s) => ({ value: s, label: s }))}
        />
      </div>

      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

      {data?.usedMock && (
        <Alert
          type="warning"
          message="Usando dados de demonstração (API indisponível)"
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center" style={{ minHeight: 400 }}>
          <Spin size="large" />
        </div>
      ) : data ? (
        <div className="flex flex-col gap-4">
          {/* KPI Cards */}
          <SemesterOverviewCards kpis={data.kpis} />

          {/* Evaluations over time + Average trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SemesterEvaluationsChart data={data.evaluationsOverTime} />
            <SemesterAverageTrendChart data={data.averageTrend} />
          </div>

          {/* Specialty performance + Concept distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SemesterSpecialtyChart data={data.specialtyPerformance} />
            <SemesterConceptDistributionChart data={data.conceptDistribution} />
          </div>

          {/* Criteria comparison (full width) */}
          <SemesterCriteriaComparison data={data.criteriaComparison} />

          {/* Activity heatmap + Top students */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SemesterActivityHeatmap data={data.heatmap} />
            <SemesterTopStudents data={data.topStudents} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
