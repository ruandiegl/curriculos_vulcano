import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { api } from '../../services/api';
import { isValidEmail, normalizeEmail } from '../../utils/email';
import {
  Brand,
  Card,
  Description,
  Field,
  Form,
  FormMessage,
  LoginButton,
  LoginIcon,
  Page,
  PhotoPanel,
  ReturnButton,
} from './styles';

type LocationState = {
  email?: string;
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [email, setEmail] = useState(state?.email ?? '');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Informe seu e-mail para recuperar o acesso.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Informe um e-mail válido.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/login/forgot-password', {
        email: normalizeEmail(email),
      });
      setSuccessMessage('Se o e-mail estiver cadastrado, enviaremos um link para atualizar seu acesso.');
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Não foi possível solicitar a recuperação.',
        );
        return;
      }

      setErrorMessage('Não foi possível solicitar a recuperação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <Form onSubmit={handleRequest}>
          <Brand>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>

          <h1>Recuperar acesso</h1>
          <Description>
            Informe seu e-mail. Enviaremos um link seguro para criar ou redefinir sua senha.
          </Description>

          <Field>
            <span>E-mail</span>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>

          {errorMessage && <FormMessage role="alert">{errorMessage}</FormMessage>}
          {successMessage && <FormMessage $success>{successMessage}</FormMessage>}

          <LoginButton type="submit" disabled={loading}>
            <LoginIcon aria-hidden="true">
              <span className="head" />
              <span className="body" />
              <span className="plus horizontal" />
              <span className="plus vertical" />
            </LoginIcon>
            {loading ? 'Enviando...' : 'Enviar link'}
          </LoginButton>

          <ReturnButton type="button" onClick={() => navigate('/')}>
            Voltar ao login
          </ReturnButton>
        </Form>

        <PhotoPanel />
      </Card>
    </Page>
  );
}
