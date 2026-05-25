import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { addCurso } from '../../services/curriculos';
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

export default function NewCertification() {
  const navigate = useNavigate();
  const { requestLogout, logoutModal } = useConfirmLogout();
  const [nome, setNome] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function handleLogout() {
    requestLogout();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!nome.trim()) {
      setMessage('Informe o nome do curso ou certificado.');
      return;
    }

    try {
      setLoading(true);
      await addCurso({
        nome: nome.trim(),
        instituicao: instituicao.trim() || null,
        cargaHoraria: cargaHoraria.trim() || null,
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
          <SectionTitle>Cadastrar Cursos/Certificados</SectionTitle>
          {message && <FeedbackMessage>{message}</FeedbackMessage>}

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <InputGroup>
                <label>Curso/Certificado</label>
                <input
                  type="text"
                  placeholder="Nome do Curso ou Certificado"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <label>Instituicao</label>
                <input
                  type="text"
                  placeholder="Instituicao"
                  value={instituicao}
                  onChange={(event) => setInstituicao(event.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <label>Carga Horaria</label>
                <input
                  type="text"
                  placeholder="Carga Horaria"
                  value={cargaHoraria}
                  onChange={(event) => setCargaHoraria(event.target.value)}
                />
              </InputGroup>
            </FormGrid>

            <ActionButtons>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Cadastrar Curso/Certificado'}
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
