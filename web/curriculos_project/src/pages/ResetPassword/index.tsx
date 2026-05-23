import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { api } from '../../services/api';
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token') ?? searchParams.get('oobCode') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!resetToken) {
      setErrorMessage('Link de redefinicao invalido ou expirado.');
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMessage('Informe e confirme a nova senha.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter no minimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas informadas nao conferem.');
      return;
    }

    try {
      setLoading(true);

      await api.post('/login/reset-password', {
        token: resetToken,
        password,
      });

      setSuccessMessage('Senha redefinida com sucesso. Redirecionando para o login...');
      setTimeout(() => navigate('/'), 900);
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Nao foi possivel redefinir a senha.',
        );
        return;
      }

      setErrorMessage('Nao foi possivel redefinir a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <Form onSubmit={handleResetPassword}>
          <Brand>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <h1>Nova senha</h1>
          <Description>Digite sua nova senha para concluir a recuperacao de acesso.</Description>

          <Field>
            <span>Nova senha</span>
            <input
              type="password"
              placeholder="Nova senha"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>

          <Field>
            <span>Confirmar senha</span>
            <input
              type="password"
              placeholder="Confirmar senha"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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
            {loading ? 'Salvando...' : 'Redefinir senha'}
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
