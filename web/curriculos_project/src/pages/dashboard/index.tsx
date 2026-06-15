import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { ConfirmModal } from '../../components/ConfirmModal';
import { deleteCurriculo, listCurriculos } from '../../services/curriculos';
import type { Curriculo, CurriculoStatus } from '../../types/curriculo';
import { formatList, getStatusLabel, statusLabels } from '../../utils/status';
import {
  ActionButtons,
  CandidateAvatar,
  CandidateCell,
  CandidateInfo,
  ClearButton,
  Content,
  ContentHeader,
  Dot,
  FilterBadge,
  FilterButton,
  FilterGroup,
  IconActionButton,
  MetricCard,
  MetricsGrid,
  PageButton,
  Pagination,
  SearchContainer,
  SearchInput,
  SearchInputWrapper,
  SearchSection,
  SectionCategory,
  SectionTitle,
  StateMessage,
  StatusPill,
  Table,
  TableSection,
  TableWrapper,
} from './styles';

const PAGE_SIZE = 20;
const DASHBOARD_SEARCH_STORAGE_KEY = 'dashboardSearch';
const DASHBOARD_APPLIED_SEARCH_STORAGE_KEY = 'dashboardAppliedSearch';
const DASHBOARD_PAGE_STORAGE_KEY = 'dashboardPage';
const DASHBOARD_STATUS_STORAGE_KEY = 'dashboardStatus';

type StatusFilter = 'todos' | CurriculoStatus;

function getStoredValue(key: string) {
  return sessionStorage.getItem(key) ?? '';
}

function getInitialPage(searchParams: URLSearchParams) {
  return Number(searchParams.get('page') ?? getStoredValue(DASHBOARD_PAGE_STORAGE_KEY)) || 1;
}

function isCurriculoStatus(value: string | null): value is CurriculoStatus {
  return Boolean(value && statusLabels.some((item) => item.status === value));
}

