import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { ConfirmModal } from '../../components/ConfirmModal';
import { deleteCurriculo, listCurriculos } from '../../services/curriculos';
import type { Curriculo, CurriculoStatus } from '../../types/curriculo';
import { formatList, getStatusLabel, statusLabels } from '../../utils/status';
import {
  ActionButtons,
  AdvancedFilterButton,
  CandidateAvatar,
  CandidateCell,
  CandidateInfo,
  ClearButton,
  Content,
  ContentHeader,
  Dot,
  FilterBadge,
  FilterButton,
  FilterField,
  FilterGroup,
  FilterGrid,
  FilterInput,
  FilterLabel,
  FilterModal,
  FilterModalActions,
  FilterModalBackdrop,
  FilterModalBody,
  FilterModalButton,
  FilterModalCloseButton,
  FilterModalHeader,
  FilterSelect,
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
import { limitText, textLimits } from '../../utils/formLimits';

const PAGE_SIZE = 20;
const MOBILE_DRAWER_QUERY = '(max-width: 640px)';
const DRAWER_CLOSE_DISTANCE = 90;
const DASHBOARD_SEARCH_STORAGE_KEY = 'dashboardSearch';
const DASHBOARD_APPLIED_SEARCH_STORAGE_KEY = 'dashboardAppliedSearch';
const DASHBOARD_PAGE_STORAGE_KEY = 'dashboardPage';
const DASHBOARD_STATUS_STORAGE_KEY = 'dashboardStatus';
const DASHBOARD_ADVANCED_FILTERS_STORAGE_KEY = 'dashboardAdvancedFilters';

type StatusFilter = 'todos' | CurriculoStatus;
type BooleanFilter = '' | 'true' | 'false';

type AdvancedFilters = {
  cidade: string;
  estado: string;
  atuacao: string;
  cursoAtivo: BooleanFilter;
  possuiCnh: BooleanFilter;
};

const emptyAdvancedFilters: AdvancedFilters = {
  cidade: '',
  estado: '',
  atuacao: '',
  cursoAtivo: '',
  possuiCnh: '',
};

function isMobileDrawer() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_DRAWER_QUERY).matches;
}

function getStoredValue(key: string) {
  return sessionStorage.getItem(key) ?? '';
}

function normalizeBooleanFilter(value: string | null | undefined): BooleanFilter {
  return value === 'true' || value === 'false' ? value : '';
}

function getStoredAdvancedFilters(): AdvancedFilters {
  try {
    const stored = JSON.parse(getStoredValue(DASHBOARD_ADVANCED_FILTERS_STORAGE_KEY)) as Partial<AdvancedFilters> | null;

    return {
      cidade: stored?.cidade ?? '',
      estado: stored?.estado ?? '',
      atuacao: stored?.atuacao ?? '',
      cursoAtivo: normalizeBooleanFilter(stored?.cursoAtivo),
      possuiCnh: normalizeBooleanFilter(stored?.possuiCnh),
    };
  } catch {
    return emptyAdvancedFilters;
  }
}

function getInitialAdvancedFilters(searchParams: URLSearchParams): AdvancedFilters {
  const stored = getStoredAdvancedFilters();

  return {
    cidade: searchParams.get('cidade') ?? stored.cidade,
    estado: searchParams.get('estado') ?? stored.estado,
    atuacao: searchParams.get('atuacao') ?? stored.atuacao,
    cursoAtivo: normalizeBooleanFilter(searchParams.get('cursoAtivo') ?? stored.cursoAtivo),
    possuiCnh: normalizeBooleanFilter(searchParams.get('possuiCnh') ?? stored.possuiCnh),
  };
}

