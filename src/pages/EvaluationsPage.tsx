import { useState } from 'react';
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
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { MOCK_EVALUATIONS } from '../utils/mockData';
import type { Evaluation } from '../types';

const { Title, Text } = Typography;

const conceptColor = (v: number) => {
  if (v >= 9) return { bg: '#d1fae5', text: '#065f46' };
  if (v >= 7) return { bg: '#fef3c7', text: '#92400e' };
  return { bg: '#fee2e2', text: '#991b1b' };
};

export default function EvaluationsPage() {
  const [search, setSearch] = useState('');
  const [evaluations, setEvaluations] = useState<Evaluation[]>(MOCK_EVALUATIONS);
  const navigate = useNavigate();

  const filtered = evaluations.filter(
    (e) =>
      e.student?.name.toLowerCase().includes(search.toLowerCase()) ||
      e.exam?.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.exam?.specialism?.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    setEvaluations(evaluations.filter((e) => e.id !== id));
    message.success('Avaliação removida com sucesso!');
  };

  const columns: ColumnsType<Evaluation> = [
    {
      title: 'Aluno',
      key: 'student',
      render: (_, r) => (
        <div>
          <div className="font-semibold text-secondary text-sm">{r.student?.name ?? '—'}</div>
          <div className="text-xs text-muted">{r.student?.email}</div>
        </div>
      ),
    },
    {
      title: 'Especialidade',
      key: 'specialism',
      render: (_, r) => (
        <Tag
          style={{
            borderRadius: 20,
            background: '#ede9fe',
            color: '#6C5CE7',
            borderColor: '#c4b5fd',
          }}
        >
          {r.exam?.specialism?.name ?? '—'}
        </Tag>
      ),
    },
    {
      title: 'Exame',
      key: 'exam',
      render: (_, r) => <Text style={{ fontSize: 13 }}>{r.exam?.title ?? '—'}</Text>,
    },
    {
      title: 'Data',
      key: 'date',
      render: (_, r) => (r.exam?.date ? new Date(r.exam.date).toLocaleDateString('pt-BR') : '—'),
    },
    {
      title: 'Conceito',
      key: 'concept',
      align: 'center',
      sorter: (a, b) => a.concept - b.concept,
      render: (_, r) => {
        const { bg, text } = conceptColor(r.concept);
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
            {r.concept.toFixed(1)}
          </span>
        );
      },
    },
    {
      title: 'Professor',
      key: 'professor',
      render: (_, r) => <Text style={{ fontSize: 13 }}>{r.exam?.professor?.name ?? '—'}</Text>,
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver detalhes">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: '#6C5CE7' }} />}
              onClick={() => navigate(`/avaliacoes/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#636E72' }} />}
              onClick={() => navigate(`/avaliacoes/${record.id}/editar`)}
            />
          </Tooltip>
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
            placeholder="Buscar por aluno, exame ou especialidade..."
            prefix={<SearchOutlined style={{ color: '#636E72' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 400, borderRadius: 8 }}
          />
        </div>
        <ResponsiveTable
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: 'Nenhuma avaliação encontrada' }}
        />
      </Card>
    </div>
  );
}
