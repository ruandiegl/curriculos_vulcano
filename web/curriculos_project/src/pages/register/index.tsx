import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { api } from '../../services/api';
import {
  Brand,
  Card,
  Field,
  FormMessage,
  Form,
  RegisterButton,
  ReturnButton,
  LoginIcon,
  Page,
  PhotoPanel,
} from './styles';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !email || !password) {
      setErrorMessage('Preencha nome, email e senha para cadastrar.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter no minimo 6 caracteres.');
      return;
    }

    try {
      setLoading(true);

      await api.post('/login/register', {
        nome: name,
        email,
        password,
      });

      setSuccessMessage('Cadastro realizado com sucesso. Redirecionando para o login...');
      setTimeout(() => navigate('/'), 900);
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Nao foi possivel realizar o cadastro.',
            
        )
        console.error('Erro ao registrar:', error.response?.data ?? error.message);
        return;
      }

      setErrorMessage('Nao foi possivel realizar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <Form onSubmit={handleRegister}>
          <Brand>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <p>Seja Bem vindo(a) a Plataforma de Recursos Humanos da Metalurgica Vulcano!</p>

          <Field>
            <span>Nome</span>
            <input
              type="text"
              placeholder="Nome"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>

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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>

          <Field>
            <span>Telefone</span>
            <input
              type="tel"
              placeholder="Telefone"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </Field>

          {errorMessage && <FormMessage role="alert">{errorMessage}</FormMessage>}
          {successMessage && <FormMessage $success>{successMessage}</FormMessage>}

          <RegisterButton type="submit" disabled={loading}>
            <LoginIcon aria-hidden="true">
              <span className="head" />
              <span className="body" />
              <span className="plus horizontal" />
              <span className="plus vertical" />
            </LoginIcon>
            {loading ? 'Registrando...' : 'Registrar'}
          </RegisterButton>

          <ReturnButton type="button" onClick={() => navigate('/')}>
            <LoginIcon aria-hidden="true">
              <span className="head" />
              <span className="body" />
            </LoginIcon>
            Ja tenho cadastro
          </ReturnButton>
        </Form>

        <PhotoPanel />
      </Card>
    </Page>
  );
}