function getRequestAdvancedFilters(filters: AdvancedFilters) {
  return {
    cidade: filters.cidade || undefined,
    estado: filters.estado || undefined,
    atuacao: filters.atuacao || undefined,
    cursoAtivo: filters.cursoAtivo || undefined,
    possuiCnh: filters.possuiCnh || undefined,
  };
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

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const filterDragStartYRef = useRef<number | null>(null);
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
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(() => getInitialAdvancedFilters(searchParams));
  const [draftFilters, setDraftFilters] = useState<AdvancedFilters>(() => getInitialAdvancedFilters(searchParams));
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() => getInitialStatus(searchParams));
  const [draftStatusFilter, setDraftStatusFilter] = useState<StatusFilter>(() => getInitialStatus(searchParams));
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  const activeFilterCount = useMemo(
    () => Object.values(advancedFilters).filter(Boolean).length + (statusFilter === 'todos' ? 0 : 1),
    [advancedFilters, statusFilter],
  );

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
          ...getRequestAdvancedFilters(advancedFilters),
        });

        if (!isCurrent) return;

        setCurriculos(response.data);
        setTotal(response.meta.total);
        setTotalPages(Math.max(response.meta.totalPages, 1));
      } catch {
        if (isCurrent) {
          setErrorMessage('Não foi possível carregar os currículos.');
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
  }, [page, appliedSearch, statusFilter, advancedFilters]);

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
              ...getRequestAdvancedFilters(advancedFilters),
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
  }, [appliedSearch, advancedFilters]);

  useEffect(() => {
    if (!filtersOpen) return undefined;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setFiltersOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtersOpen]);

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
    sessionStorage.setItem(DASHBOARD_ADVANCED_FILTERS_STORAGE_KEY, JSON.stringify(advancedFilters));

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

    if (advancedFilters.cidade) {
      nextParams.set('cidade', advancedFilters.cidade);
    }

    if (advancedFilters.estado) {
      nextParams.set('estado', advancedFilters.estado);
    }

    if (advancedFilters.atuacao) {
      nextParams.set('atuacao', advancedFilters.atuacao);
    }

    if (advancedFilters.cursoAtivo) {
      nextParams.set('cursoAtivo', advancedFilters.cursoAtivo);
    }

    if (advancedFilters.possuiCnh) {
      nextParams.set('possuiCnh', advancedFilters.possuiCnh);
    }

    setSearchParams(nextParams, { replace: true });
  }, [appliedSearch, page, statusFilter, advancedFilters, setSearchParams]);

  function handleClearSearch() {
    setSearch('');
  }

  function handleFilterBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setFiltersOpen(false);
    }
  }

  function handleFilterPointerDown(event: PointerEvent<HTMLFormElement>) {
    if (!isMobileDrawer()) {
      return;
    }

    filterDragStartYRef.current = event.clientY;
  }

  function handleFilterPointerUp(event: PointerEvent<HTMLFormElement>) {
    const startY = filterDragStartYRef.current;
    filterDragStartYRef.current = null;

    if (!isMobileDrawer() || startY === null) {
      return;
    }

    if (event.clientY - startY >= DRAWER_CLOSE_DISTANCE) {
      setFiltersOpen(false);
    }
  }

  function handleOpenFilters() {
    setDraftFilters(advancedFilters);
    setDraftStatusFilter(statusFilter);
    setFiltersOpen(true);
  }

  function updateDraftFilter(field: keyof AdvancedFilters, value: string) {
    setDraftFilters((current) => {
      const nextFilters = { ...current };

      if (field === 'cursoAtivo' || field === 'possuiCnh') {
        nextFilters[field] = normalizeBooleanFilter(value);
        return nextFilters;
      }

      nextFilters[field] = field === 'estado'
        ? limitText(value.toUpperCase(), textLimits.state)
        : limitText(value, textLimits.search);

      return nextFilters;
    });
  }

  function handleClearFilters() {
    setDraftFilters(emptyAdvancedFilters);
    setDraftStatusFilter('todos');
  }

  function handleApplyFilters() {
    setAdvancedFilters({
      cidade: draftFilters.cidade.trim(),
      estado: draftFilters.estado.trim().toUpperCase(),
      atuacao: draftFilters.atuacao.trim(),
      cursoAtivo: draftFilters.cursoAtivo,
      possuiCnh: draftFilters.possuiCnh,
    });
    setStatusFilter(draftStatusFilter);
    setPage(1);
    setFiltersOpen(false);
  }

  function handleStatusFilter(nextStatus: StatusFilter) {
    setStatusFilter(nextStatus);
    setPage(1);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteCurriculo(deleteTarget?.id);
      setCurriculos((items) => items.filter((item) => item.id !== deleteTarget?.id));
      setTotal((currentTotal) => Math.max(currentTotal - 1, 0));
      setStatusTotals((currentTotals) => ({ ...currentTotals,
        [deleteTarget?.status]: Math.max(currentTotals[deleteTarget?.status] - 1, 0),
      }));
      setDeleteTarget(null);
    } catch {
      setErrorMessage('Não foi possível apagar este currículo.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminLayout activeSection="curriculos">
        <Content>
          <ContentHeader>
            <div>
              <SectionCategory>Currículos</SectionCategory>
              <SectionTitle>Gerenciar Currículos</SectionTitle>
            </div>

            <MetricsGrid>
              <MetricCard>
                <span>Currículos</span>
                <strong>{totalCurriculos}</strong>
              </MetricCard>
            </MetricsGrid>
          </ContentHeader>

          <SearchSection>
            <SearchContainer onSubmit={(event) => event.preventDefault()}>
              <SearchInputWrapper>
                <SearchInput
                  type="text"
                  placeholder="Buscar currículo por nome, e-mail ou atuação"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <ClearButton type="button" onClick={handleClearSearch}>
                  Limpar
                </ClearButton>
              </SearchInputWrapper>
            </SearchContainer>

            <AdvancedFilterButton type="button" $active={activeFilterCount > 0} onClick={handleOpenFilters}>
              <FilterIcon />
              Filtros
              {activeFilterCount > 0 && <FilterBadge>{activeFilterCount}</FilterBadge>}
            </AdvancedFilterButton>

            <FilterGroup aria-label="Filtrar currículos por status">
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
              {loading && <StateMessage>Carregando currículos...</StateMessage>}
              {!loading && errorMessage && <StateMessage $variant="error">{errorMessage}</StateMessage>}
              {!loading && !errorMessage && curriculos.length === 0 && (
                <StateMessage>Nenhum currículo encontrado.</StateMessage>
              )}
              {!loading && !errorMessage && curriculos.length > 0 && (
                <Table>
                  <colgroup>
                    <col style={{ width: '32%' }} />
                    <col style={{ width: '36%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '14%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Candidato</th>
                      <th>Funções Pretendidas</th>
                      <th>Status</th>
                      <th>Ações</th>
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
                        <td data-label="Candidato">
                          <CandidateCell>
                            <CandidateAvatar>{getInitials(item.nome, item.email ?? undefined)}</CandidateAvatar>
                            <CandidateInfo>
                              <strong>{item.nome}</strong>
                              <span>{item.email ?? '-'}</span>
                            </CandidateInfo>
                          </CandidateCell>
                        </td>
                        <td data-label="Funções">{formatList(item.atuacoes)}</td>
                        <td data-label="Status">
                          <StatusPill $status={item.status}>
                            <Dot $status={item.status} />
                            {getStatusLabel(item.status)}
                          </StatusPill>
                        </td>
                        <td data-label="Ações">
                          <ActionButtons>
                            <IconActionButton
                              type="button"
                              aria-label={`Ver currículo de ${item.nome}`}
                              title="Ver currículo"
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
                              aria-label={`Editar currículo de ${item.nome}`}
                              title="Editar currículo"
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
                              aria-label={`Apagar currículo de ${item.nome}`}
                              title="Apagar currículo"
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
            <StateMessage>{total} currículos encontrados. Limite de {PAGE_SIZE} por página.</StateMessage>
          </TableSection>
        </Content>

      {filtersOpen && (
        <FilterModalBackdrop
          role="presentation"
          onClick={handleFilterBackdropClick}
        >
          <FilterModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-modal-title"
            onPointerDown={handleFilterPointerDown}
            onPointerUp={handleFilterPointerUp}
            onPointerCancel={() => {
              filterDragStartYRef.current = null;
            }}
            onSubmit={(event) => {
              event.preventDefault();
              handleApplyFilters();
            }}
          >
            <FilterModalHeader>
              <div>
                <h2 id="filter-modal-title">Filtros de currículos</h2>
                <p>Combine os critérios que quiser para refinar a lista.</p>
              </div>
              <FilterModalCloseButton type="button" aria-label="Fechar filtros" onClick={() => setFiltersOpen(false)}>
                x
              </FilterModalCloseButton>
            </FilterModalHeader>

            <FilterModalBody>
              <FilterGrid>
                <FilterField>
                  <FilterLabel htmlFor="status-filter">Status</FilterLabel>
                  <FilterSelect
                    id="status-filter"
                    value={draftStatusFilter}
                    onChange={(event) => setDraftStatusFilter(event.target.value as StatusFilter)}
                  >
                    <option value="todos">Todos</option>
                    {statusLabels.map((item) => (
                      <option key={item.status} value={item.status}>
                        {item.label}
                      </option>
                    ))}
                  </FilterSelect>
                </FilterField>

                <FilterField>
                  <FilterLabel htmlFor="city-filter">Cidade</FilterLabel>
                  <FilterInput
                    id="city-filter"
                    type="text"
                    maxLength={textLimits.search}
                    value={draftFilters.cidade}
                    onChange={(event) => updateDraftFilter('cidade', event.target.value)}
                    placeholder="Ex.: Americana"
                  />
                </FilterField>

                <FilterField>
                  <FilterLabel htmlFor="state-filter">Estado</FilterLabel>
                  <FilterInput
                    id="state-filter"
                    type="text"
                    maxLength={textLimits.state}
                    value={draftFilters.estado}
                    onChange={(event) => updateDraftFilter('estado', event.target.value)}
                    placeholder="SP"
                  />
                </FilterField>

                <FilterField>
                  <FilterLabel htmlFor="role-filter">Atuação</FilterLabel>
                  <FilterInput
                    id="role-filter"
                    type="text"
                    maxLength={textLimits.search}
                    value={draftFilters.atuacao}
                    onChange={(event) => updateDraftFilter('atuacao', event.target.value)}
                    placeholder="Ex.: Soldador"
                  />
                </FilterField>

                <FilterField>
                  <FilterLabel htmlFor="course-filter">Curso ativo</FilterLabel>
                  <FilterSelect
                    id="course-filter"
                    value={draftFilters.cursoAtivo}
                    onChange={(event) => updateDraftFilter('cursoAtivo', event.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </FilterSelect>
                </FilterField>

                <FilterField>
                  <FilterLabel htmlFor="cnh-filter">Possui CNH</FilterLabel>
                  <FilterSelect
                    id="cnh-filter"
                    value={draftFilters.possuiCnh}
                    onChange={(event) => updateDraftFilter('possuiCnh', event.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </FilterSelect>
                </FilterField>
              </FilterGrid>
            </FilterModalBody>

            <FilterModalActions>
              <FilterModalButton type="button" onClick={handleClearFilters}>
                Limpar filtros
              </FilterModalButton>
              <FilterModalButton type="button" onClick={() => setFiltersOpen(false)}>
                Cancelar
              </FilterModalButton>
              <FilterModalButton type="submit" $primary>
                Aplicar
              </FilterModalButton>
            </FilterModalActions>
          </FilterModal>
        </FilterModalBackdrop>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Apagar currículo?"
          description={`Esta ação vai remover o curriculo de ${deleteTarget?.nome}. Depois de confirmar, não será possivel desfazer.`}
          confirmLabel="Apagar"
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </AdminLayout>
  );
}
