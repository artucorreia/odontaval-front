import { useState } from 'react';
import { Form, Input, Button, Avatar, Card, Typography, Divider, message } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';

const { Title, Text } = Typography;

const PASSWORD_RULES = [
  { key: 'min8',   label: 'Mínimo 8 caracteres',      test: (p: string) => p.length >= 8 },
  { key: 'upper',  label: 'Letra maiúscula (A–Z)',     test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lower',  label: 'Letra minúscula (a–z)',     test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', label: 'Número (0–9)',               test: (p: string) => /[0-9]/.test(p) },
  { key: 'symbol', label: 'Símbolo (!@#$%...)',         test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordRequirements({ password }: { password: string }) {
  if (!password) return null;
  return (
    <div
      style={{
        background: '#f8fafc',
        borderRadius: 8,
        padding: '10px 14px',
        marginBottom: 16,
        border: '1px solid #f0f0f0',
      }}
    >
      <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6, fontWeight: 600, letterSpacing: '0.03em' }}>
        A SENHA DEVE CONTER
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(password);
          return (
            <div key={rule.key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {met ? (
                <CheckCircleFilled style={{ fontSize: 13, color: '#00B894', flexShrink: 0 }} />
              ) : (
                <CloseCircleFilled style={{ fontSize: 13, color: '#d1d5db', flexShrink: 0 }} />
              )}
              <span
                style={{
                  fontSize: 12.5,
                  color: met ? '#00B894' : '#94a3b8',
                  textDecoration: met ? 'line-through' : 'none',
                  fontWeight: met ? 600 : 400,
                  transition: 'color 0.2s, text-decoration 0.2s',
                }}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const allRulesMet = PASSWORD_RULES.every((r) => r.test(newPassword));

  const initials =
    user?.name
      ?.split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('') ?? 'U';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : '—';

  const onProfileFinish = async (values: { name: string; email: string }) => {
    if (!user?.id) return;
    setProfileLoading(true);
    try {
      const res = await userService.update(user.id, { name: values.name.trim(), email: values.email.trim() });
      const updated = res.data?.data;
      if (updated) {
        updateUser({ name: updated.name, email: updated.email });
      }
      message.success('Perfil atualizado com sucesso.');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      message.error(axiosErr?.response?.data?.message ?? 'Erro ao atualizar perfil.');
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordFinish = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!user?.id) return;
    if (!allRulesMet) {
      message.error('A nova senha não atende todos os requisitos.');
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      message.error('As senhas não coincidem.');
      return;
    }
    setPasswordLoading(true);
    try {
      await userService.updatePassword(user.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Senha alterada com sucesso.');
      passwordForm.resetFields();
      setNewPassword('');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      message.error(axiosErr?.response?.data?.message ?? 'Erro ao alterar senha.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#2D3436' }}>
          Meu Perfil
        </Title>
        <Text style={{ color: '#636E72' }}>Gerencie suas informações pessoais e senha</Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Left: identity card ─────────────────────────────────────── */}
        <Card style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}>
          <div className="text-center">
            <Avatar
              style={{ background: '#6C5CE7', fontSize: 28, fontWeight: 700 }}
              size={80}
            >
              {initials}
            </Avatar>
            <Title level={4} style={{ margin: '16px 0 4px', color: '#2D3436' }}>
              {user?.name ?? '—'}
            </Title>
            <Text style={{ color: '#636E72', fontSize: 13 }}>{user?.email ?? '—'}</Text>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.03em' }}>
                  PERFIL
                </Text>
                <div style={{ fontSize: 13, color: '#2D3436', fontWeight: 500, marginTop: 2 }}>
                  {user?.roles?.[0]?.name === 'STUDENT'
                    ? 'Aluno'
                    : user?.roles?.[0]?.name === 'PROFESSOR'
                    ? 'Professor'
                    : 'Admin'}
                </div>
              </div>
              {user?.createdAt && (
                <div>
                  <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.03em' }}>
                    MEMBRO DESDE
                  </Text>
                  <div style={{ fontSize: 13, color: '#2D3436', fontWeight: 500, marginTop: 2 }}>
                    {memberSince}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ── Right: forms ────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Edit profile */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <UserOutlined style={{ color: '#6C5CE7' }} />
                <span>Informações pessoais</span>
              </div>
            }
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
          >
            <Form
              layout="vertical"
              form={profileForm}
              onFinish={onProfileFinish}
              size="large"
              initialValues={{ name: user?.name ?? '', email: user?.email ?? '' }}
            >
              <Form.Item
                label={<span className="text-sm font-medium text-secondary">Nome completo</span>}
                name="name"
                rules={[
                  { required: true, message: 'Informe seu nome' },
                  { min: 2, message: 'Mínimo 2 caracteres' },
                  { max: 50, message: 'Máximo 50 caracteres' },
                ]}
              >
                <Input placeholder="Seu nome completo" className="rounded-lg" />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm font-medium text-secondary">E-mail</span>}
                name="email"
                rules={[
                  { required: true, message: 'Informe seu e-mail' },
                  { type: 'email', message: 'E-mail inválido' },
                ]}
              >
                <Input placeholder="seu@email.com" className="rounded-lg" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={profileLoading}
                style={{ background: '#6C5CE7', borderColor: '#6C5CE7' }}
                className="rounded-lg font-semibold"
              >
                Salvar alterações
              </Button>
            </Form>
          </Card>

          {/* Change password */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LockOutlined style={{ color: '#6C5CE7' }} />
                <span>Alterar senha</span>
              </div>
            }
            style={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
          >
            <Form
              layout="vertical"
              form={passwordForm}
              onFinish={onPasswordFinish}
              size="large"
            >
              <Form.Item
                label={<span className="text-sm font-medium text-secondary">Senha atual</span>}
                name="currentPassword"
                rules={[{ required: true, message: 'Informe a senha atual' }]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className="rounded-lg"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-sm font-medium text-secondary">Nova senha</span>}
                name="newPassword"
                rules={[
                  { required: true, message: 'Informe a nova senha' },
                  {
                    validator: (_, value) => {
                      if (!value || PASSWORD_RULES.every((r) => r.test(value))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('A senha não atende todos os requisitos'));
                    },
                  },
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className="rounded-lg"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordForm.getFieldValue('confirmPassword')) {
                      passwordForm.validateFields(['confirmPassword']);
                    }
                  }}
                />
              </Form.Item>

              <PasswordRequirements password={newPassword} />

              <Form.Item
                label={<span className="text-sm font-medium text-secondary">Confirmar nova senha</span>}
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Confirme a nova senha' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('As senhas não coincidem'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className="rounded-lg"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={passwordLoading}
                disabled={newPassword.length > 0 && !allRulesMet}
                style={{ background: '#6C5CE7', borderColor: '#6C5CE7' }}
                className="rounded-lg font-semibold"
              >
                Alterar senha
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
