import { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Space,
  Typography,
  Tag,
  Avatar,
  Modal,
  Form,
  message,
  Popconfirm,
  Tooltip,
} from 'antd';
import ResponsiveTable from '../components/ResponsiveTable';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { MOCK_STUDENTS } from '../utils/mockData';
import type { User } from '../types';

const { Title, Text } = Typography;

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [students, setStudents] = useState<User[]>(MOCK_STUDENTS);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const newStudent: User = {
        id: `stu-${Date.now()}`,
        name: values.name,
        email: values.email,
        roles: [{ id: 3, name: 'ALUNO' }],
      };
      setStudents([...students, newStudent]);
      message.success('Aluno cadastrado com sucesso!');
      setAddModal(false);
      form.resetFields();
    } catch {}
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
    message.success('Aluno removido com sucesso!');
  };

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
        <Space>
          <Tooltip title="Ver detalhes">
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: '#6C5CE7' }} />}
              onClick={() => navigate(`/alunos/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button type="text" icon={<EditOutlined style={{ color: '#636E72' }} />} />
          </Tooltip>
          <Tooltip title="Remover">
            <Popconfirm
              title="Remover aluno?"
              description="Esta ação não pode ser desfeita."
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
            Alunos
          </Title>
          <Text style={{ color: '#636E72' }}>Gerencie os alunos cadastrados</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: '#6C5CE7', borderColor: '#6C5CE7', borderRadius: 8, height: 40 }}
          onClick={() => setAddModal(true)}
        >
          Novo Aluno
        </Button>
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

      {/* Add Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <UserOutlined style={{ color: '#6C5CE7' }} />
            <span>Cadastrar Novo Aluno</span>
          </div>
        }
        open={addModal}
        onOk={handleAdd}
        onCancel={() => {
          setAddModal(false);
          form.resetFields();
        }}
        okText="Cadastrar"
        cancelText="Cancelar"
        okButtonProps={{ style: { background: '#6C5CE7', borderColor: '#6C5CE7' } }}
        width={480}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label="Nome completo"
            name="name"
            rules={[{ required: true, message: 'Informe o nome' }]}
          >
            <Input placeholder="Nome do aluno" />
          </Form.Item>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: 'Informe o e-mail' },
              { type: 'email', message: 'E-mail inválido' },
            ]}
          >
            <Input placeholder="email@exemplo.com" />
          </Form.Item>
          <Form.Item
            label="Senha temporária"
            name="password"
            rules={[
              { required: true, message: 'Informe a senha' },
              { min: 8, message: 'Mínimo 8 caracteres' },
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
