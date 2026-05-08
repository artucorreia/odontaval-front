import { Modal, Tag, Avatar, Button } from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  ExperimentOutlined,
  HomeOutlined,
  FileTextOutlined,
  BulbOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import type { Evaluation } from '../../types';

interface Props {
  evaluation: Evaluation | null;
  open: boolean;
  onClose: () => void;
}

const CRITERIA: { key: keyof Evaluation; label: string }[] = [
  { key: 'punctuality',     label: 'Pontualidade' },
  { key: 'instrumental',    label: 'Instrumental' },
  { key: 'boxOrganization', label: 'Organização do Box' },
  { key: 'biosecurity',     label: 'Biossegurança' },
  { key: 'ethics',          label: 'Ética' },
  { key: 'concept',         label: 'Conceito' },
];

function penaltyToPercent(penalty: number) {
  return ((10 + penalty) / 10) * 100;
}

function penaltyBarColor(penalty: number) {
  if (penalty === 0)   return '#10b981';
  if (penalty >= -2)   return '#f59e0b';
  if (penalty >= -5)   return '#f97316';
  return '#ef4444';
}

function gradeTheme(grade: number) {
  if (grade >= 7) return { bg: '#ecfdf5', ring: '#10b981', text: '#065f46' };
  if (grade >= 5) return { bg: '#fffbeb', ring: '#f59e0b', text: '#92400e' };
  return { bg: '#fef2f2', ring: '#ef4444', text: '#991b1b' };
}

function initials(name?: string) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ─── sub-components ──────────────────────────────────────────────────────────

function MetaChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 14px',
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 10,
        flex: 1,
        minWidth: 0,
      }}
    >
      <span style={{ color: '#6C5CE7', fontSize: 15, flexShrink: 0 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </div>
        <div
          style={{ fontSize: 13, color: '#2D3436', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          title={value}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function CriterionRow({ label, penalty }: { label: string; penalty: number }) {
  const pct = penaltyToPercent(penalty);
  const color = penaltyBarColor(penalty);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 150, fontSize: 13, color: '#4b5563', flexShrink: 0 }}>{label}</span>
      <div
        style={{
          flex: 1,
          height: 6,
          background: '#f1f5f9',
          borderRadius: 99,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 99,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      <span
        style={{
          width: 40,
          textAlign: 'right',
          fontSize: 13,
          fontWeight: 700,
          color: penalty === 0 ? '#10b981' : color,
          flexShrink: 0,
        }}
      >
        {penalty === 0 ? '0' : penalty.toFixed(1)}
      </span>
    </div>
  );
}

// ─── modal ───────────────────────────────────────────────────────────────────

export default function EvaluationDetailsModal({ evaluation, open, onClose }: Props) {
  if (!evaluation) return null;

  const theme = gradeTheme(evaluation.grade);
  const totalPenalty = CRITERIA.reduce((sum, { key }) => sum + (evaluation[key] as number), 0);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={
        <Button onClick={onClose} style={{ borderRadius: 8 }}>
          Fechar
        </Button>
      }
      width={700}
      title={null}
      styles={{ body: { padding: 0 } }}
    >
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
          padding: '24px 28px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          borderRadius: '8px 8px 0 0',
        }}
      >
        {/* Left: identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <Avatar
            style={{ background: '#6C5CE7', fontWeight: 700, fontSize: 18, flexShrink: 0 }}
            size={60}
          >
            {initials(evaluation.studentName)}
          </Avatar>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: '#1e1b4b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {evaluation.studentName ?? evaluation.studentId}
            </div>
            {evaluation.studentEmail && (
              <div style={{ fontSize: 12, color: '#6366f1', marginTop: 2 }}>
                {evaluation.studentEmail}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <Tag color="purple" style={{ borderRadius: 20, margin: 0, fontWeight: 600 }}>
                {evaluation.evaluationNumber}
              </Tag>
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                {evaluation.academicSemester}
              </span>
              <span style={{ color: '#d1d5db', fontSize: 10 }}>•</span>
              <span style={{ fontSize: 12, color: '#6b7280' }}>
                {formatDate(evaluation.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: grade ring */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: theme.bg,
              border: `3px solid ${theme.ring}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              boxShadow: `0 0 0 4px ${theme.ring}22`,
              margin: '0 auto',
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 800, color: theme.text, lineHeight: 1 }}>
              {evaluation.grade.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 28px 24px' }}>
        {/* ── Title ─────────────────────────────────────────────────── */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 16,
          }}
        >
          {evaluation.title}
        </div>

        {/* ── Meta chips row ────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <MetaChip
            icon={<UserOutlined />}
            label="Professor"
            value={evaluation.professorName ?? evaluation.professorId}
          />
          <MetaChip
            icon={<ExperimentOutlined />}
            label="Especialidade"
            value={evaluation.specialismName ?? String(evaluation.specialismId)}
          />
          <MetaChip
            icon={<HomeOutlined />}
            label="Box / Unidade"
            value={evaluation.box}
          />
          <MetaChip
            icon={<CalendarOutlined />}
            label="Semestre"
            value={evaluation.academicSemester}
          />
        </div>

        {/* ── Procedure + Goals ─────────────────────────────────────── */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <FileTextOutlined style={{ color: '#6C5CE7', fontSize: 14, marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                Procedimento Realizado
              </div>
              <div style={{ fontSize: 13, color: '#374151' }}>{evaluation.procedurePerformed}</div>
            </div>
          </div>
          {evaluation.goals && (
            <div style={{ display: 'flex', gap: 10 }}>
              <BulbOutlined style={{ color: '#6C5CE7', fontSize: 14, marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                  Objetivos
                </div>
                <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{evaluation.goals}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Criteria breakdown ────────────────────────────────────── */}
        <div style={{ marginBottom: evaluation.observations ? 20 : 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Critérios de Avaliação
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              Penalização total:{' '}
              <strong style={{ color: totalPenalty === 0 ? '#10b981' : '#ef4444' }}>
                {totalPenalty === 0 ? '0' : totalPenalty.toFixed(1)}
              </strong>
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CRITERIA.map(({ key, label }) => (
              <CriterionRow
                key={key}
                label={label}
                penalty={evaluation[key] as number}
              />
            ))}
          </div>
        </div>

        {/* ── Observations ──────────────────────────────────────────── */}
        {evaluation.observations && (
          <div
            style={{
              borderLeft: '3px solid #e0d7ff',
              background: '#faf9ff',
              borderRadius: '0 10px 10px 0',
              padding: '12px 16px',
            }}
          >
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <MessageOutlined style={{ color: '#6C5CE7', fontSize: 13, marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                  Observações
                </div>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>
                  {evaluation.observations}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
