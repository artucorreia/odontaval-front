import { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Space,
  Typography,
  Tag,
  Modal,
  Form,
  DatePicker,
  Select,
  Tooltip,
  Popconfirm,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import ResponsiveTable from '../components/ResponsiveTable';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, BarChartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { MOCK_EXAMS, MOCK_SPECIALISMS } from '../utils/mockData';
import type { Exam } from '../types';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ExamsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
  const [modal, setModal] = useState(false);
  const [form] = Form.useForm();

  const filtered = exams.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.specialism?.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const newExam: Exam = {
        id: Date.now(),
        title: values.title,
        date: values.date?.format('YYYY-MM-DD') ?? '',
        academicSemester: values.academicSemester,
        goals: values.goals ?? '',
        serviceUnit: values.serviceUnit ?? '',
        procedurePerformed: values.procedurePerformed ?? '',
        professorId: 'prof-001',
        specialismId: values.specialismId,
        specialism: MOCK_SPECIALISMS.find((s) => s.id === values.specialismId),
      };
      setExams([newExam, ...exams]);
      message.success('Exame criado com sucesso!');
      setModal(false);
      form.resetFields();
    } catch {}
  };

  const columns: ColumnsType<Exam> = [
    {
      title: 'Título',
      key: 'title',
      render: (_, r) => <span className="font-semibold text-secondary">{r.title}</span>,
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
          {r.specialism?.name ?? '—'}
        </Tag>
      ),
    },
    {
      title: 'Data',
      key: 'date',
      render: (_, r) => new Date(r.date).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Semestre',
      dataIndex: 'academicSemester',
    },
    {
      title: 'Unidade',
      dataIndex: 'serviceUnit',
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      render: (_, r) => (
        <Space>
          <Tooltip title="Ver Dashboard">
            <Button
              type="text"
              icon={<BarChartOutlined style={{ color: '#6C5CE7' }} />}
              onClick={() => navigate(`/exames/${r.id}`)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button type="text" icon={<EditOutlined style={{ color: '#636E72' }} />} />
          </Tooltip>
          <Popconfirm
            title="Remover exame?"
            onConfirm={() => {
              setExams(exams.filter((e) => e.id !== r.id));
              message.success('Exame removido!');
            }}
            okText="Remover"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined style={{ color: '#E17055' }} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={2} style={{ margin: 0, color: '#2D3436', fontWeight: 700 }}>
            Exames
          </Title>
          <Text style={{ color: '#636E72' }}>Gerencie os exames e avaliações clínicas</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: '#6C5CE7', borderColor: '#6C5CE7', borderRadius: 8, height: 40 }}
          onClick={() => setModal(true)}
        >
          Novo Exame
        </Button>
      </div>

      <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
        <div className="mb-4">
          <Input
            placeholder="Buscar exames..."
            prefix={<SearchOutlined style={{ color: '#636E72' }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360, borderRadius: 8 }}
          />
        </div>
        <ResponsiveTable columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title="Novo Exame"
        open={modal}
        onOk={handleAdd}
        onCancel={() => {
          setModal(false);
          form.resetFields();
        }}
        okText="Criar"
        cancelText="Cancelar"
        okButtonProps={{ style: { background: '#6C5CE7', borderColor: '#6C5CE7' } }}
        width={560}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item label="Título" name="title" rules={[{ required: true }]}>
            <Input placeholder="Ex: Avaliação Clínica em Endodontia" />
          </Form.Item>
          <Form.Item label="Especialidade" name="specialismId" rules={[{ required: true }]}>
            <Select placeholder="Selecione...">
              {MOCK_SPECIALISMS.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Data" name="date" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Semestre Letivo" name="academicSemester" rules={[{ required: true }]}>
            <Select>
              {['2025.1', '2025.2', '2024.2'].map((s) => (
                <Select.Option key={s} value={s}>
                  {s}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Unidade de Atendimento" name="serviceUnit" rules={[{ required: true }]}>
            <Input placeholder="Ex: Box 02" />
          </Form.Item>
          <Form.Item
            label="Procedimento Realizado"
            name="procedurePerformed"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ex: Tratamento de canal" />
          </Form.Item>
          <Form.Item label="Objetivos" name="goals">
            <TextArea rows={3} placeholder="Descreva os objetivos da avaliação..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
