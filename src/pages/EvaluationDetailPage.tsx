import { Card, Row, Col, Typography, Tag, Breadcrumb, Button, Descriptions, Progress } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { MOCK_EVALUATIONS } from '../utils/mockData';

const { Title, Text } = Typography;

const CRITERIA_LABELS: Record<string, string> = {
  punctuality: 'Pontualidade',
  instrumental: 'Instrumental',
  organizationOfServiceUnit: 'Organização do Box',
  biosecurity: 'Biossegurança',
  ethics: 'Ética',
  concept: 'Conceito Final',
};

const scoreColor = (v: number) => {
  if (v >= 8) return '#00B894';
  if (v >= 6) return '#f6b93b';
  return '#E17055';
};

export default function EvaluationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const evaluation = MOCK_EVALUATIONS.find((e) => String(e.id) === id) ?? MOCK_EVALUATIONS[0];

  const criteria = [
    { key: 'punctuality', value: evaluation.punctuality },
    { key: 'instrumental', value: evaluation.instrumental },
    { key: 'organizationOfServiceUnit', value: evaluation.organizationOfServiceUnit },
    { key: 'biosecurity', value: evaluation.biosecurity },
    { key: 'ethics', value: evaluation.ethics },
  ];

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/avaliacoes')}>Avaliações</a> },
          { title: `Avaliação #${evaluation.id}` },
        ]}
        style={{ marginBottom: 16 }}
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/avaliacoes')}
          />
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#2D3436' }}>
            Detalhe da Avaliação #{evaluation.id}
          </Title>
        </div>
        <Button
          icon={<EditOutlined />}
          style={{ borderColor: '#6C5CE7', color: '#6C5CE7', borderRadius: 8 }}
          onClick={() => navigate(`/avaliacoes/${evaluation.id}/editar`)}
        >
          Editar
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
            <div className="text-center mb-4">
              <div style={{ fontSize: 48, fontWeight: 700, color: '#6C5CE7', lineHeight: 1.2 }}>
                {evaluation.concept.toFixed(1)}
              </div>
              <Text style={{ color: '#636E72', fontSize: 13 }}>Conceito Final</Text>
              <div className="mt-2">
                <Tag
                  color={
                    evaluation.concept >= 8
                      ? 'success'
                      : evaluation.concept >= 6
                        ? 'warning'
                        : 'error'
                  }
                  style={{ borderRadius: 20 }}
                >
                  {evaluation.concept >= 8
                    ? 'Ótimo'
                    : evaluation.concept >= 6
                      ? 'Regular'
                      : 'Insuficiente'}
                </Tag>
              </div>
            </div>

            <Descriptions column={1} size="small" labelStyle={{ color: '#636E72', fontSize: 13 }}>
              <Descriptions.Item label="Aluno">{evaluation.student?.name ?? '—'}</Descriptions.Item>
              <Descriptions.Item label="Especialidade">
                {evaluation.exam?.specialism?.name ?? '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Professor">
                {evaluation.exam?.professor?.name ?? '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Data">
                {evaluation.exam?.date
                  ? new Date(evaluation.exam.date).toLocaleDateString('pt-BR')
                  : '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Semestre">
                {evaluation.exam?.academicSemester ?? '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Unidade">
                {evaluation.exam?.serviceUnit ?? '—'}
              </Descriptions.Item>
              <Descriptions.Item label="Procedimento">
                {evaluation.exam?.procedurePerformed ?? '—'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title="Critérios Avaliados"
            style={{ borderRadius: 12, border: '1px solid #f0f0f0', marginBottom: 16 }}
          >
            <div className="space-y-4">
              {criteria.map(({ key, value }) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <Text style={{ fontSize: 14, color: '#2D3436' }}>{CRITERIA_LABELS[key]}</Text>
                    <Text style={{ fontWeight: 600, color: scoreColor(value) }}>
                      {value.toFixed(1)}
                    </Text>
                  </div>
                  <Progress
                    percent={value * 10}
                    showInfo={false}
                    strokeColor={scoreColor(value)}
                    trailColor="#f0f0f0"
                    strokeWidth={8}
                    style={{ borderRadius: 4 }}
                  />
                </div>
              ))}
            </div>
          </Card>

          {evaluation.observations && (
            <Card title="Observações" style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
              <Text style={{ color: '#636E72', fontSize: 14 }}>{evaluation.observations}</Text>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
