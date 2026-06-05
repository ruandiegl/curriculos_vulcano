import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { api } from '../../services/api';
import { isValidEmail, normalizeEmail } from '../../utils/email';
import { formatCpf, onlyDigits } from '../../utils/masks';
import {
  Brand,
  Card,
  Description,
  Field,
  FormMessage,
  LoginButton,
  LoginIcon,
  Page,
  PhotoPanel,
  ReturnButton,
} from '../ForgotPassword/styles';
import { RecoveryForm } from './styles';

type LocationState = {
  email?: string;
};

type RecoveryMatchResponse = {
  recoveryToken: string;
};

export default function RecoverAccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [email, setEmail] = useState(state?.email ?? '');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
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

    if (!email || !nome || !cpf || !nascimento) {
      setErrorMessage('Informe email, nome, CPF e data de nascimento.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Informe um email valido.');
      return;
    }

    if (onlyDigits(cpf).length !== 11) {
      setErrorMessage('Informe um CPF valido.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post<RecoveryMatchResponse>('/login/recovery-match', {
        email: normalizeEmail(email),
        nome,
        cpf: onlyDigits(cpf),
        nascimento,
      });

      setRecoveryToken(response.data.recoveryToken);
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Nao foi possivel confirmar seus dados.',
        );
        return;
      }

      setErrorMessage('Nao foi possivel confirmar seus dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSetupPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!password || !confirmPassword) {
      setErrorMessage('Informe e confirme a nova senha.');
      return;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setErrorMessage('A senha deve ter no minimo 8 caracteres, incluindo letras e numeros.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas informadas nao conferem.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/login/setup-password', {
        token: recoveryToken,
        password,
      });

      setSuccessMessage('Senha criada com sucesso. Redirecionando para o login...');
      setTimeout(() => navigate('/'), 900);
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Nao foi possivel criar sua senha.',
        );
        return;
      }

      setErrorMessage('Nao foi possivel criar sua senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <RecoveryForm onSubmit={isPasswordStep ? handleSetupPassword : handleMatch}>
          <Brand>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <h1>{isPasswordStep ? 'Criar senha' : 'Confirmar dados'}</h1>
          <Description>
            {isPasswordStep
              ? 'Digite uma nova senha para concluir a recuperacao de acesso.'
              : 'Confirme seus dados para criar a senha da sua conta.'}
          </Description>

          {!isPasswordStep ? (
            <>
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
                <span>Nome</span>
                <input
                  type="text"
                  placeholder="Nome completo"
                  autoComplete="name"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
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

              <Field>
                <span>Data de nascimento</span>
                <input
                  type="date"
                  placeholder="Data de nascimento"
                  autoComplete="bday"
                  value={nascimento}
                  onChange={(event) => setNascimento(event.target.value)}
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
            {loading ? 'Validando...' : isPasswordStep ? 'Criar senha' : 'Continuar'}
          </LoginButton>

          <ReturnButton type="button" onClick={() => navigate('/')}>
            Voltar ao login
          </ReturnButton>
        </RecoveryForm>

        <PhotoPanel />
      </Card>
    </Page>
  );
}
