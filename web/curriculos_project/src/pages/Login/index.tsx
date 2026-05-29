import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/api';
import { isValidEmail, normalizeEmail } from '../../utils/email';
import {
  Brand,
  Card,
  Field,
  ForgotLink,
  Form,
  FormMessage,
  LoginButton,
  LoginIcon,
  ModalActions,
  ModalBackdrop,
  ModalButton,
  Page,
  PhotoPanel,
  RecoveryModal,
  SignupText,
} from './styles';

type LoginResponse = {
  token: string;
  user?: {
    id: string;
    nome?: string;
    email?: string;
    tipo?: string;
    possuiCurriculo?: boolean;
  };
};

type LoginErrorResponse = {
  code?: string;
  message?: string;
  error?: string;
};

function getLoginRedirectPath(user?: LoginResponse['user']) {
  if (user?.tipo === 'admin') {
    return '/dashboard';
  }

  if (user?.possuiCurriculo) {
    return '/profile';
  }

  return '/newCurriculum';
}

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Informe email e senha para entrar.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Informe um email valido.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post<LoginResponse>('/login', {
        email: normalizeEmail(email),
        password,
      });

      signIn(response.data.token, response.data.user);
      navigate(getLoginRedirectPath(response.data.user), { replace: true });
    } catch (error) {
      if (axios.isAxiosError<LoginErrorResponse>(error)) {
        const responseMessage = error.response?.data?.message ?? '';

        if (
          error.response?.data?.code === 'PASSWORD_SETUP_REQUIRED' ||
          responseMessage.toLowerCase().includes('precisa criar uma senha')
        ) {
          setErrorMessage('');
          setShowRecoveryModal(true);
          return;
        }

        setErrorMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Nao foi possivel fazer o login. Verifique suas credenciais.',
        );
        return;
      }

      setErrorMessage('Nao foi possivel fazer o login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <Form onSubmit={handleLogin}>
          <Brand>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <h1>Faça seu Login</h1>

          <Field>
            <span>Email</span>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>

          <Field>
            <span>Senha</span>
            <input
              type="password"
              placeholder="Senha"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>

          {errorMessage && <FormMessage role="alert">{errorMessage}</FormMessage>}

          <LoginButton type="submit" disabled={loading}>
            <LoginIcon aria-hidden="true">
              <span className="head" />
              <span className="body" />
              <span className="plus horizontal" />
              <span className="plus vertical" />
            </LoginIcon>
            {loading ? 'Entrando...' : 'Login'}
          </LoginButton>

          <ForgotLink
            href="/forgot-password"
            onClick={(event) => {
              event.preventDefault();
              navigate('/forgot-password');
            }}
          >
            Esqueci minha senha
          </ForgotLink>

          <SignupText>
            Não tem uma conta?{' '}
            <button type="button" onClick={() => navigate('/register')}>
              Cadastro
            </button>
          </SignupText>
        </Form>

        <PhotoPanel />
      </Card>

      {showRecoveryModal && (
        <ModalBackdrop role="presentation">
          <RecoveryModal role="dialog" aria-modal="true" aria-labelledby="recovery-modal-title">
            <h2 id="recovery-modal-title">Crie sua senha de acesso</h2>
            <p>
              Encontramos seu cadastro antigo. Para acessar a plataforma, confirme seus dados e
              crie uma senha nova.
            </p>
            <ModalActions>
              <ModalButton
                type="button"
                onClick={() => navigate('/recover-acces', { state: { email: normalizeEmail(email) } })}
              >
                Continuar
              </ModalButton>
              <ModalButton type="button" $secondary onClick={() => setShowRecoveryModal(false)}>
                Agora nao
              </ModalButton>
            </ModalActions>
          </RecoveryModal>
        </ModalBackdrop>
      )}
    </Page>
  );
}
