import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Informe seu email para recuperar a senha.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Informe um email válido.');
      return;
    }

    try {
      setLoading(true);

      await api.post('/login/forgot-password', { email: normalizeEmail(email) });

      setSuccessMessage(
        'Se este email estiver cadastrado, enviaremos um link para redefinir sua senha.',
      );
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Nao foi possivel solicitar a redefinicao de senha.',
        );
        return;
      }

      setErrorMessage('Nao foi possivel solicitar a redefinicao de senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <Form onSubmit={handleForgotPassword}>
          <Brand>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <h1>Recuperar senha</h1>
          <Description>Digite seu email para receber o link de redefinicao de senha.</Description>

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
