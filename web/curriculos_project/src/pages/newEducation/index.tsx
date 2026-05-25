import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { addEscolaridade } from '../../services/curriculos';
import {
  ActionButtons,
  BackButton,
  Brand,
  Copyright,
  Footer,
  FooterContent,
  FormGrid,
  Header,
  HeaderContent,
  HeaderNav,
  InputGroup,
  LogoutButton,
  Main,
  NavLink,
  Page,
  Section,
  SectionTitle,
  SubmitButton,
} from './styles';

export default function NewEducation() {
  const navigate = useNavigate();
  const { requestLogout, logoutModal } = useConfirmLogout();
  const [curso, setCurso] = useState('');
  const [escola, setEscola] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function handleLogout() {
    requestLogout();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!escola.trim()) {
      setMessage('Informe a escola ou formacao.');
      return;
    }

    try {
      setLoading(true);
      await addEscolaridade({
        curso: curso.trim() || null,
        escola: escola.trim(),
        dataInicio: dataInicio || null,
        dataTermino: dataTermino || null,
      });
      navigate('/profile');
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setMessage(error.response?.data?.message ?? error.response?.data?.error ?? 'Nao foi possivel cadastrar.');
        return;
      }

      setMessage('Nao foi possivel cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/profile')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/profile')}>Inicio</NavLink>
            <NavLink onClick={() => navigate('/vagas')}>Vagas</NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <Section>
          <SectionTitle>Cadastrar Formacao Academica</SectionTitle>
          {message && <FeedbackMessage>{message}</FeedbackMessage>}

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <InputGroup>
                <label>Curso</label>
                <input
                  type="text"
                  placeholder="Nome do Curso"
                  value={curso}
                  onChange={(event) => setCurso(event.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <label>Escola/Formacao</label>
                <input
                  type="text"
                  placeholder="Escola ou formacao"
                  value={escola}
                  onChange={(event) => setEscola(event.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <label>Data de Inicio</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(event) => setDataInicio(event.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <label>Data de Termino</label>
                <input
                  type="date"
                  value={dataTermino}
                  onChange={(event) => setDataTermino(event.target.value)}
                />
              </InputGroup>
            </FormGrid>

            <ActionButtons>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Cadastrar Formacao'}
              </SubmitButton>
              <BackButton type="button" onClick={() => navigate('/profile')}>
                Voltar
              </BackButton>
            </ActionButtons>
          </form>
        </Section>
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/profile')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>
      {logoutModal}
    </Page>
  );
}
