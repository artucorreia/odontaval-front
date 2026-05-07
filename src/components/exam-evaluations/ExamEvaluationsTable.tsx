import { Table, Tag, Button, Space, Tooltip, Popconfirm, Empty, Input } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { EvaluationRecord } from './types';

interface Props {
  data: EvaluationRecord[];
  search: string;
  onSearchChange: (v: string) => void;
  onView: (record: EvaluationRecord) => void;
  onEdit: (record: EvaluationRecord) => void;
  onDelete: (id: number) => void;
}

function conceptTag(value: number) {
  const color =
    value >= 9 ? 'success' : value >= 7 ? 'purple' : value >= 5 ? 'warning' : 'error';
  return (
    <Tag color={color} style={{ fontWeight: 700, fontSize: 13, padding: '2px 10px' }}>
      {value.toFixed(1)}
    </Tag>
  );
}

export default function ExamEvaluationsTable({
  data,
  search,
  onSearchChange,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const filtered = data.filter((e) =>
    e.studentName.toLowerCase().includes(search.toLowerCase()),
  );

  const columns: ColumnsType<EvaluationRecord> = [
    {
      title: 'Aluno',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name: string) => <span className="font-semibold text-sm">{name}</span>,
      sorter: (a, b) => a.studentName.localeCompare(b.studentName),
    },
    {
      title: 'Conceito',
      dataIndex: 'concept',
      key: 'concept',
      align: 'center',
      width: 100,
      sorter: (a, b) => b.concept - a.concept,
      defaultSortOrder: 'ascend',
      render: (value: number) => conceptTag(value),
    },
    {
      title: 'Status',
      key: 'status',
      align: 'center',
      width: 110,
      responsive: ['sm'],
      render: (_v, record) => (
        <Tag color={record.concept >= 7 ? 'success' : 'error'}>
          {record.concept >= 7 ? 'Aprovado' : 'Reprovado'}
        </Tag>
      ),
    },
    {
      title: 'Pont.',
      dataIndex: 'punctuality',
      key: 'punctuality',
      align: 'center',
      width: 65,
      responsive: ['lg'],
      render: (v: number) => (
        <span style={{ fontSize: 12, color: '#636E72' }}>{v.toFixed(1)}</span>
      ),
    },
    {
      title: 'Instr.',
      dataIndex: 'instrumental',
      key: 'instrumental',
      align: 'center',
      width: 65,
      responsive: ['lg'],
      render: (v: number) => (
        <span style={{ fontSize: 12, color: '#636E72' }}>{v.toFixed(1)}</span>
      ),
    },
    {
      title: 'Bioseg.',
      dataIndex: 'biosecurity',
      key: 'biosecurity',
      align: 'center',
      width: 65,
      responsive: ['lg'],
      render: (v: number) => (
        <span style={{ fontSize: 12, color: '#636E72' }}>{v.toFixed(1)}</span>
      ),
    },
    {
      title: 'Ética',
      dataIndex: 'ethics',
      key: 'ethics',
      align: 'center',
      width: 65,
      responsive: ['xl'],
      render: (v: number) => (
        <span style={{ fontSize: 12, color: '#636E72' }}>{v.toFixed(1)}</span>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      align: 'right',
      width: 110,
      render: (_, record) => (
        <Space size={0}>
          <Tooltip title="Ver detalhes">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined style={{ color: '#6C5CE7' }} />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ color: '#636E72' }} />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Remover avaliação?"
            description="Esta ação não pode ser desfeita."
            onConfirm={() => onDelete(record.id)}
            okText="Remover"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Remover">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined style={{ color: '#E17055' }} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Buscar por aluno..."
          prefix={<SearchOutlined style={{ color: '#636E72' }} />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ maxWidth: 320, borderRadius: 8 }}
          allowClear
        />
      </div>
      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `${total} avaliações`,
        }}
        locale={{ emptyText: <Empty description="Nenhuma avaliação encontrada" /> }}
        scroll={{ x: 500 }}
      />
    </div>
  );
}
