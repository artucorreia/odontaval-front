import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Typography,
  Breadcrumb,
  Row,
  Col,
  InputNumber,
  message,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { evaluationService, userService, specialismService } from '../services/api';
import type { User, Specialism, CreateEvaluationRequest } from '../types';
const { Title, Text } = Typography;
const { TextArea } = Input;

const EVALUATION_PERIODS = ['AV1', 'AV2', 'AV3'];

const CRITERIA: { key: keyof Pick<CreateEvaluationRequest, 'punctuality' | 'instrumental' | 'boxOrganization' | 'biosecurity' | 'ethics' | 'concept'>; label: string }[] = [
  { key: 'punctuality', label: 'Pontualidade' },
  { key: 'instrumental', label: 'Instrumental' },
  { key: 'boxOrganization', label: 'Organização do Box' },
  { key: 'biosecurity', label: 'Biossegurança' },
  { key: 'ethics', label: 'Ética' },
  { key: 'concept', label: 'Conceito' },
];

const CRITERIA_KEYS = CRITERIA.map((c) => c.key);

function calcGrade(values: Record<string, number>): number {
  const sum = CRITERIA_KEYS.reduce((acc, k) => acc + (values[k] ?? 0), 0);
  return parseFloat((10 + sum).toFixed(2));
}

