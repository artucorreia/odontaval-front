import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Input,
  Space,
  Typography,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Alert,
  Avatar,
  Select,
} from 'antd';
import ResponsiveTable from '../../components/ResponsiveTable';
import {
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { evaluationService } from '../../services/api';
import type { Evaluation } from '../../types';
import EvaluationDetailsModal from '../../components/evaluations/EvaluationDetailsModal';

const { Title, Text } = Typography;
const { Option } = Select;

const gradeColor = (grade: number) => {
  if (grade >= 7) return { bg: '#d1fae5', text: '#065f46' };
  if (grade >= 5) return { bg: '#fef3c7', text: '#92400e' };
  return { bg: '#fee2e2', text: '#991b1b' };
};

function studentInitials(name?: string) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

export default function AdminEvaluationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsEval, setDetailsEval] = useState<Evaluation | null>(null);

  const fetchEvaluations = () => {
    setLoading(true);
    setError(null);
    evaluationService
      .findAllAdmin()
      .then((res) => setEvaluations(res.data?.data ?? []))
      .catch(() =>
        setError('Não foi possível carregar as avaliações. Verifique a conexão com o servidor.'),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const filtered = evaluations.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      e.title.toLowerCase().includes(q) ||
      e.evaluationNumber.toLowerCase().includes(q) ||
      e.academicSemester.toLowerCase().includes(q) ||
      e.procedurePerformed.toLowerCase().includes(q) ||
      (e.studentName ?? '').toLowerCase().includes(q) ||
      (e.studentEmail ?? '').toLowerCase().includes(q);

    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && !e.deleted) ||
      (statusFilter === 'INACTIVE' && e.deleted);

    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: number) => {
    try {
      await evaluationService.delete(id);
      setEvaluations((prev) => prev.map((e) => (e.id === id ? { ...e, deleted: true } : e)));
      message.success('Avaliação removida com sucesso!');
    } catch {
      message.error('Não foi possível remover a avaliação.');
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      await evaluationService.reactivate(id);
      setEvaluations((prev) => prev.map((e) => (e.id === id ? { ...e, deleted: false } : e)));
      message.success('Avaliação reativada com sucesso!');
    } catch {
      message.error('Não foi possível reativar a avaliação.');
    }
  };

  const columns: ColumnsType<Evaluation> = [
    {
      title: 'Aluno',
      key: 'student',
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <Avatar style={{ background: '#6C5CE7', fontWeight: 600, flexShrink: 0 }} size={32}>
            {studentInitials(r.studentName)}
          </Avatar>
          <div>
            <div className="font-semibold text-secondary" style={{ fontSize: 13 }}>
              {r.studentName ?? r.studentId}
            </div>
            {r.studentEmail && (
              <div style={{ fontSize: 11, color: '#636E72' }}>{r.studentEmail}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Avaliação',
      key: 'title',
      render: (_, r) => (
        <div>
          <div className="font-semibold text-secondary" style={{ fontSize: 13 }}>
            {r.title}
          </div>
          <div style={{ fontSize: 11, color: '#636E72' }}>{r.procedurePerformed}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 90,
      render: (_, r) =>
        r.deleted ? (
          <Tag color="default">Inativa</Tag>
        ) : (
          <Tag color="success">Ativa</Tag>
        ),
    },
    {
      title: 'Período',
      key: 'evaluationNumber',
      width: 90,
      render: (_, r) => (
        <Tag color="purple" style={{ borderRadius: 20 }}>
          {r.evaluationNumber}
        </Tag>
      ),
    },
    {
      title: 'Semestre',
      key: 'academicSemester',
      responsive: ['md'],
      render: (_, r) => <Text style={{ fontSize: 13 }}>{r.academicSemester}</Text>,
    },
    {
      title: 'Especialidade',
      key: 'specialism',
      responsive: ['lg'],
      render: (_, r) =>
        r.specialismName ? (
          <Tag color="blue" style={{ borderRadius: 20 }}>
            {r.specialismName}
          </Tag>
        ) : (
          <Text style={{ fontSize: 12, color: '#b2bec3' }}>—</Text>
        ),
    },
    {
      title: 'Nota',
      key: 'grade',
      align: 'center',
      width: 80,
      sorter: (a, b) => a.grade - b.grade,
      render: (_, r) => {
        const { bg, text } = gradeColor(r.grade);
        return (
          <span
            style={{
              background: bg,
              color: text,
              borderRadius: 20,
              padding: '2px 12px',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {r.grade.toFixed(1)}
          </span>
        );
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      width: 90,
      render: (_, record) => (
        <Space size={2}>
          <Tooltip title="Ver detalhes">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined style={{ color: '#6C5CE7' }} />}
              onClick={() => setDetailsEval(record)}
            />
          </Tooltip>
          {record.deleted ? (
            <Tooltip title="Reativar">
              <Popconfirm
                title="Reativar avaliação?"
                description="A avaliação voltará a aparecer para o professor e aluno."
                onConfirm={() => handleReactivate(record.id)}
                okText="Reativar"
                cancelText="Cancelar"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined style={{ color: '#00b894' }} />}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Remover">
              <Popconfirm
                title="Remover avaliação?"
                description="A avaliação poderá ser reativada posteriormente."
                onConfirm={() => handleDelete(record.id)}
                okText="Remover"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined style={{ color: '#E17055' }} />}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
          Avaliações
        </Title>
        <Text style={{ color: '#636E72' }}>Visualize e gerencie todas as avaliações do sistema</Text>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchEvaluations}>
              Tentar novamente
            </Button>
          }
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
        <div className="flex flex-wrap gap-3 mb-4">
          <Input
            placeholder="Buscar por aluno, título, período, semestre ou procedimento..."
            prefix={<SearchOutlined style={{ color: '#636E72' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 480, borderRadius: 8 }}
            disabled={!!error}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160, borderRadius: 8 }}
            disabled={!!error}
          >
            <Option value="ALL">Todos os status</Option>
            <Option value="ACTIVE">Ativas</Option>
            <Option value="INACTIVE">Inativas</Option>
          </Select>
        </div>

        <ResponsiveTable
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: 'Nenhuma avaliação encontrada' }}
        />
      </Card>

      <EvaluationDetailsModal
        evaluation={detailsEval}
        open={!!detailsEval}
        onClose={() => setDetailsEval(null)}
      />
    </div>
  );
}
