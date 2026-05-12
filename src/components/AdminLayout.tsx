import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Tag } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  UserOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoWhite from '../assets/logo-white.svg';

const { Sider, Header, Content } = Layout;

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/admin/usuarios', icon: <TeamOutlined />, label: 'Usuários' },
  { key: '/admin/avaliacoes', icon: <FileTextOutlined />, label: 'Avaliações' },
  { key: '/admin/especialidades', icon: <StarOutlined />, label: 'Especialidades' },
  { key: '/admin/relatorios', icon: <BarChartOutlined />, label: 'Relatórios' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Meu Perfil' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Sair', danger: true },
  ];

  const handleUserMenu = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else if (key === 'profile') {
      navigate('/admin/perfil');
    }
  };

  const initials =
    user?.name
      ?.split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('') ?? 'U';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        collapsedWidth={72}
        collapsed={collapsed}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 100,
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        }}
      >
        <div
          className="logo-brand"
          style={{
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '20px 0' : '20px 24px',
          }}
        >
          <div className="bg-primary rounded-lg w-12 h-12 flex items-center justify-center">
            <img src={LogoWhite} className="size-9" />
          </div>
          {!collapsed && (
            <div>
              <span className="brand-name">ODONTAVAL</span>
              <Tag color="gold" style={{ marginLeft: 6, fontSize: 10, padding: '0 2px' }}>
                ADMIN
              </Tag>
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: 'none', marginTop: 8 }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 24,
            width: '100%',
            padding: collapsed ? '0 16px' : '0 16px',
          }}
        >
          <Menu
            mode="inline"
            items={[{ key: 'logout', icon: <LogoutOutlined />, label: 'Sair', danger: true }]}
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{ border: 'none' }}
          />
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 72 : 220, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 18, color: '#636E72' }}
          />

          <Space size={16}>
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenu }}
              placement="bottomRight"
            >
              <div className="flex items-center gap-3 cursor-pointer px-2 py-1 rounded-lg hover:bg-surface transition-colors">
                <Avatar style={{ background: '#f39c12', fontSize: 13, fontWeight: 600 }} size={36}>
                  {initials}
                </Avatar>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-secondary leading-tight">
                    {user?.name}
                  </div>
                </div>
              </div>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
