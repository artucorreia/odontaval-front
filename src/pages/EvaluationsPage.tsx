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
} from 'antd';
import ResponsiveTable from '../components/ResponsiveTable';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { evaluationService } from '../services/api';
import { MOCK_EVALUATIONS } from '../utils/mockData';
import type { Evaluation } from '../types';

const { Title, Text } = Typography;

const gradeColor = (grade: number) => {
  if (grade >= 7) return { bg: '#d1fae5', text: '#065f46' };
  if (grade >= 5) return { bg: '#fef3c7', text: '#92400e' };
  return { bg: '#fee2e2', text: '#991b1b' };
};

export default function EvaluationsPage() {
  const [search, setSearch] = useState('');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    evaluationService
      .findAll()
      .then((res) => {
        const data: Evaluation[] = res.data?.data ?? [];
        setEvaluations(data.length > 0 ? data : MOCK_EVALUATIONS);
      })
      .catch(() => setEvaluations(MOCK_EVALUATIONS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = evaluations.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.evaluationNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.academicSemester.toLowerCase().includes(search.toLowerCase()) ||
      e.procedurePerformed.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: number) => {
    try {
      await evaluationService.delete(id);
      setEvaluations((prev) => prev.filter((e) => e.id !== id));
      message.success('Avaliação removida com sucesso!');
    } catch {
      message.error('Não foi possível remover a avaliação.');
    }
  };

  const columns: ColumnsType<Evaluation> = [
    {
      title: 'Título',
      key: 'title',
      render: (_, r) => (
        <div>
          <div className="font-semibold text-secondary text-sm">{r.title}</div>
          <div className="text-xs text-muted">{r.procedurePerformed}</div>
        </div>
      ),
    },
    {
      title: 'Período',
      key: 'evaluationNumber',
      render: (_, r) => (
        <Tag color="purple" style={{ borderRadius: 20 }}>
          {r.evaluationNumber}
        </Tag>
      ),
    },
    {
      title: 'Semestre',
      key: 'academicSemester',
      render: (_, r) => <Text style={{ fontSize: 13 }}>{r.academicSemester}</Text>,
    },
    {
      title: 'Data',
      key: 'date',
      render: (_, r) =>
        r.date ? new Date(r.date + 'T12:00:00').toLocaleDateString('pt-BR') : '—',
    },
    {
      title: 'Box',
      key: 'box',
      render: (_, r) => <Text style={{ fontSize: 13 }}>{r.box}</Text>,
    },
    {
      title: 'Nota Final',
      key: 'grade',
      align: 'center',
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
              fontWeight: 600,
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
      render: (_, record) => (
        <Space>
          <Tooltip title="Remover">
            <Popconfirm
              title="Remover avaliação?"
              onConfirm={() => handleDelete(record.id)}
              okText="Remover"
              cancelText="Cancelar"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" icon={<DeleteOutlined style={{ color: '#E17055' }} />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
            Avaliações
          </Title>
          <Text style={{ color: '#636E72' }}>Gerencie as avaliações dos alunos</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: '#6C5CE7', borderColor: '#6C5CE7', borderRadius: 8, height: 40 }}
          onClick={() => navigate('/avaliacoes/nova')}
        >
          Nova Avaliação
        </Button>
      </div>

      <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
        <div className="mb-4">
          <Input
            placeholder="Buscar por título, período, semestre ou procedimento..."
            prefix={<SearchOutlined style={{ color: '#636E72' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 420, borderRadius: 8 }}
          />
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
    </div>
  );
}
