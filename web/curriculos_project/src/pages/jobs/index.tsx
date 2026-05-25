import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { createCandidatura, listCandidaturas } from '../../services/candidaturas';
import { listVagas } from '../../services/vagas';
import type { Vaga } from '../../types/vaga';
import {
  ActionLink,
  Brand,
  Card,
  CardDescription,
  CardTitle,
  Copyright,
  Footer,
  FooterContent,
  Header,
  HeaderContent,
  HeaderNav,
  InfoText,
  LogoutButton,
  Main,
  NavLink,
  Page,
  SearchBar,
  SearchInput,
  StatusBadge,
  SubmitButton,
  UserInfo,
} from './styles';

const PAGE_SIZE = 50;

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? fallback;
  }

  return fallback;
}

function formatLocation(vaga: Vaga) {
  return [vaga.cidade, vaga.estado].filter(Boolean).join(' / ') || 'Local nao informado';
}

export default function Jobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requestLogout, logoutModal } = useConfirmLogout();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const appliedSet = useMemo(() => new Set(appliedJobIds), [appliedJobIds]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadJobs();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    loadApplications();
  }, [user?.id]);

  async function loadJobs() {
    try {
      setLoading(true);
      setMessage('');
      const response = await listVagas({ page: 1, limit: PAGE_SIZE, search: search.trim(), ativa: true });
      setVagas(response.data);
    } catch (error) {
      setMessage(getErrorMessage(error, 'Nao foi possivel carregar as vagas.'));
    } finally {
      setLoading(false);
    }
  }

  async function loadApplications() {
    if (!user?.id) {
      return;
    }

    try {
      const response = await listCandidaturas({ usuarioId: user.id, limit: 100 });
      setAppliedJobIds(response.data.map((candidatura) => candidatura.vagaId));
    } catch {
      setAppliedJobIds([]);
    }
  }

  async function handleApply(vaga: Vaga) {
    if (!user?.id) {
      setMessage('Entre na sua conta para se candidatar.');
      return;
    }

    try {
      setApplyingId(vaga.id);
      setMessage('');
      setSuccessMessage('');
      await createCandidatura(user.id, vaga.id);
      setAppliedJobIds((items) => [...items, vaga.id]);
      setSuccessMessage('Candidatura realizada com sucesso.');
    } catch (error) {
      setMessage(getErrorMessage(error, 'Nao foi possivel registrar sua candidatura.'));
    } finally {
      setApplyingId('');
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
            <LogoutButton type="button" onClick={requestLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <SearchBar>
          <div>
            <span>Oportunidades</span>
            <h1>Vagas Disponiveis</h1>
          </div>
          <SearchInput
            type="text"
            placeholder="Buscar vaga"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </SearchBar>

        {message && <FeedbackMessage>{message}</FeedbackMessage>}
        {successMessage && <FeedbackMessage variant="success">{successMessage}</FeedbackMessage>}

        {loading && (
          <Card>
            <CardDescription>Carregando vagas...</CardDescription>
          </Card>
        )}

        {!loading && vagas.length === 0 && (
          <Card>
            <CardTitle>Nenhuma vaga encontrada</CardTitle>
            <CardDescription>No momento nao ha vagas ativas para essa busca.</CardDescription>
          </Card>
        )}

        {!loading &&
          vagas.map((vaga) => {
            const alreadyApplied = appliedSet.has(vaga.id);

            return (
              <Card key={vaga.id}>
                <CardTitle>{vaga.titulo}</CardTitle>
                <CardDescription>{vaga.descricao || 'Descricao nao informada.'}</CardDescription>
                <UserInfo>
                  <InfoText>{formatLocation(vaga)}</InfoText>
                  <StatusBadge>{alreadyApplied ? 'Candidatura enviada' : 'Aberta para candidatura'}</StatusBadge>
                </UserInfo>

                <ActionLink onClick={() => navigate('/profile')}>Ver meu curriculo &rarr;</ActionLink>
                <SubmitButton
                  type="button"
                  disabled={alreadyApplied || applyingId === vaga.id}
                  onClick={() => handleApply(vaga)}
                >
                  {alreadyApplied ? 'Ja candidatado' : applyingId === vaga.id ? 'Enviando...' : 'Candidatar-se'}
                </SubmitButton>
              </Card>
            );
          })}
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
