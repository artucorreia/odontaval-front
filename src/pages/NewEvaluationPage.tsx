import { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Typography,
  Breadcrumb,
  Slider,
  Row,
  Col,
  InputNumber,
  message,
  Upload,
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MOCK_STUDENTS, MOCK_EXAMS, MOCK_SPECIALISMS } from '../utils/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

const CRITERIA = [
  { key: 'punctuality', label: 'Pontualidade' },
  { key: 'instrumental', label: 'Instrumental' },
  { key: 'organizationOfServiceUnit', label: 'Organização do Box' },
  { key: 'biosecurity', label: 'Biossegurança' },
  { key: 'ethics', label: 'Ética' },
  { key: 'concept', label: 'Conceito Final' },
];

export default function NewEvaluationPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800)); // Simulate API
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

      <Form form={form} layout="vertical" size="large">
        <Row gutter={[16, 0]}>
          {/* Left: Form data */}
          <Col xs={24} lg={14}>
            <Card
              title="Dados da Avaliação"
              style={{ borderRadius: 12, border: '1px solid #f0f0f0', marginBottom: 16 }}
            >
              <Row gutter={16}>
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
                    label="Tipo de Avaliação"
                    name="examId"
                    rules={[{ required: true, message: 'Selecione o exame' }]}
                  >
                    <Select placeholder="Selecione..." style={{ borderRadius: 8 }}>
                      {MOCK_EXAMS.map((e) => (
                        <Select.Option key={e.id} value={e.id}>
                          {e.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Aluno"
                    name="studentId"
                    rules={[{ required: true, message: 'Selecione o aluno' }]}
                  >
                    <Select placeholder="Selecione o aluno..." showSearch optionFilterProp="label">
                      {MOCK_STUDENTS.map((s) => (
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
                      {MOCK_SPECIALISMS.map((s) => (
                        <Select.Option key={s.id} value={s.id}>
                          {s.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Unidade de Atendimento (Box)"
                    name="serviceUnit"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Ex: Box 01" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Semestre Letivo"
                    name="academicSemester"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Ex: 2025.1">
                      {['2025.1', '2025.2', '2024.2', '2024.1'].map((s) => (
                        <Select.Option key={s} value={s}>
                          {s}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    label="Procedimento Realizado"
                    name="procedurePerformed"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Descreva o procedimento realizado..." />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    label="Objetivos da Avaliação"
                    name="goals"
                    rules={[{ required: true }]}
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

              {/* Attachments */}
              <Form.Item label="Anexos (opcional)" name="attachments">
                <Dragger multiple beforeUpload={() => false} style={{ borderRadius: 8 }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: '#6C5CE7' }} />
                  </p>
                  <p style={{ color: '#636E72', fontSize: 13 }}>
                    Clique para anexar arquivos ou arraste e solte
                  </p>
                </Dragger>
              </Form.Item>
            </Card>
          </Col>

          {/* Right: Scores */}
          <Col xs={24} lg={10}>
            <Card
              title="Critérios de Avaliação"
              style={{ borderRadius: 12, border: '1px solid #f0f0f0', marginBottom: 16 }}
            >
              <Text style={{ color: '#636E72', fontSize: 13, display: 'block', marginBottom: 16 }}>
                Atribua notas de 0 a 10 para cada critério
              </Text>

              {CRITERIA.map(({ key, label }) => (
                <Form.Item
                  key={key}
                  label={<span className="text-sm font-medium text-secondary">{label}</span>}
                  name={key}
                  initialValue={7}
                  rules={[{ required: true, message: `Informe ${label}` }]}
                >
                  <div className="flex items-center gap-3">
                    <Slider
                      min={0}
                      max={10}
                      step={0.5}
                      style={{ flex: 1 }}
                      trackStyle={{ background: '#6C5CE7' }}
                      handleStyle={{ borderColor: '#6C5CE7' }}
                    />
                    <Form.Item name={key} noStyle>
                      <InputNumber
                        min={0}
                        max={10}
                        step={0.5}
                        style={{ width: 64, borderRadius: 6 }}
                      />
                    </Form.Item>
                  </div>
                </Form.Item>
              ))}
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
