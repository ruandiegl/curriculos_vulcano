import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { api } from '../../services/api';
import { isValidEmail, normalizeEmail } from '../../utils/email';
import { formatCpf, onlyDigits } from '../../utils/masks';
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

type RecoveryMatchResponse = {
  recoveryToken: string;
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isPasswordStep = Boolean(recoveryToken);

  async function handleMatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Informe seu e-mail para recuperar a senha.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Informe um e-mail válido.');
      return;
    }

    if (onlyDigits(cpf).length !== 11) {
      setErrorMessage('Informe um CPF válido.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post<RecoveryMatchResponse>('/login/recovery-match', {
        email: normalizeEmail(email),
        cpf: onlyDigits(cpf),
      });

      setRecoveryToken(response.data.recoveryToken);
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Não foi possível confirmar seus dados.',
        );
        return;
      }

      setErrorMessage('Não foi possível confirmar seus dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!password || !confirmPassword) {
      setErrorMessage('Informe e confirme a nova senha.');
      return;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setErrorMessage('A senha deve ter no minimo 8 caracteres, incluindo letras e números.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas informadas não conferem.');
      return;
    }

    try {
      setLoading(true);

      await api.post('/login/setup-password', {
        token: recoveryToken,
        password,
      });

      setSuccessMessage('Senha redefinida com sucesso. Redirecionando para o login...');
      setTimeout(() => navigate('/'), 900);
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Não foi possível redefinir a senha.',
        );
        return;
      }

      setErrorMessage('Não foi possível redefinir a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <Form onSubmit={isPasswordStep ? handleResetPassword : handleMatch}>
          <Brand>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>

          <h1>{isPasswordStep ? 'Nova senha' : 'Recuperar senha'}</h1>
          <Description>
            {isPasswordStep
              ? 'Digite sua nova senha para concluir a recuperação de acesso.'
              : 'Confirme seu e-mail e CPF para redefinir sua senha.'}
          </Description>

          {!isPasswordStep ? (
            <>
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

              <Field>
                <span>CPF</span>
                <input
                  type="text"
                  placeholder="CPF"
                  inputMode="numeric"
                  autoComplete="off"
                  value={cpf}
                  onChange={(event) => setCpf(formatCpf(event.target.value))}
                />
              </Field>
            </>
          ) : (
            <>
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
            </>
          )}

          {errorMessage && <FormMessage role="alert">{errorMessage}</FormMessage>}
          {successMessage && <FormMessage $success>{successMessage}</FormMessage>}

          <LoginButton type="submit" disabled={loading}>
            <LoginIcon aria-hidden="true">
              <span className="head" />
              <span className="body" />
              <span className="plus horizontal" />
              <span className="plus vertical" />
            </LoginIcon>
            {loading ? 'Validando...' : isPasswordStep ? 'Redefinir senha' : 'Continuar'}
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
