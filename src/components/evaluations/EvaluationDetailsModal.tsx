import { Modal, Tag, Descriptions, Avatar, Divider } from 'antd';
import type { Evaluation } from '../../types';

interface Props {
  evaluation: Evaluation | null;
  open: boolean;
  onClose: () => void;
}

const CRITERIA: { key: keyof Evaluation; label: string }[] = [
  { key: 'punctuality',    label: 'Pontualidade' },
  { key: 'instrumental',   label: 'Instrumental' },
  { key: 'boxOrganization', label: 'Organização do Box' },
  { key: 'biosecurity',    label: 'Biossegurança' },
  { key: 'ethics',         label: 'Ética' },
  { key: 'concept',        label: 'Conceito' },
];

function penaltyColor(value: number) {
  if (value === 0)   return '#00B894';
  if (value >= -2)   return '#FDCB6E';
  if (value >= -5)   return '#E17055';
  return '#D63031';
}

function gradeColor(grade: number) {
  if (grade >= 7) return { bg: '#d1fae5', text: '#065f46' };
  if (grade >= 5) return { bg: '#fef3c7', text: '#92400e' };
  return { bg: '#fee2e2', text: '#991b1b' };
}

function initials(name?: string) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function EvaluationDetailsModal({ evaluation, open, onClose }: Props) {
  if (!evaluation) return null;

  const { bg, text } = gradeColor(evaluation.grade);

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <span className="font-semibold text-secondary" style={{ fontSize: 16 }}>
            Detalhes da Avaliação
          </span>
          <Tag color="purple" style={{ borderRadius: 20, margin: 0 }}>
            {evaluation.evaluationNumber}
          </Tag>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      styles={{ body: { paddingTop: 8 } }}
    >
      {/* Student + grade header */}
      <div
        className="flex items-center justify-between mb-5"
        style={{ background: '#f9f9f9', borderRadius: 10, padding: '14px 18px' }}
      >
        <div className="flex items-center gap-3">
          <Avatar style={{ background: '#6C5CE7', fontWeight: 700, fontSize: 16 }} size={48}>
            {initials(evaluation.studentName)}
          </Avatar>
          <div>
            <div className="font-semibold text-secondary" style={{ fontSize: 15 }}>
              {evaluation.studentName ?? evaluation.studentId}
            </div>
            {evaluation.studentEmail && (
              <div style={{ fontSize: 12, color: '#636E72' }}>{evaluation.studentEmail}</div>
            )}
          </div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: 11, color: '#636E72', marginBottom: 2 }}>Nota Final</div>
          <span
            style={{
              background: bg,
              color: text,
              borderRadius: 20,
              padding: '4px 18px',
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            {evaluation.grade.toFixed(1)}
          </span>
        </div>
      </div>

      {/* General info */}
      <Descriptions
        column={{ xs: 1, sm: 2 }}
        size="small"
        labelStyle={{ color: '#636E72', fontWeight: 500, width: 160 }}
        bordered
        style={{ marginBottom: 20 }}
      >
        <Descriptions.Item label="Título">{evaluation.title}</Descriptions.Item>
        <Descriptions.Item label="Data">
          {new Date(evaluation.date + 'T12:00:00').toLocaleDateString('pt-BR')}
        </Descriptions.Item>
        <Descriptions.Item label="Semestre">{evaluation.academicSemester}</Descriptions.Item>
        <Descriptions.Item label="Box / Unidade">{evaluation.box}</Descriptions.Item>
        <Descriptions.Item label="Especialidade">
          <Tag color="blue">{evaluation.specialismName ?? String(evaluation.specialismId)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Professor">
          {evaluation.professorName ?? evaluation.professorId}
        </Descriptions.Item>
        <Descriptions.Item label="Procedimento" span={2}>
          {evaluation.procedurePerformed}
        </Descriptions.Item>
        {evaluation.goals && (
          <Descriptions.Item label="Objetivos" span={2}>
            {evaluation.goals}
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* Criteria breakdown */}
      <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, color: '#636E72' }}>
        Critérios de Avaliação
      </Divider>
      <div className="grid grid-cols-2 gap-2 mb-4" style={{ gap: 8 }}>
        {CRITERIA.map(({ key, label }) => {
          const value = evaluation[key] as number;
          return (
            <div
              key={key}
              className="flex items-center justify-between"
              style={{
                background: '#fafafa',
                borderRadius: 8,
                padding: '8px 14px',
                border: '1px solid #f0f0f0',
              }}
            >
              <span style={{ fontSize: 13, color: '#2D3436' }}>{label}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: penaltyColor(value) }}>
                {value === 0 ? '0' : value.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Observations */}
      {evaluation.observations && (
        <>
          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, color: '#636E72' }}>
            Observações
          </Divider>
          <p style={{ fontSize: 13, color: '#2D3436', lineHeight: 1.6, margin: 0 }}>
            {evaluation.observations}
          </p>
        </>
      )}
    </Modal>
  );
}
