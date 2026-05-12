import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/api';
import LogoWhite from '../assets/logo-white.svg';

const PASSWORD_RULES = [
  { key: 'min8',   label: 'Mínimo 8 caracteres',  test: (p: string) => p.length >= 8 },
  { key: 'upper',  label: 'Letra maiúscula (A–Z)', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lower',  label: 'Letra minúscula (a–z)', test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', label: 'Número (0–9)',           test: (p: string) => /[0-9]/.test(p) },
  { key: 'symbol', label: 'Símbolo (!@#$%...)',     test: (p: string) => /[^A-Za-z0-9]/.test(p) },
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

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  const allRulesMet = PASSWORD_RULES.every((r) => r.test(password));

  if (!userId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm w-full text-center">
          <CloseCircleFilled style={{ fontSize: 48, color: '#ff4d4f' }} />
          <h2 className="text-lg font-semibold text-secondary mt-4 mb-2">Link inválido</h2>
          <p className="text-sm text-muted mb-6">
            Este link de recuperação é inválido ou expirou. Solicite um novo link.
          </p>
          <Button
            type="primary"
            block
            onClick={() => navigate('/login')}
            className="h-10 rounded-lg font-semibold"
            style={{ background: '#6C5CE7', borderColor: '#6C5CE7' }}
          >
            Voltar ao login
          </Button>
        </div>
      </div>
    );
  }

  const onFinish = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!allRulesMet) {
      message.error('A senha não atende todos os requisitos.');
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      message.error('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(userId, token, values.newPassword);
      message.success('Senha alterada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr?.response?.data?.message ?? 'Erro ao redefinir senha. O link pode ter expirado.';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary-dark p-8 text-white text-center">
            <div className="flex justify-center mb-3">
              <img src={LogoWhite} alt="Logo" className="size-16" />
            </div>
            <h1 className="text-2xl font-bold tracking-widest mb-1">ODONTAVAL</h1>
            <p className="text-sm text-white/75">Redefinição de senha</p>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-semibold text-secondary mb-1">Nova senha</h2>
            <p className="text-sm text-muted mb-6">Escolha uma nova senha para sua conta</p>

            <Form layout="vertical" form={form} onFinish={onFinish} size="large">
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
                    setPassword(e.target.value);
                    if (form.getFieldValue('confirmPassword')) {
                      form.validateFields(['confirmPassword']);
                    }
                  }}
                />
              </Form.Item>

              <PasswordRequirements password={password} />

              <Form.Item
                label={<span className="text-sm font-medium text-secondary">Confirmar senha</span>}
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Confirme sua senha' },
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
                block
                loading={loading}
                disabled={password.length > 0 && !allRulesMet}
                className="h-11 rounded-lg font-semibold text-base"
                style={{ background: '#6C5CE7', borderColor: '#6C5CE7', marginTop: 4 }}
              >
                Redefinir senha
              </Button>
            </Form>
          </div>
        </div>

        <p className="text-center text-sm text-muted mt-4">
          Lembrou sua senha?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Fazer login
          </button>
        </p>

        <p className="text-center text-xs text-muted mt-3">
          © 2025 ODONTAVAL. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
