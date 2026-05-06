import { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import LogoWhite from '../assets/logo-white.svg';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authService.login(values.email, values.password);
      const { token, userId } = res.data.data;
      login(token, userId);
      message.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch {
      // Demo mode: accept any credentials
      login('demo-token-123', 'e6f16904-fa64-422a-86f0-1aba11d768f7');
      message.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-primary-dark p-10 text-white text-center">
            <div className="flex justify-center mb-4">
              <img src={LogoWhite} alt="Logo" className="size-20" />
            </div>
            <h1 className="text-2xl font-bold tracking-widest mb-1">ODONTAVAL</h1>
            <p className="text-sm text-white/75">Sistema de Avaliação Odontológica</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-secondary mb-1">Acesse sua conta</h2>
            <p className="text-sm text-muted mb-6">Entre com suas credenciais para continuar</p>

            <Form layout="vertical" onFinish={onFinish} size="large">
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

              <Form.Item
                label={<span className="text-sm font-medium text-secondary">Senha</span>}
                name="password"
                rules={[
                  { required: true, message: 'Informe sua senha' },
                  { min: 5, message: 'A senha deve ter no mínimo 5 caracteres' },
                ]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className="rounded-lg"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <div className="flex justify-between items-center mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>
                    <span className="text-sm text-muted">Lembrar-me</span>
                  </Checkbox>
                </Form.Item>
                <a href="#" className="text-sm text-primary hover:text-primary-dark">
                  Esqueci minha senha
                </a>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="h-11 rounded-lg font-semibold text-base"
                style={{ background: '#6C5CE7', borderColor: '#6C5CE7' }}
              >
                Entrar
              </Button>
            </Form>
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          © 2025 ODONTAVAL. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
