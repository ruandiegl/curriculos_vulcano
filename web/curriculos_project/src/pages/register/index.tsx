import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { PRIVACY_POLICY_VERSION, privacyPolicySections } from '../../content/privacyPolicy';
import { api } from '../../services/api';
import { isValidEmail, normalizeEmail } from '../../utils/email';
import {
  Brand,
  Card,
  ConsentBox,
  Field,
  FormMessage,
  Form,
  ModalBackdrop,
  PolicyActions,
  PolicyButton,
  PolicyContent,
  PolicyHeader,
  PolicyModal,
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
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !email || !password) {
      setErrorMessage('Preencha nome, e-mail e senha para cadastrar.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Informe um e-mail válido.');
      return;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setErrorMessage('A senha deve ter no minimo 8 caracteres, incluindo letras e números.');
      return;
    }

    if (!privacyAccepted) {
      setErrorMessage('Leia e aceite a Política de Privacidade para continuar.');
      setPolicyOpen(true);
      return;
    }

    try {
      setLoading(true);

      await api.post('/login/register', {
        nome: name,
        email: normalizeEmail(email),
        password,
        privacyPolicyAccepted: true,
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      });

      setSuccessMessage('Cadastro realizado com sucesso. Redirecionando para o login...');
      setTimeout(() => navigate('/'), 900);
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Não foi possível realizar o cadastro.',
            
        )
        console.error('Erro ao registrar:', error.response?.data ?? error.message);
        return;
      }

      setErrorMessage('Não foi possível realizar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Card>
        <Form onSubmit={handleRegister}>
          <Brand>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>

          <p>Seja Bem vindo(a) a Plataforma de Recursos Humanos da Metalúrgica Vulcano!</p>

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
            <span>Senha</span>
            <input
              type="password"
              placeholder="Senha"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>

          <ConsentBox>
            <input
              id="privacy-policy"
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
            />
            <label htmlFor="privacy-policy">
              Li e aceito a{' '}
              <button type="button" onClick={() => setPolicyOpen(true)}>
                Política de Privacidade
              </button>{' '}
              da Metalúrgica Vulcano.
            </label>
          </ConsentBox>

          {errorMessage && <FormMessage role="alert">{errorMessage}</FormMessage>}
          {successMessage && <FormMessage $success>{successMessage}</FormMessage>}

          <RegisterButton type="submit" disabled={loading || !privacyAccepted}>
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

      {policyOpen && (
        <ModalBackdrop role="presentation">
          <PolicyModal role="dialog" aria-modal="true" aria-labelledby="privacy-policy-title">
            <PolicyHeader>
              <h2 id="privacy-policy-title">Política de Privacidade</h2>
              <span>Versao {PRIVACY_POLICY_VERSION}</span>
            </PolicyHeader>

            <PolicyContent>
              {privacyPolicySections.map((section) => (
                <section key={section.title}>
                  <h3>{section.title}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </PolicyContent>

            <PolicyActions>
              <PolicyButton type="button" $secondary onClick={() => setPolicyOpen(false)}>
                Fechar
              </PolicyButton>
              <PolicyButton
                type="button"
                onClick={() => {
                  setPrivacyAccepted(true);
                  setPolicyOpen(false);
                  setErrorMessage('');
                }}
              >
                Aceito e continuar
              </PolicyButton>
            </PolicyActions>
          </PolicyModal>
        </ModalBackdrop>
      )}
    </Page>
  );
}
