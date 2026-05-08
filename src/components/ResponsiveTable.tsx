import { Table } from 'antd';
import type { TableProps } from 'antd';

export default function ResponsiveTable<T extends object>({ scroll, ...props }: TableProps<T>) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <Table scroll={{ x: 'max-content', ...scroll }} {...props} />
    </div>
  );
}
