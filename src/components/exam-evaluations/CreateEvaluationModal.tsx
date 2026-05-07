import { Modal, Form, Select, InputNumber, Input, Row, Col, Typography } from 'antd';
import type { CreateEvaluationValues } from './types';
import { EVAL_CRITERIA } from './types';
import { MOCK_STUDENTS } from '../../utils/mockData';

interface Props {
  open: boolean;
  loading: boolean;
  examTitle?: string;
  onSubmit: (values: CreateEvaluationValues) => Promise<void>;
  onCancel: () => void;
}

const { Text } = Typography;
const { TextArea } = Input;

const SCORE_CRITERIA = EVAL_CRITERIA.filter((c) => c.key !== 'observations');

export default function CreateEvaluationModal({ open, loading, examTitle, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm<CreateEvaluationValues>();

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Nova Avaliação"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Salvar Avaliação"
      cancelText="Cancelar"
      confirmLoading={loading}
      okButtonProps={{ style: { background: '#6C5CE7', borderColor: '#6C5CE7' } }}
      width={560}
    >
      {examTitle && (
        <div
          style={{
            background: '#f9f7ff',
            borderRadius: 8,
            padding: '8px 14px',
            marginBottom: 16,
            fontSize: 13,
            color: '#6C5CE7',
            fontWeight: 500,
          }}
        >
          Exame: {examTitle}
        </div>
      )}

      <Form form={form} layout="vertical" size="middle">
        <Form.Item
          label="Aluno"
          name="studentId"
          rules={[{ required: true, message: 'Selecione o aluno' }]}
        >
          <Select
            placeholder="Selecione o aluno..."
            showSearch
            optionFilterProp="label"
            options={MOCK_STUDENTS.map((s) => ({ value: s.id, label: s.name }))}
          />
        </Form.Item>

        <Text style={{ fontSize: 13, color: '#636E72', display: 'block', marginBottom: 12 }}>
          Notas por critério (0 a 10)
        </Text>

        <Row gutter={16}>
          {SCORE_CRITERIA.map(({ key, label }) => (
            <Col xs={12} key={key}>
              <Form.Item
                label={label}
                name={key}
                initialValue={7}
                rules={[{ required: true, message: `Informe ${label}` }]}
              >
                <InputNumber
                  min={0}
                  max={10}
                  step={0.5}
                  style={{ width: '100%' }}
                  precision={1}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Form.Item label="Observações" name="observations">
          <TextArea
            rows={3}
            placeholder="Observações adicionais (opcional)..."
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
