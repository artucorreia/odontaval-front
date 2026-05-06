import { useState } from 'react';
import { Card, Row, Col, Select, Typography, Empty } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { MOCK_EVALUATIONS, MOCK_SPECIALISMS } from '../utils/mockData';

const { Title, Text } = Typography;

const COLORS = ['#6C5CE7', '#00B894', '#0984e3', '#fdcb6e', '#e17055', '#a29bfe'];

const evalsBySpecialism = MOCK_SPECIALISMS.map((sp) => ({
  name: sp.name,
  total: MOCK_EVALUATIONS.filter((e) => e.exam?.specialismId === sp.id).length,
  media: Number(
    (
      MOCK_EVALUATIONS.filter((e) => e.exam?.specialismId === sp.id).reduce(
        (acc, e) => acc + e.concept,
        0,
      ) / (MOCK_EVALUATIONS.filter((e) => e.exam?.specialismId === sp.id).length || 1)
    ).toFixed(1),
  ),
}));

const scoresOverTime = [
  { mes: 'Jan', media: 7.8 },
  { mes: 'Fev', media: 8.1 },
  { mes: 'Mar', media: 7.9 },
  { mes: 'Abr', media: 8.5 },
  { mes: 'Mai', media: 8.7 },
];

const topStudents = [
  { name: 'Ana Clara', avaliacoes: 12 },
  { name: 'Maria Souza', avaliacoes: 10 },
  { name: 'Marcos V.', avaliacoes: 9 },
  { name: 'Juliana O.', avaliacoes: 8 },
  { name: 'Carlos H.', avaliacoes: 7 },
];

const pieData = evalsBySpecialism.filter((e) => e.total > 0);

export default function ReportsPage() {
  const [semester, setSemester] = useState('2025.1');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
            Relatórios
          </Title>
          <Text style={{ color: '#636E72' }}>Análise gráfica das avaliações</Text>
        </div>
        <Select value={semester} onChange={setSemester} style={{ width: 120 }}>
          {['2025.1', '2025.2', '2024.2'].map((s) => (
            <Select.Option key={s} value={s}>
              {s}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        {/* Evaluations by Specialism - Bar */}
        <Col xs={24} lg={14}>
          <Card
            title="Avaliações por Especialidade"
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
          >
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={evalsBySpecialism} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total" fill="#6C5CE7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="media" name="Média" fill="#00B894" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Pie chart */}
        <Col xs={24} lg={10}>
          <Card
            title="Distribuição por Especialidade"
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
          >
            {pieData.length === 0 ? (
              <Empty description="Sem dados disponíveis" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="total"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        {/* Score evolution - Line */}
        <Col xs={24} lg={14}>
          <Card
            title="Evolução das Médias ao Longo do Tempo"
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={scoresOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis domain={[6, 10]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="media"
                  name="Média Geral"
                  stroke="#6C5CE7"
                  strokeWidth={2.5}
                  dot={{ fill: '#6C5CE7', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Top students */}
        <Col xs={24} lg={10}>
          <Card
            title="Top 5 Alunos com Mais Avaliações Positivas"
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                layout="vertical"
                data={topStudents}
                margin={{ left: 10, right: 20, top: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Bar
                  dataKey="avaliacoes"
                  name="Avaliações Positivas"
                  fill="#6C5CE7"
                  radius={[0, 4, 4, 0]}
                >
                  {topStudents.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
