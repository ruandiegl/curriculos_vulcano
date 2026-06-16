import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { ConfirmModal } from '../../components/ConfirmModal';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { UserLayout } from '../../components/UserLayout';
import { useAuth } from '../../hooks/useAuth';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { createCandidatura, deleteCandidatura, listCandidaturas } from '../../services/candidaturas';
import { listVagas } from '../../services/vagas';
import type { Vaga } from '../../types/vaga';
import { limitText, textLimits } from '../../utils/formLimits';
import {
  ActionLink,
  Brand,
  Card,
  CardDescription,
  CardTitle,
  ConfirmationDetails,
  ConfirmationIntro,
  ConfirmationItem,
  ConfirmationSummary,
  Copyright,
  Footer,
  FooterContent,
  Header,
  HeaderContent,
  HeaderNav,
  InfoText,
  JobActions,
  LogoutButton,
  Main,
  NavLink,
  SearchBar,
  SearchInput,
  StatusBadge,
  DangerButton,
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
  return [vaga.cidade, vaga.estado].filter(Boolean).join(' / ') || 'Local não informado';
}

function summarizeDescription(description?: string | null, limit = 220) {
  const text = description?.trim();

  if (!text) {
    return 'Descrição não informada.';
  }

  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

export default function Jobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requestLogout } = useConfirmLogout();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState('');
  const [revokingId, setRevokingId] = useState('');
  const [applyTarget, setApplyTarget] = useState<Vaga | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<Vaga | null>(null);
  const [applicationByJobId, setApplicationByJobId] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const appliedSet = useMemo(() => new Set(appliedJobIds), [appliedJobIds]);

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setMessage('');
      const response = await listVagas({ page: 1, limit: PAGE_SIZE, search: search.trim(), ativa: true });
      setVagas(response.data);
    } catch (error) {
      setMessage(getErrorMessage(error, 'Não foi possivel carregar as vagas.'));
    } finally {
      setLoading(false);
    }
  }, [search]);

  const loadApplications = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      const response = await listCandidaturas({ usuarioId: user?.id, limit: 100 });
      setAppliedJobIds(response.data.map((candidatura) => candidatura.vagaId));
      setApplicationByJobId(
        Object.fromEntries(response.data.map((candidatura) => [candidatura.vagaId, candidatura.id])),
      );
    } catch {
      setAppliedJobIds([]);
      setApplicationByJobId({});
    }
  }, [user]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadJobs();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [loadJobs]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadApplications();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadApplications]);

  function requestApply(vaga: Vaga) {
    if (!user?.id) {
      setMessage('Entre na sua conta para se candidatar.');
      return;
    }

    setMessage('');
    setSuccessMessage('');
    setApplyTarget(vaga);
  }

  async function confirmApply() {
    if (!user?.id || !applyTarget) {
      return;
    }

    try {
      setApplyingId(applyTarget.id);
      setMessage('');
      setSuccessMessage('');
      const candidatura = await createCandidatura(user?.id, applyTarget.id);
      setAppliedJobIds((items) => [ ...items, applyTarget.id]);
      setApplicationByJobId((items) => ({ ...items, [applyTarget.id]: candidatura.id }));
      setApplyTarget(null);
      setSuccessMessage('Candidatura realizada com sucesso.');
    } catch (error) {
      setMessage(getErrorMessage(error, 'Não foi possivel registrar sua candidatura.'));
    } finally {
      setApplyingId('');
    }
  }

  function requestRevoke(vaga: Vaga) {
    setMessage('');
    setSuccessMessage('');
    setRevokeTarget(vaga);
  }

  async function confirmRevoke() {
    if (!revokeTarget) {
      return;
    }

    const candidaturaId = applicationByJobId[revokeTarget.id];

    if (!candidaturaId) {
      setMessage('Não foi possível localizar a candidatura para revogar.');
      setRevokeTarget(null);
      return;
    }

    try {
      setRevokingId(revokeTarget.id);
      setMessage('');
      setSuccessMessage('');
      await deleteCandidatura(candidaturaId);
      setAppliedJobIds((items) => items.filter((id) => id !== revokeTarget.id));
      setApplicationByJobId((items) => {
        const nextItems = { ...items };
        delete nextItems[revokeTarget.id];
        return nextItems;
      });
      setRevokeTarget(null);
      setSuccessMessage('Candidatura revogada com sucesso.');
    } catch (error) {
      setMessage(getErrorMessage(error, 'Não foi possível revogar sua candidatura.'));
    } finally {
      setRevokingId('');
    }
  }

  return (
    <UserLayout>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/profile')}>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/profile')}>Início</NavLink>
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
            <h1>Vagas Disponíveis</h1>
          </div>
          <SearchInput
            type="text"
            placeholder="Buscar vaga"
            maxLength={textLimits.search}
            value={search}
            onChange={(event) => setSearch(limitText(event.target.value, textLimits.search))}
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
            <CardDescription>No momento não há vagas ativas para essa busca.</CardDescription>
          </Card>
        )}

        {!loading &&
          vagas.map((vaga) => {
            const alreadyApplied = appliedSet.has(vaga.id);

            return (
              <Card key={vaga.id}>
                <CardTitle>{vaga.titulo}</CardTitle>
                <CardDescription>{summarizeDescription(vaga.descricao, 260)}</CardDescription>
                <UserInfo>
                  <InfoText>{formatLocation(vaga)}</InfoText>
                  <StatusBadge>{alreadyApplied ? 'Candidatura enviada' : 'Aberta para candidatura'}</StatusBadge>
                </UserInfo>

                <ActionLink onClick={() => navigate('/profile')}>Ver meu currículo &rarr;</ActionLink>
                <JobActions>
                  <SubmitButton
                    type="button"
                    disabled={alreadyApplied || applyingId === vaga.id}
                    onClick={() => requestApply(vaga)}
                  >
                    {alreadyApplied ? 'J? candidatado' : applyingId === vaga.id ? 'Enviando...' : 'Candidatar-se'}
                  </SubmitButton>
                  {alreadyApplied && (
                    <DangerButton
                      type="button"
                      disabled={revokingId === vaga.id}
                      onClick={() => requestRevoke(vaga)}
                    >
                      {revokingId === vaga.id ? 'Revogando...' : 'Revogar candidatura'}
                    </DangerButton>
                  )}
                </JobActions>
              </Card>
            );
          })}
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/profile')}>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>
          <Copyright>Â© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>
      {applyTarget && (
        <ConfirmModal
          title="Confirmar candidatura?"
          description={
            <ConfirmationDetails>
              <ConfirmationIntro>
                Revise as informacoes da oportunidade antes de enviar sua candidatura.
              </ConfirmationIntro>
              <ConfirmationSummary>
                <ConfirmationItem>
                  <span>Vaga</span>
                  <strong>{applyTarget.titulo}</strong>
                </ConfirmationItem>
                <ConfirmationItem>
                  <span>Local</span>
                  <strong>{formatLocation(applyTarget)}</strong>
                </ConfirmationItem>
                <ConfirmationItem>
                  <span>Descrição</span>
                  <p>{summarizeDescription(applyTarget.descricao)}</p>
                </ConfirmationItem>
              </ConfirmationSummary>
            </ConfirmationDetails>
          }
          confirmLabel="Confirmar"
          cancelLabel="Cancelar"
          loadingLabel="Enviando..."
          tone="default"
          loading={applyingId === applyTarget.id}
          onCancel={() => setApplyTarget(null)}
          onConfirm={confirmApply}
        />
      )}
      {revokeTarget && (
        <ConfirmModal
          title="Revogar candidatura?"
          description={
            <ConfirmationDetails>
              <ConfirmationIntro>
                Ao confirmar, sua candidatura será removida desta oportunidade.
              </ConfirmationIntro>
              <ConfirmationSummary>
                <ConfirmationItem>
                  <span>Vaga</span>
                  <strong>{revokeTarget.titulo}</strong>
                </ConfirmationItem>
                <ConfirmationItem>
                  <span>Local</span>
                  <strong>{formatLocation(revokeTarget)}</strong>
                </ConfirmationItem>
              </ConfirmationSummary>
            </ConfirmationDetails>
          }
          confirmLabel="Revogar"
          cancelLabel="Cancelar"
          loadingLabel="Revogando..."
          loading={revokingId === revokeTarget.id}
          onCancel={() => setRevokeTarget(null)}
          onConfirm={confirmRevoke}
        />
      )}
    </UserLayout>
  );
}
