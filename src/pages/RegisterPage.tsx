import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import LogoWhite from '../assets/logo-white.svg';

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

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const allRulesMet = PASSWORD_RULES.every((r) => r.test(password));

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (!allRulesMet) {
      message.error('A senha não atende todos os requisitos.');
      return;
    }
    if (values.password !== values.confirmPassword) {
      message.error('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const teste = await authService.register(values.name.trim(), values.email.trim(), values.password);
      console.log('Registro bem-sucedido:', teste);
      message.success('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      const msg = axiosErr?.response?.data?.message ?? 'Erro ao criar conta. Tente novamente.';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-primary-dark p-8 text-white text-center">
            <div className="flex justify-center mb-3">
              <img src={LogoWhite} alt="Logo" className="size-16" />
            </div>
            <h1 className="text-2xl font-bold tracking-widest mb-1">ODONTAVAL</h1>
            <p className="text-sm text-white/75">Crie sua conta para começar</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-secondary mb-1">Criar conta</h2>
            <p className="text-sm text-muted mb-6">Preencha os dados abaixo para se cadastrar</p>

            <Form layout="vertical" form={form} onFinish={onFinish} size="large">
              {/* Name */}
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

              {/* Email */}
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

              {/* Password */}
              <Form.Item
                label={<span className="text-sm font-medium text-secondary">Senha</span>}
                name="password"
                rules={[
                  { required: true, message: 'Informe uma senha' },
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
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (form.getFieldValue('confirmPassword')) {
                      form.validateFields(['confirmPassword']);
                    }
                  }}
                />
              </Form.Item>

              {/* Requirements checklist — appears as soon as user starts typing */}
              <PasswordRequirements password={password} />

              {/* Confirm password */}
              <Form.Item
                label={<span className="text-sm font-medium text-secondary">Confirmar senha</span>}
                name="confirmPassword"
                rules={[
                  { required: true, message: 'Confirme sua senha' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
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
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
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
                Criar conta
              </Button>
            </Form>
          </div>
        </div>

        <p className="text-center text-sm text-muted mt-4">
          Já tem uma conta?{' '}
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
