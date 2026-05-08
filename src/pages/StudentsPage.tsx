import { useState } from 'react';
import { Card, Button, Input, Typography, Tag, Avatar, Tooltip } from 'antd';
import ResponsiveTable from '../components/ResponsiveTable';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { MOCK_STUDENTS } from '../utils/mockData';
import type { User } from '../types';

const { Title, Text } = Typography;

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = MOCK_STUDENTS.filter(
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
      title: 'Status',
      key: 'status',
      render: () => (
        <Tag color="green" className="rounded-full">
          Ativo
        </Tag>
      ),
    },
    {
      title: 'Perfil',
      key: 'role',
      render: (_, record) => (
        <Tag className="tag-role-aluno rounded-full">{record.roles[0]?.name}</Tag>
      ),
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

      <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
        <div className="mb-4">
          <Input
            placeholder="Buscar aluno..."
            prefix={<SearchOutlined style={{ color: '#636E72' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360, borderRadius: 8 }}
          />
        </div>

        <ResponsiveTable
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: 'Nenhum aluno encontrado' }}
        />
      </Card>
    </div>
  );
}
