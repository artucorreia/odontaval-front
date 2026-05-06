import { useEffect } from 'react';
import { Modal, Form, InputNumber, Input, Row, Col, Typography, Tag } from 'antd';
import type { EvaluationRecord, EditEvaluationValues } from './types';
import { EVAL_CRITERIA } from './types';

interface Props {
  evaluation: EvaluationRecord | null;
  open: boolean;
  loading: boolean;
  onSubmit: (id: number, values: EditEvaluationValues) => Promise<void>;
  onCancel: () => void;
}

const { Text } = Typography;
const { TextArea } = Input;

const SCORE_CRITERIA = EVAL_CRITERIA.filter((c) => c.key !== 'observations');

export default function EditEvaluationModal({ evaluation, open, loading, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm<EditEvaluationValues>();

  useEffect(() => {
    if (evaluation && open) {
      form.setFieldsValue({
        concept: evaluation.concept,
        punctuality: evaluation.punctuality,
        instrumental: evaluation.instrumental,
        organizationOfServiceUnit: evaluation.organizationOfServiceUnit,
        biosecurity: evaluation.biosecurity,
        ethics: evaluation.ethics,
        observations: evaluation.observations,
      });
    }
  }, [evaluation, open, form]);

  const handleOk = async () => {
    if (!evaluation) return;
    const values = await form.validateFields();
    await onSubmit(evaluation.id, values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Editar Avaliação"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Salvar Alterações"
      cancelText="Cancelar"
      confirmLoading={loading}
      okButtonProps={{ style: { background: '#6C5CE7', borderColor: '#6C5CE7' } }}
      width={560}
    >
      {evaluation && (
        <div
          style={{
            background: '#f9f7ff',
            borderRadius: 8,
            padding: '8px 14px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 13, color: '#636E72' }}>Aluno:</span>
          <span style={{ fontWeight: 600, color: '#2D3436', fontSize: 13 }}>
            {evaluation.studentName}
          </span>
          <Tag color="purple" style={{ marginLeft: 'auto', fontSize: 11 }}>
            Não pode ser alterado
          </Tag>
        </div>
      )}

      <Form form={form} layout="vertical" size="middle">
        <Text style={{ fontSize: 13, color: '#636E72', display: 'block', marginBottom: 12 }}>
          Notas por critério (0 a 10)
        </Text>

        <Row gutter={16}>
          {SCORE_CRITERIA.map(({ key, label }) => (
            <Col xs={12} key={key}>
              <Form.Item
                label={label}
                name={key}
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
          <TextArea rows={3} placeholder="Observações adicionais..." maxLength={500} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
}
