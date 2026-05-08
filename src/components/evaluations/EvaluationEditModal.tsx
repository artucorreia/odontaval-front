import { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Tag,
  Avatar,
  message,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { evaluationService } from '../../services/api';
import type { Evaluation, UpdateEvaluationRequest } from '../../types';

interface Props {
  evaluation: Evaluation | null;
  open: boolean;
  onClose: () => void;
  onSaved: (updated: Evaluation) => void;
}

const EVALUATION_PERIODS = ['AV1', 'AV2', 'AV3'];
const SEMESTERS = ['2026.1', '2026.2', '2025.2', '2025.1'];

const CRITERIA: { key: keyof UpdateEvaluationRequest; label: string }[] = [
  { key: 'punctuality',     label: 'Pontualidade' },
  { key: 'instrumental',    label: 'Instrumental' },
  { key: 'boxOrganization', label: 'Organização do Box' },
  { key: 'biosecurity',     label: 'Biossegurança' },
  { key: 'ethics',          label: 'Ética' },
  { key: 'concept',         label: 'Conceito' },
];
const CRITERIA_KEYS = CRITERIA.map((c) => c.key) as string[];

function calcGrade(values: Record<string, number>): number {
  const sum = CRITERIA_KEYS.reduce((acc, k) => acc + (values[k] ?? 0), 0);
  return parseFloat((10 + sum).toFixed(2));
}

function initials(name?: string) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function EvaluationEditModal({ evaluation, open, onClose, onSaved }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (evaluation && open) {
      form.setFieldsValue({
        title:             evaluation.title,
        evaluationNumber:  evaluation.evaluationNumber,
        academicSemester:  evaluation.academicSemester,
        date:              evaluation.date ? dayjs(evaluation.date) : null,
        box:               evaluation.box,
        procedurePerformed: evaluation.procedurePerformed,
        goals:             evaluation.goals,
        observations:      evaluation.observations ?? '',
        punctuality:       evaluation.punctuality,
        instrumental:      evaluation.instrumental,
        boxOrganization:   evaluation.boxOrganization,
        biosecurity:       evaluation.biosecurity,
        ethics:            evaluation.ethics,
        concept:           evaluation.concept,
        grade:             evaluation.grade,
      });
    }
  }, [evaluation, open, form]);

  const handleCriteriaChange = () => {
    const values = form.getFieldsValue(CRITERIA_KEYS);
    form.setFieldValue('grade', calcGrade(values));
  };

  const handleSave = async () => {
    if (!evaluation) return;
    try {
      const values = await form.validateFields();

      const payload: UpdateEvaluationRequest = {
        title:             values.title,
        evaluationNumber:  values.evaluationNumber,
        academicSemester:  values.academicSemester,
        date:              values.date?.format('YYYY-MM-DD'),
        box:               values.box,
        procedurePerformed: values.procedurePerformed,
        goals:             values.goals,
        observations:      values.observations || undefined,
        punctuality:       values.punctuality,
        instrumental:      values.instrumental,
        boxOrganization:   values.boxOrganization,
        biosecurity:       values.biosecurity,
        ethics:            values.ethics,
        concept:           values.concept,
        grade:             values.grade,
      };

      await evaluationService.update(evaluation.id, payload);
      message.success('Avaliação atualizada com sucesso!');
      onSaved({ ...evaluation, ...payload, date: payload.date ?? evaluation.date });
      onClose();
    } catch {
      message.error('Erro ao salvar. Verifique os campos e tente novamente.');
    }
  };

  if (!evaluation) return null;

  return (
    <Modal
      title={
        <span className="font-semibold text-secondary" style={{ fontSize: 16 }}>
          Editar Avaliação
        </span>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      okText={
        <span>
          <SaveOutlined style={{ marginRight: 6 }} />
          Salvar
        </span>
      }
      okButtonProps={{ style: { background: '#6C5CE7', borderColor: '#6C5CE7' } }}
      cancelText="Cancelar"
      width={860}
      styles={{ body: { paddingTop: 8, maxHeight: '72vh', overflowY: 'auto' } }}
    >
      {/* Student info (read-only) */}
      <div
        className="flex items-center gap-3 mb-5"
        style={{ background: '#f9f9f9', borderRadius: 10, padding: '12px 16px' }}
      >
        <Avatar style={{ background: '#6C5CE7', fontWeight: 700 }} size={40}>
          {initials(evaluation.studentName)}
        </Avatar>
        <div>
          <div className="font-semibold text-secondary" style={{ fontSize: 14 }}>
            {evaluation.studentName ?? evaluation.studentId}
          </div>
          {evaluation.studentEmail && (
            <div style={{ fontSize: 12, color: '#636E72' }}>{evaluation.studentEmail}</div>
          )}
        </div>
        {evaluation.specialismName && (
          <Tag color="blue" style={{ marginLeft: 'auto' }}>
            {evaluation.specialismName}
          </Tag>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        size="middle"
        onValuesChange={(changed) => {
          if (CRITERIA_KEYS.some((k) => k in changed)) handleCriteriaChange();
        }}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Título"
              name="title"
              rules={[{ required: true, message: 'Informe o título' }]}
            >
              <Input placeholder="Ex: Avaliação clínica AV1" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              label="Período"
              name="evaluationNumber"
              rules={[{ required: true, message: 'Selecione o período' }]}
            >
              <Select placeholder="Selecione...">
                {EVALUATION_PERIODS.map((p) => (
                  <Select.Option key={p} value={p}>{p}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              label="Semestre"
              name="academicSemester"
              rules={[{ required: true, message: 'Informe o semestre' }]}
            >
              <Select placeholder="Ex: 2026.1">
                {SEMESTERS.map((s) => (
                  <Select.Option key={s} value={s}>{s}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              label="Data"
              name="date"
              rules={[{ required: true, message: 'Informe a data' }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Box"
              name="box"
              rules={[{ required: true, message: 'Informe o box' }]}
            >
              <Input placeholder="Ex: Box 12A" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Procedimento Realizado"
              name="procedurePerformed"
              rules={[{ required: true, message: 'Informe o procedimento' }]}
            >
              <Input placeholder="Ex: Restauração dental" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Objetivos"
              name="goals"
              rules={[{ required: true, message: 'Informe os objetivos' }]}
            >
              <Input.TextArea rows={2} maxLength={200} showCount />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Observações" name="observations">
              <Input.TextArea rows={2} maxLength={200} showCount />
            </Form.Item>
          </Col>
        </Row>

        {/* Criteria */}
        <div
          style={{
            background: '#fafafa',
            border: '1px solid #f0f0f0',
            borderRadius: 10,
            padding: '16px 20px',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 13, color: '#636E72', marginBottom: 12 }}>
            Penalizações por critério (<strong>0 a -10</strong>). Nota final calculada
            automaticamente: <strong>10 + soma</strong>.
          </div>
          <Row gutter={[16, 0]}>
            {CRITERIA.map(({ key, label }) => (
              <Col xs={24} sm={12} md={8} key={key}>
                <Form.Item
                  label={<span style={{ fontSize: 12 }}>{label}</span>}
                  name={key}
                  rules={[
                    { required: true, message: 'Obrigatório' },
                    {
                      validator: (_, v) =>
                        v >= -10 && v <= 0
                          ? Promise.resolve()
                          : Promise.reject('Entre -10 e 0'),
                    },
                  ]}
                >
                  <InputNumber min={-10} max={0} step={0.5} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            ))}
          </Row>

          <Form.Item
            label={<span className="font-semibold text-secondary text-sm">Nota Final (0–10)</span>}
            name="grade"
            rules={[
              { required: true, message: 'Obrigatório' },
              {
                validator: (_, v) =>
                  v >= 0 && v <= 10 ? Promise.resolve() : Promise.reject('Entre 0 e 10'),
              },
            ]}
          >
            <InputNumber
              min={0}
              max={10}
              step={0.5}
              style={{ width: '100%', fontWeight: 700 }}
              placeholder="Calculada automaticamente"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}
