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
  Modal,
  Form,
  Select,
  Badge,
  Divider,
} from 'antd';
import ResponsiveTable from '../../components/ResponsiveTable';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  ReloadOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api';
import type { RoleName, User } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

const roleLabel: Record<RoleName, { label: string; color: string }> = {
  ADMIN: { label: 'Admin', color: 'red' },
  PROFESSOR: { label: 'Professor', color: 'blue' },
  STUDENT: { label: 'Aluno', color: 'green' },
};

function userInitials(name: string) {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

function primaryRole(user: User): RoleName | null {
  const priority: RoleName[] = ['ADMIN', 'PROFESSOR', 'STUDENT'];
  return priority.find((r) => user.roles.some((role) => role.name === r)) ?? null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm] = Form.useForm();

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm] = Form.useForm();

  const navigate = useNavigate();

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    userService
      .findAllAdmin()
      .then((res) => setUsers(res.data?.data ?? []))
      .catch(() =>
        setError('Não foi possível carregar os usuários. Verifique a conexão com o servidor.'),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const role = primaryRole(u);
    const matchRole = roleFilter === 'ALL' || role === roleFilter;
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && !u.deleted) ||
      (statusFilter === 'INACTIVE' && u.deleted);
    return matchSearch && matchRole && matchStatus;
  });

  const handleDeactivate = async (id: string) => {
    try {
      await userService.delete(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, deleted: true } : u)));
      message.success('Usuário desativado com sucesso!');
    } catch {
      message.error('Não foi possível desativar o usuário.');
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await userService.reactivate(id);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, deleted: false } : u)));
      message.success('Usuário reativado com sucesso!');
    } catch {
      message.error('Não foi possível reativar o usuário.');
    }
  };

  const handleCreate = async (values: {
    name: string;
    email: string;
    password: string;
    role: RoleName;
  }) => {
    setCreateLoading(true);
    try {
      await userService.create(values);
      message.success('Usuário criado com sucesso!');
      setCreateOpen(false);
      createForm.resetFields();
      fetchUsers();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Não foi possível criar o usuário.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEdit = async (values: {
    name: string;
    email: string;
    role: RoleName;
    newPassword?: string;
  }) => {
    if (!editUser) return;
    setEditLoading(true);
    try {
      const calls: Promise<any>[] = [
        userService.update(editUser.id, { name: values.name, email: values.email }),
      ];

      if (values.role !== primaryRole(editUser)) {
        calls.push(userService.updateRole(editUser.id, { role: values.role }));
      }

      if (values.newPassword?.trim()) {
        calls.push(userService.adminResetPassword(editUser.id, { newPassword: values.newPassword }));
      }

      await Promise.all(calls);
      message.success('Usuário atualizado com sucesso!');
      closeEdit();
      fetchUsers();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Não foi possível atualizar o usuário.');
    } finally {
      setEditLoading(false);
    }
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    editForm.setFieldsValue({
      name: user.name,
      email: user.email,
      role: primaryRole(user),
      newPassword: '',
      confirmPassword: '',
    });
  };

  const closeEdit = () => {
    setEditUser(null);
    editForm.resetFields();
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Usuário',
      key: 'user',
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <Badge dot status={r.deleted ? 'default' : 'success'} offset={[-4, 32]}>
            <Avatar style={{ background: '#6C5CE7', fontWeight: 600 }} size={36}>
              {userInitials(r.name)}
            </Avatar>
          </Badge>
          <div>
            <div className="font-semibold text-secondary" style={{ fontSize: 13 }}>
              {r.name}
            </div>
            <div style={{ fontSize: 11, color: '#636E72' }}>{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, r) =>
        r.deleted ? <Tag color="default">Inativo</Tag> : <Tag color="success">Ativo</Tag>,
    },
    {
      title: 'Função',
      key: 'role',
      width: 110,
      render: (_, r) => {
        const role = primaryRole(r);
        if (!role) return <Text style={{ color: '#b2bec3' }}>—</Text>;
        const { label, color } = roleLabel[role];
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Membro desde',
      key: 'createdAt',
      responsive: ['md'],
      render: (_, r) =>
        r.createdAt
          ? new Date(r.createdAt).toLocaleDateString('pt-BR', {
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
      width: 110,
      render: (_, record) => (
        <Space size={2}>
          {primaryRole(record) === 'STUDENT' && (
            <Tooltip title="Ver perfil do aluno">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined style={{ color: '#6C5CE7' }} />}
                onClick={() => navigate(`/admin/usuarios/${record.id}`)}
              />
            </Tooltip>
          )}
          <Tooltip title="Editar">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ color: '#0984e3' }} />}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          {record.deleted ? (
            <Tooltip title="Reativar">
              <Popconfirm
                title="Reativar usuário?"
                description="O usuário poderá fazer login novamente."
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
            <Tooltip title="Desativar">
              <Popconfirm
                title="Desativar usuário?"
                description="O usuário não poderá mais fazer login."
                onConfirm={() => handleDeactivate(record.id)}
                okText="Desativar"
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
            Usuários
          </Title>
          <Text style={{ color: '#636E72' }}>Gerencie todos os usuários do sistema</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: '#6C5CE7', borderColor: '#6C5CE7', borderRadius: 8, height: 40 }}
          onClick={() => setCreateOpen(true)}
        >
          Novo Usuário
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchUsers}>
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
            placeholder="Buscar por nome ou e-mail..."
            prefix={<SearchOutlined style={{ color: '#636E72' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 320, borderRadius: 8 }}
            disabled={!!error}
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 160, borderRadius: 8 }}
            disabled={!!error}
          >
            <Option value="ALL">Todas as funções</Option>
            <Option value="ADMIN">Admin</Option>
            <Option value="PROFESSOR">Professor</Option>
            <Option value="STUDENT">Aluno</Option>
          </Select>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140, borderRadius: 8 }}
            disabled={!!error}
          >
            <Option value="ALL">Todos os status</Option>
            <Option value="ACTIVE">Ativos</Option>
            <Option value="INACTIVE">Inativos</Option>
          </Select>
        </div>

        <ResponsiveTable
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: 'Nenhum usuário encontrado' }}
        />
      </Card>

      {/* ── Modal: Novo Usuário ── */}
      <Modal
        title="Novo Usuário"
        open={createOpen}
        onCancel={() => { setCreateOpen(false); createForm.resetFields(); }}
        footer={null}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate} style={{ marginTop: 16 }}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[
              { required: true, message: 'Informe o nome' },
              { min: 2, message: 'Mínimo 2 caracteres' },
            ]}
          >
            <Input placeholder="Nome completo" />
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
            label="Senha"
            name="password"
            rules={[
              { required: true, message: 'Informe a senha' },
              { min: 8, message: 'Mínimo 8 caracteres' },
            ]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item
            label="Função"
            name="role"
            rules={[{ required: true, message: 'Selecione a função' }]}
          >
            <Select placeholder="Selecionar função">
              <Option value="ADMIN">Admin</Option>
              <Option value="PROFESSOR">Professor</Option>
              <Option value="STUDENT">Aluno</Option>
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => { setCreateOpen(false); createForm.resetFields(); }}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading}
              style={{ background: '#6C5CE7', borderColor: '#6C5CE7' }}
            >
              Criar
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ── Modal: Editar Usuário ── */}
      <Modal
        title="Editar Usuário"
        open={!!editUser}
        onCancel={closeEdit}
        footer={null}
        destroyOnClose
      >
        {editUser && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              marginTop: 8,
              padding: '10px 14px',
              background: '#f8f9fa',
              borderRadius: 8,
            }}
          >
            <Avatar style={{ background: '#6C5CE7', fontWeight: 600, flexShrink: 0 }} size={36}>
              {userInitials(editUser.name)}
            </Avatar>
            <div>
              <Text strong style={{ fontSize: 13 }}>{editUser.name}</Text>
              <br />
              <Text style={{ color: '#636E72', fontSize: 11 }}>{editUser.email}</Text>
            </div>
          </div>
        )}

        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Informe o nome' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: 'Informe o e-mail' },
              { type: 'email', message: 'E-mail inválido' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Função"
            name="role"
            rules={[{ required: true, message: 'Selecione a função' }]}
          >
            <Select>
              <Option value="ADMIN">Admin</Option>
              <Option value="PROFESSOR">Professor</Option>
              <Option value="STUDENT">Aluno</Option>
            </Select>
          </Form.Item>

          <Divider style={{ margin: '16px 0 12px' }}>
            <span style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <LockOutlined /> Alterar senha (opcional)
            </span>
          </Divider>

          <Form.Item
            label="Nova senha"
            name="newPassword"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.length >= 8) return Promise.resolve();
                  return Promise.reject(new Error('Mínimo 8 caracteres'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Deixe em branco para não alterar" />
          </Form.Item>
          <Form.Item
            label="Confirmar nova senha"
            name="confirmPassword"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const newPwd = getFieldValue('newPassword');
                  if (!newPwd && !value) return Promise.resolve();
                  if (value === newPwd) return Promise.resolve();
                  return Promise.reject(new Error('As senhas não coincidem'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Repita a nova senha" />
          </Form.Item>

          <div className="flex justify-end gap-2" style={{ marginTop: 4 }}>
            <Button onClick={closeEdit}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={editLoading}
              style={{ background: '#6C5CE7', borderColor: '#6C5CE7' }}
            >
              Salvar
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
