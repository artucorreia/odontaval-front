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
  Modal,
  Form,
  Select,
} from 'antd';
import ResponsiveTable from '../../components/ResponsiveTable';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { specialismService } from '../../services/api';
import type { Specialism } from '../../types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function SpecialismsPage() {
  const [specialisms, setSpecialisms] = useState<Specialism[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm] = Form.useForm();

  const [editSpecialism, setEditSpecialism] = useState<Specialism | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm] = Form.useForm();

  const fetchSpecialisms = () => {
    setLoading(true);
    setError(null);
    specialismService
      .findAll()
      .then((res) => setSpecialisms(res.data?.data ?? []))
      .catch(() => setError('Não foi possível carregar as especialidades.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSpecialisms();
  }, []);

  const filtered = specialisms.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      (s.description ?? '').toLowerCase().includes(q);

    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && !s.deleted) ||
      (statusFilter === 'INACTIVE' && s.deleted);

    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: number) => {
    try {
      await specialismService.delete(id);
      setSpecialisms((prev) => prev.map((s) => (s.id === id ? { ...s, deleted: true } : s)));
      message.success('Especialidade removida com sucesso!');
    } catch {
      message.error('Não foi possível remover a especialidade.');
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      await specialismService.reactivate(id);
      setSpecialisms((prev) => prev.map((s) => (s.id === id ? { ...s, deleted: false } : s)));
      message.success('Especialidade reativada com sucesso!');
    } catch {
      message.error('Não foi possível reativar a especialidade.');
    }
  };

  const handleCreate = async (values: { name: string; description?: string }) => {
    setCreateLoading(true);
    try {
      await specialismService.create(values);
      message.success('Especialidade criada com sucesso!');
      setCreateOpen(false);
      createForm.resetFields();
      fetchSpecialisms();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Não foi possível criar a especialidade.';
      message.error(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEdit = async (values: { name?: string; description?: string }) => {
    if (!editSpecialism) return;
    setEditLoading(true);
    try {
      await specialismService.update(editSpecialism.id, values);
      message.success('Especialidade atualizada com sucesso!');
      setEditSpecialism(null);
      editForm.resetFields();
      fetchSpecialisms();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Não foi possível atualizar a especialidade.';
      message.error(msg);
    } finally {
      setEditLoading(false);
    }
  };

  const openEdit = (s: Specialism) => {
    setEditSpecialism(s);
    editForm.setFieldsValue({ name: s.name, description: s.description });
  };

  const columns: ColumnsType<Specialism> = [
    {
      title: 'Especialidade',
      key: 'name',
      render: (_, r) => (
        <div>
          <div className="font-semibold text-secondary" style={{ fontSize: 13 }}>
            {r.name}
          </div>
          {r.description && (
            <div style={{ fontSize: 11, color: '#636E72' }}>{r.description}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, r) =>
        r.deleted ? (
          <Tag color="default">Inativa</Tag>
        ) : (
          <Tag color="success">Ativa</Tag>
        ),
    },
    {
      title: 'Criada em',
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
      width: 100,
      render: (_, record) => (
        <Space size={2}>
          {record.deleted ? (
            <Tooltip title="Reativar">
              <Popconfirm
                title="Reativar especialidade?"
                description="A especialidade voltará a estar disponível."
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
            <>
              <Tooltip title="Editar">
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined style={{ color: '#0984e3' }} />}
                  onClick={() => openEdit(record)}
                />
              </Tooltip>
              <Tooltip title="Excluir">
                <Popconfirm
                  title="Excluir especialidade?"
                  description="A especialidade poderá ser reativada posteriormente."
                  onConfirm={() => handleDelete(record.id)}
                  okText="Excluir"
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
            </>
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
            Especialidades
          </Title>
          <Text style={{ color: '#636E72' }}>Gerencie as especialidades odontológicas</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: '#6C5CE7', borderColor: '#6C5CE7', borderRadius: 8, height: 40 }}
          onClick={() => setCreateOpen(true)}
        >
          Nova Especialidade
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={fetchSpecialisms}>
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
            placeholder="Buscar por nome ou descrição..."
            prefix={<SearchOutlined style={{ color: '#636E72' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360, borderRadius: 8 }}
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
          locale={{ emptyText: 'Nenhuma especialidade encontrada' }}
        />
      </Card>

      {/* Create specialism modal */}
      <Modal
        title="Nova Especialidade"
        open={createOpen}
        onCancel={() => { setCreateOpen(false); createForm.resetFields(); }}
        footer={null}
        destroyOnClose
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate} style={{ marginTop: 16 }}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Informe o nome' }, { min: 3, message: 'Mínimo 3 caracteres' }]}
          >
            <Input placeholder="Ex: Endodontia" />
          </Form.Item>
          <Form.Item
            label="Descrição"
            name="description"
          >
            <TextArea rows={3} placeholder="Descrição opcional..." />
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

      {/* Edit specialism modal */}
      <Modal
        title="Editar Especialidade"
        open={!!editSpecialism}
        onCancel={() => { setEditSpecialism(null); editForm.resetFields(); }}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit} style={{ marginTop: 16 }}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Informe o nome' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Descrição" name="description">
            <TextArea rows={3} />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => { setEditSpecialism(null); editForm.resetFields(); }}>
              Cancelar
            </Button>
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