export default function NewEvaluationPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<User[]>([]);
  const [specialisms, setSpecialisms] = useState<Specialism[]>([]);

  useEffect(() => {
    userService
      .findAll('STUDENT')
      .then((res) => setStudents(res.data?.data ?? []))
      .catch(() => {});

    specialismService
      .findAll()
      .then((res) => setSpecialisms(res.data?.data ?? []))
      .catch(() => {});
  }, []);

  const handleCriteriaChange = () => {
    const values = form.getFieldsValue(CRITERIA_KEYS);
    const computed = calcGrade(values);
    form.setFieldValue('grade', computed);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload: CreateEvaluationRequest = {
        title: values.title,
        punctuality: values.punctuality,
        instrumental: values.instrumental,
        boxOrganization: values.boxOrganization,
        biosecurity: values.biosecurity,
        ethics: values.ethics,
        concept: values.concept,
        grade: values.grade,
        observations: values.observations ?? undefined,
        evaluationNumber: values.evaluationNumber,
        date: values.date?.format('YYYY-MM-DD') ?? '',
        academicSemester: values.academicSemester,
        goals: values.goals,
        box: values.box,
        procedurePerformed: values.procedurePerformed,
        studentId: values.studentId,
        specialismId: values.specialismId,
      };

      await evaluationService.create(payload);
      message.success('Avaliação salva com sucesso!');
      navigate('/avaliacoes');
    } catch {
      message.error('Preencha todos os campos obrigatórios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { title: <a onClick={() => navigate('/avaliacoes')}>Avaliações</a> },
          { title: 'Nova Avaliação' },
        ]}
        style={{ marginBottom: 16 }}
      />

      <div className="flex items-center gap-3 mb-6">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/avaliacoes')} />
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#2D3436' }}>
            Nova Avaliação
          </Title>
          <Text style={{ color: '#636E72' }}>Preencha os dados da avaliação clínica</Text>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        size="large"
        onValuesChange={(changed) => {
          if (CRITERIA_KEYS.some((k) => k in changed)) handleCriteriaChange();
        }}
      >
        <Row gutter={[16, 0]}>
          {/* Left: Form data */}
          <Col xs={24} lg={14}>
            <Card
              title="Dados da Avaliação"
              style={{ borderRadius: 12, border: '1px solid #f0f0f0', marginBottom: 16 }}
            >
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    label="Título da Avaliação"
                    name="title"
                    rules={[{ required: true, message: 'Informe o título' }]}
                  >
                    <Input placeholder="Ex: Avaliação clínica AV1" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Período Avaliativo"
                    name="evaluationNumber"
                    rules={[{ required: true, message: 'Selecione o período' }]}
                  >
                    <Select placeholder="Selecione...">
                      {EVALUATION_PERIODS.map((p) => (
                        <Select.Option key={p} value={p}>
                          {p}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Semestre Letivo"
                    name="academicSemester"
                    rules={[{ required: true, message: 'Informe o semestre' }]}
                  >
                    <Select placeholder="Ex: 2026.1">
                      {['2026.1', '2026.2', '2025.2', '2025.1'].map((s) => (
                        <Select.Option key={s} value={s}>
                          {s}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Data da Avaliação"
                    name="date"
                    rules={[{ required: true, message: 'Informe a data' }]}
                  >
                    <DatePicker format="DD/MM/YYYY" style={{ width: '100%', borderRadius: 8 }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Box / Unidade de Atendimento"
                    name="box"
                    rules={[{ required: true, message: 'Informe o box' }]}
                  >
                    <Input placeholder="Ex: Box 12A" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Aluno"
                    name="studentId"
                    rules={[{ required: true, message: 'Selecione o aluno' }]}
                  >
                    <Select placeholder="Selecione o aluno..." showSearch optionFilterProp="label">
                      {students.map((s) => (
                        <Select.Option key={s.id} value={s.id} label={s.name}>
                          {s.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Especialidade"
                    name="specialismId"
                    rules={[{ required: true, message: 'Selecione a especialidade' }]}
                  >
                    <Select placeholder="Selecione...">
                      {specialisms.map((s) => (
                        <Select.Option key={s.id} value={s.id}>
                          {s.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    label="Procedimento Realizado"
                    name="procedurePerformed"
                    rules={[{ required: true, message: 'Informe o procedimento' }]}
                  >
                    <Input placeholder="Descreva o procedimento realizado..." />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    label="Objetivos da Avaliação"
                    name="goals"
                    rules={[{ required: true, message: 'Informe os objetivos' }]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Descreva os objetivos..."
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Observações" name="observations">
                    <TextArea
                      rows={3}
                      placeholder="Observações adicionais (opcional)..."
                      showCount
                      maxLength={1000}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right: Criteria scores */}
          <Col xs={24} lg={10}>
            <Card
              title="Critérios de Avaliação"
              style={{ borderRadius: 12, border: '1px solid #f0f0f0', marginBottom: 16 }}
            >
              <Text style={{ color: '#636E72', fontSize: 13, display: 'block', marginBottom: 16 }}>
                Atribua penalizações de <strong>0 a -10</strong> por critério. A nota final é
                calculada automaticamente: <strong>10 + (soma das penalizações)</strong>.
              </Text>

              {CRITERIA.map(({ key, label }) => (
                <Form.Item
                  key={key}
                  label={<span className="text-sm font-medium text-secondary">{label}</span>}
                  name={key}
                  initialValue={0}
                  rules={[
                    { required: true, message: `Informe ${label}` },
                    {
                      validator: (_, v) =>
                        v >= -10 && v <= 0
                          ? Promise.resolve()
                          : Promise.reject('Valor entre -10 e 0'),
                    },
                  ]}
                >
                  <InputNumber
                    min={-10}
                    max={0}
                    step={0.5}
                    style={{ width: '100%', borderRadius: 6 }}
                  />
                </Form.Item>
              ))}

              <div
                style={{
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: 16,
                  marginTop: 8,
                }}
              >
                <Form.Item
                  label={
                    <span className="text-sm font-semibold text-secondary">
                      Nota Final (0–10)
                    </span>
                  }
                  name="grade"
                  initialValue={10}
                  rules={[
                    { required: true, message: 'Informe a nota final' },
                    {
                      validator: (_, v) =>
                        v >= 0 && v <= 10
                          ? Promise.resolve()
                          : Promise.reject('Nota entre 0 e 10'),
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={10}
                    step={0.5}
                    style={{ width: '100%', borderRadius: 6, fontWeight: 700 }}
                    placeholder="Calculada automaticamente ou edite manualmente"
                  />
                </Form.Item>
                <Text style={{ fontSize: 12, color: '#636E72' }}>
                  A nota é calculada automaticamente ao preencher os critérios, mas pode ser
                  ajustada manualmente.
                </Text>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                block
                style={{ borderRadius: 8, height: 44 }}
                onClick={() => navigate('/avaliacoes')}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                block
                icon={<SaveOutlined />}
                loading={loading}
                style={{
                  background: '#6C5CE7',
                  borderColor: '#6C5CE7',
                  borderRadius: 8,
                  height: 44,
                }}
                onClick={handleSubmit}
              >
                Salvar Avaliação
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
