import { Modal, Descriptions, Progress, Tag, Typography } from 'antd';
import type { EvaluationRecord } from './types';
import type { Exam } from '../../types';

interface Props {
  evaluation: EvaluationRecord | null;
  exam: Exam | null;
  open: boolean;
  onClose: () => void;
}

const { Text } = Typography;

const CRITERIA_MAP: { key: keyof EvaluationRecord; label: string }[] = [
  { key: 'punctuality', label: 'Pontualidade' },
  { key: 'instrumental', label: 'Instrumental' },
  { key: 'organizationOfServiceUnit', label: 'Organização do Box' },
  { key: 'biosecurity', label: 'Biossegurança' },
  { key: 'ethics', label: 'Ética' },
];

function scoreColor(v: number): string {
  if (v >= 8.5) return '#00B894';
  if (v >= 7) return '#6C5CE7';
  if (v >= 5) return '#FDCB6E';
  return '#E17055';
}

export default function EvaluationDetailsModal({ evaluation, exam, open, onClose }: Props) {
  if (!evaluation) return null;

  const approved = evaluation.concept >= 7;

  return (
    <Modal
      title="Detalhes da Avaliação"
      open={open}
      onCancel={onClose}
      footer={null}
      width={540}
    >
      <div className="text-center py-4 mb-4" style={{ borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 52, fontWeight: 700, color: '#6C5CE7', lineHeight: 1.1 }}>
          {evaluation.concept.toFixed(1)}
        </div>
        <Text style={{ color: '#636E72', fontSize: 13 }}>Conceito Final</Text>
        <div className="mt-2">
          <Tag color={approved ? 'success' : 'error'} style={{ borderRadius: 20, fontWeight: 600 }}>
            {approved ? 'Aprovado' : 'Reprovado'}
          </Tag>
        </div>
      </div>

      <Descriptions
        column={2}
        size="small"
        labelStyle={{ color: '#636E72', fontSize: 13 }}
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label="Aluno" span={2}>
          <span style={{ fontWeight: 600 }}>{evaluation.studentName}</span>
        </Descriptions.Item>
        {exam && (
          <>
            <Descriptions.Item label="Exame">{exam.title}</Descriptions.Item>
            <Descriptions.Item label="Especialidade">
              {exam.specialism?.name ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Data">
              {exam.date
                ? new Date(exam.date + 'T12:00:00').toLocaleDateString('pt-BR')
                : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Semestre">{exam.academicSemester}</Descriptions.Item>
          </>
        )}
      </Descriptions>

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 13, color: '#2D3436', display: 'block', marginBottom: 12 }}>
          Critérios Avaliados
        </Text>
        {CRITERIA_MAP.map(({ key, label }) => {
          const value = evaluation[key] as number;
          return (
            <div key={key} style={{ marginBottom: 10 }}>
              <div className="flex justify-between mb-1">
                <Text style={{ fontSize: 13 }}>{label}</Text>
                <Text style={{ fontWeight: 700, color: scoreColor(value), fontSize: 13 }}>
                  {value.toFixed(1)}
                </Text>
              </div>
              <Progress
                percent={value * 10}
                showInfo={false}
                strokeColor={scoreColor(value)}
                trailColor="#f0f0f0"
                strokeWidth={7}
              />
            </div>
          );
        })}
      </div>

      {evaluation.observations && (
        <div
          style={{
            background: '#fafafa',
            borderRadius: 8,
            padding: '10px 14px',
            borderLeft: '3px solid #6C5CE7',
          }}
        >
          <Text style={{ fontSize: 12, color: '#636E72', fontStyle: 'italic' }}>
            "{evaluation.observations}"
          </Text>
        </div>
      )}
    </Modal>
  );
}
