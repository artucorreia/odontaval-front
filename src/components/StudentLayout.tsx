import { Layout, Avatar, Dropdown, Typography } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoWhite from '../assets/logo-white.svg';

const { Header, Content } = Layout;
const { Text } = Typography;

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials =
    user?.name
      ?.split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('') ?? 'A';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f6fa' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              background: '#722ed1',
              borderRadius: 8,
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img src={LogoWhite} style={{ width: 28, height: 28 }} alt="Logo" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#2D3436', lineHeight: 1.2 }}>
              ODONTAVAL
            </div>
            <div style={{ fontSize: 11, color: '#8c8c8c', lineHeight: 1.4 }}>Portal do Aluno</div>
          </div>
        </div>

        <Dropdown
          menu={{
            items: [
              { key: 'profile', icon: <UserOutlined />, label: 'Meu Perfil' },
              { type: 'divider' as const },
              { key: 'logout', icon: <LogoutOutlined />, label: 'Sair', danger: true },
            ],
            onClick: ({ key }) => {
              if (key === 'logout') handleLogout();
              else if (key === 'profile') navigate('/alunos/me/perfil');
            },
          }}
          placement="bottomRight"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 8,
            }}
          >
            <Avatar style={{ background: '#722ed1', fontSize: 13, fontWeight: 600 }} size={36}>
              {initials}
            </Avatar>
            <Text
              style={{ fontSize: 13, fontWeight: 600, color: '#2D3436' }}
              className="hidden sm:block"
            >
              {user?.name}
            </Text>
          </div>
        </Dropdown>
      </Header>

      <Content
        style={{
          padding: '24px',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}
