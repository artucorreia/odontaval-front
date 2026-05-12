import { useEffect, useRef, useState } from 'react';
import { Button, Spin } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/api';
import LogoWhite from '../assets/logo-white.svg';

type Status = 'loading' | 'success' | 'error' | 'invalid';

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const called = useRef(false);

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    if (!userId || !token) {
      setStatus('invalid');
      return;
    }

    authService
      .confirmEmail(userId, token)
      .then(() => setStatus('success'))
      .catch((err: unknown) => {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        const msg = axiosErr?.response?.data?.message ?? 'Erro ao confirmar e-mail.';
        setErrorMsg(msg);
        setStatus('error');
      });
  }, [userId, token]);

  const isInvalidOrError = status === 'invalid' || status === 'error';

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary-dark p-8 text-white text-center">
            <div className="flex justify-center mb-3">
              <img src={LogoWhite} alt="Logo" className="size-16" />
            </div>
            <h1 className="text-2xl font-bold tracking-widest mb-1">ODONTAVAL</h1>
            <p className="text-sm text-white/75">Confirmação de e-mail</p>
          </div>

          <div className="p-10 text-center">
            {status === 'loading' && (
              <>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#6C5CE7' }} spin />} />
                <p className="text-base font-semibold text-secondary mt-5 mb-1">
                  Confirmando seu e-mail...
                </p>
                <p className="text-sm text-muted">Aguarde um instante.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircleFilled style={{ fontSize: 52, color: '#00B894' }} />
                <h2 className="text-lg font-semibold text-secondary mt-4 mb-2">
                  E-mail confirmado!
                </h2>
                <p className="text-sm text-muted mb-7">
                  Sua conta foi ativada com sucesso. Agora você já pode fazer login.
                </p>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate('/login')}
                  className="h-11 rounded-lg font-semibold text-base"
                  style={{ background: '#6C5CE7', borderColor: '#6C5CE7' }}
                >
                  Ir para o login
                </Button>
              </>
            )}

            {isInvalidOrError && (
              <>
                <CloseCircleFilled style={{ fontSize: 52, color: '#ff4d4f' }} />
                <h2 className="text-lg font-semibold text-secondary mt-4 mb-2">
                  {status === 'invalid' ? 'Link inválido' : 'Falha na confirmação'}
                </h2>
                <p className="text-sm text-muted mb-7">
                  {status === 'invalid'
                    ? 'Este link de confirmação é inválido. Verifique se o link do e-mail está completo.'
                    : errorMsg}
                </p>
                <Button
                  type="primary"
                  block
                  onClick={() => navigate('/login')}
                  className="h-11 rounded-lg font-semibold text-base"
                  style={{ background: '#6C5CE7', borderColor: '#6C5CE7' }}
                >
                  Voltar ao login
                </Button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted mt-4">
          © 2025 ODONTAVAL. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