function getInitialStatus(searchParams: URLSearchParams): StatusFilter {
  const status = searchParams.get('status') ?? getStoredValue(DASHBOARD_STATUS_STORAGE_KEY);
  return isCurriculoStatus(status) ? status : 'todos';
}

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.split('@')[0] || 'AD';
  const words = source.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <path d="M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 16.5-.8 4.3 4.3-.8L18.8 8.7l-3.5-3.5L4 16.5Z" />
      <path d="m14.2 6.3 3.5 3.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [curriculos, setCurriculos] = useState<Curriculo[]>([]);
  const [page, setPage] = useState(() => getInitialPage(searchParams));
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(
    () => searchParams.get('search') ?? getStoredValue(DASHBOARD_SEARCH_STORAGE_KEY),
  );
  const [appliedSearch, setAppliedSearch] = useState(
    () => searchParams.get('search') ?? getStoredValue(DASHBOARD_APPLIED_SEARCH_STORAGE_KEY),
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() => getInitialStatus(searchParams));
  const [statusTotals, setStatusTotals] = useState<Record<CurriculoStatus, number>>({
    desconsiderado: 0,
    entrevistado: 0,
    selecionado: 0,
    visualizado: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Curriculo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const pages = useMemo(() => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, totalPages]);

  const totalCurriculos = useMemo(() => {
    const totalByStatus = Object.values(statusTotals).reduce((sum, count) => sum + count, 0);
    return totalByStatus || total;
  }, [statusTotals, total]);
  useEffect(() => {
    let isCurrent = true;

    async function loadCurriculos() {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await listCurriculos({
          page,
          limit: PAGE_SIZE,
          search: appliedSearch,
          status: statusFilter === 'todos' ? undefined : statusFilter,
        });

        if (!isCurrent) return;

        setCurriculos(response.data);
        setTotal(response.meta.total);
        setTotalPages(Math.max(response.meta.totalPages, 1));
      } catch {
        if (isCurrent) {
          setErrorMessage('Nao foi possivel carregar os curriculos.');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadCurriculos();

    return () => {
      isCurrent = false;
    };
  }, [page, appliedSearch, statusFilter]);

  useEffect(() => {
    let isCurrent = true;

    async function loadStatusTotals() {
      try {
        const results = await Promise.all(
          statusLabels.map(async (item) => {
            const response = await listCurriculos({
              page: 1,
              limit: 1,
              search: appliedSearch,
              status: item.status,
            });

            return [item.status, response.meta.total] as const;
          }),
        );

        if (isCurrent) {
          setStatusTotals(Object.fromEntries(results) as Record<CurriculoStatus, number>);
        }
      } catch {
        if (isCurrent) {
          setStatusTotals({
            desconsiderado: 0,
            entrevistado: 0,
            selecionado: 0,
            visualizado: 0,
          });
        }
      }
    }

    loadStatusTotals();

    return () => {
      isCurrent = false;
    };
  }, [appliedSearch]);

  useEffect(() => {
    sessionStorage.setItem(DASHBOARD_SEARCH_STORAGE_KEY, search);
  }, [search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setAppliedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    sessionStorage.setItem(DASHBOARD_APPLIED_SEARCH_STORAGE_KEY, appliedSearch);
    sessionStorage.setItem(DASHBOARD_PAGE_STORAGE_KEY, String(page));
    sessionStorage.setItem(DASHBOARD_STATUS_STORAGE_KEY, statusFilter);

    const nextParams = new URLSearchParams();

    if (appliedSearch) {
      nextParams.set('search', appliedSearch);
    }

    if (page > 1) {
      nextParams.set('page', String(page));
    }

    if (statusFilter !== 'todos') {
      nextParams.set('status', statusFilter);
    }

    setSearchParams(nextParams, { replace: true });
  }, [appliedSearch, page, statusFilter, setSearchParams]);

  function handleClearSearch() {
    setSearch('');
  }

  function handleStatusFilter(nextStatus: StatusFilter) {
    setStatusFilter(nextStatus);
    setPage(1);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteCurriculo(deleteTarget.id);
      setCurriculos((items) => items.filter((item) => item.id !== deleteTarget.id));
      setTotal((currentTotal) => Math.max(currentTotal - 1, 0));
      setStatusTotals((currentTotals) => ({
        ...currentTotals,
        [deleteTarget.status]: Math.max(currentTotals[deleteTarget.status] - 1, 0),
      }));
      setDeleteTarget(null);
    } catch {
      setErrorMessage('Nao foi possivel apagar este curriculo.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminLayout activeSection="curriculos">
        <Content>
          <ContentHeader>
            <div>
              <SectionCategory>Curriculos</SectionCategory>
              <SectionTitle>Gerenciar Curriculos</SectionTitle>
            </div>

            <MetricsGrid>
              <MetricCard>
                <span>Curriculos</span>
                <strong>{totalCurriculos}</strong>
              </MetricCard>
            </MetricsGrid>
          </ContentHeader>

          <SearchSection>
            <SearchContainer onSubmit={(event) => event.preventDefault()}>
              <SearchInputWrapper>
                <SearchInput
                  type="text"
                  placeholder="Buscar curriculo por nome, email ou atuacao"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <ClearButton type="button" onClick={handleClearSearch}>
                  Limpar
                </ClearButton>
              </SearchInputWrapper>
            </SearchContainer>

            <FilterGroup aria-label="Filtrar curriculos por status">
              <FilterButton type="button" $active={statusFilter === 'todos'} onClick={() => handleStatusFilter('todos')}>
                Todos
                <FilterBadge>{totalCurriculos}</FilterBadge>
              </FilterButton>

              {statusLabels.map((item) => (
                <FilterButton
                  key={item.status}
                  type="button"
                  $active={statusFilter === item.status}
                  onClick={() => handleStatusFilter(item.status)}
                >
                  <Dot $status={item.status} />
                  {item.label}
                  <FilterBadge>{statusTotals[item.status]}</FilterBadge>
                </FilterButton>
              ))}
            </FilterGroup>
          </SearchSection>

          <TableSection>
            <TableWrapper>
              {loading && <StateMessage>Carregando curriculos...</StateMessage>}
              {!loading && errorMessage && <StateMessage $variant="error">{errorMessage}</StateMessage>}
              {!loading && !errorMessage && curriculos.length === 0 && (
                <StateMessage>Nenhum curriculo encontrado.</StateMessage>
              )}
              {!loading && !errorMessage && curriculos.length > 0 && (
                <Table>
                  <colgroup>
                    <col style={{ width: '34%' }} />
                    <col style={{ width: '38%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '14%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Candidato</th>
                      <th>Funcoes Pretendidas</th>
                      <th>Status</th>
                      <th>Acoes</th>
                    </tr>
                  </thead>

                  <tbody>
                    {curriculos.map((item) => (
                      <tr
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/view/${item.id}`)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            navigate(`/view/${item.id}`);
                          }
                        }}
                      >
                        <td>
                          <CandidateCell>
                            <CandidateAvatar>{getInitials(item.nome, item.email ?? undefined)}</CandidateAvatar>
                            <CandidateInfo>
                              <strong>{item.nome}</strong>
                              <span>{item.email ?? '-'}</span>
                            </CandidateInfo>
                          </CandidateCell>
                        </td>
                        <td>{formatList(item.atuacoes)}</td>
                        <td>
                          <StatusPill $status={item.status}>
                            <Dot $status={item.status} />
                            {getStatusLabel(item.status)}
                          </StatusPill>
                        </td>
                        <td>
                          <ActionButtons>
                            <IconActionButton
                              type="button"
                              aria-label={`Ver curriculo de ${item.nome}`}
                              title="Ver curriculo"
                              $variant="view"
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/view/${item.id}`);
                              }}
                            >
                              <EyeIcon />
                            </IconActionButton>
                            <IconActionButton
                              type="button"
                              aria-label={`Editar curriculo de ${item.nome}`}
                              title="Editar curriculo"
                              $variant="edit"
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/edit/${item.id}`);
                              }}
                            >
                              <EditIcon />
                            </IconActionButton>
                            <IconActionButton
                              type="button"
                              aria-label={`Apagar curriculo de ${item.nome}`}
                              title="Apagar curriculo"
                              $variant="delete"
                              onClick={(event) => {
                                event.stopPropagation();
                                setDeleteTarget(item);
                              }}
                            >
                              <TrashIcon />
                            </IconActionButton>
                          </ActionButtons>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </TableWrapper>

            <Pagination>
              <PageButton type="button" disabled={page === 1} onClick={() => setPage(1)}>
                &laquo;
              </PageButton>
              <PageButton type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
                &lsaquo;
              </PageButton>
              {pages.map((item) => (
                <PageButton key={item} type="button" $active={item === page} onClick={() => setPage(item)}>
                  {item}
                </PageButton>
              ))}
              <PageButton
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                &rsaquo;
              </PageButton>
              <PageButton type="button" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
                &raquo;
              </PageButton>
            </Pagination>
            <StateMessage>{total} curriculos encontrados. Limite de {PAGE_SIZE} por pagina.</StateMessage>
          </TableSection>
        </Content>

      {deleteTarget && (
        <ConfirmModal
          title="Apagar curriculo?"
          description={`Esta acao vai remover o curriculo de ${deleteTarget.nome}. Depois de confirmar, nao sera possivel desfazer.`}
          confirmLabel="Apagar"
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </AdminLayout>
  );
}
