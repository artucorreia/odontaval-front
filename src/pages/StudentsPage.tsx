import { useState, useEffect } from 'react';
import { Card, Button, Input, Typography, Avatar, Tooltip, Alert } from 'antd';
import ResponsiveTable from '../components/ResponsiveTable';
import { SearchOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import type { User } from '../types';

const { Title, Text } = Typography;

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchStudents = () => {
    setLoading(true);
    setError(null);
    userService
      .findAll('STUDENT')
      .then((res) => {
        setStudents(res.data?.data ?? []);
      })
      .catch(() => setError('Não foi possível carregar os alunos. Verifique a conexão com o servidor.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const getInitials = (name: string) =>
    name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('');

  const columns: ColumnsType<User> = [
    {
      title: 'Aluno',
      key: 'student',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar style={{ background: '#6C5CE7', fontWeight: 600 }} size={36}>
            {getInitials(record.name)}
          </Avatar>
          <div>
            <div className="font-semibold text-secondary text-sm">{record.name}</div>
            <div className="text-xs text-muted">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Membro desde',
      key: 'createdAt',
      responsive: ['md'],
      render: (_, record) =>
        record.createdAt
          ? new Date(record.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          : '—',
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Tooltip title="Ver detalhes">
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: '#6C5CE7' }} />}
            onClick={() => navigate(`/alunos/${record.id}`)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
          Alunos
        </Title>
        <Text style={{ color: '#636E72' }}>Visualize os alunos cadastrados</Text>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchStudents}>
              Tentar novamente
            </Button>
          }
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
        <div className="mb-4">
          <Input
            placeholder="Buscar aluno por nome ou e-mail..."
            prefix={<SearchOutlined style={{ color: '#636E72' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360, borderRadius: 8 }}
            disabled={!!error}
          />
        </div>

        <ResponsiveTable
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: 'Nenhum aluno encontrado' }}
        />
      </Card>
    </div>
  );
}
