import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import { deleteCurriculo, listCurriculos } from '../../services/curriculos';
import type { Curriculo } from '../../types/curriculo';
import { formatList, statusLabels } from '../../utils/status';
import {
  ActionButton,
  ActionButtons,
  ActionLink,
  Brand,
  ClearButton,
  Dot,
  Header,
  HeaderContent,
  HeaderNav,
  Legend,
  LegendItem,
  LogoutButton,
  Main,
  NavLink,
  Page,
  PageButton,
  Pagination,
  SearchContainer,
  SearchInput,
  SearchInputWrapper,
  SearchSection,
  SectionCategory,
  SectionTitle,
  StateMessage,
  Table,
  TableSection,
  TableWrapper,
} from './styles';

const PAGE_SIZE = 20;
const DASHBOARD_SEARCH_STORAGE_KEY = 'dashboardSearch';
const DASHBOARD_APPLIED_SEARCH_STORAGE_KEY = 'dashboardAppliedSearch';
const DASHBOARD_PAGE_STORAGE_KEY = 'dashboardPage';

function getStoredValue(key: string) {
  return sessionStorage.getItem(key) ?? '';
}

function getInitialPage(searchParams: URLSearchParams) {
  return Number(searchParams.get('page') ?? getStoredValue(DASHBOARD_PAGE_STORAGE_KEY)) || 1;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { signOut } = useAuth();
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
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const pages = useMemo(() => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, totalPages]);

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
        });

        if (!isCurrent) {
          return;
        }

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
  }, [page, appliedSearch]);

  useEffect(() => {
    sessionStorage.setItem(DASHBOARD_SEARCH_STORAGE_KEY, search);
  }, [search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setAppliedSearch(search.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  useEffect(() => {
    sessionStorage.setItem(DASHBOARD_APPLIED_SEARCH_STORAGE_KEY, appliedSearch);
    sessionStorage.setItem(DASHBOARD_PAGE_STORAGE_KEY, String(page));

    const nextParams = new URLSearchParams();

    if (appliedSearch) {
      nextParams.set('search', appliedSearch);
    }

    if (page > 1) {
      nextParams.set('page', String(page));
    }

    setSearchParams(nextParams, { replace: true });
  }, [appliedSearch, page, setSearchParams]);

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  function handleClearSearch() {
    setSearch('');
  }

  async function handleDelete(curriculo: Curriculo) {
    const confirmed = window.confirm(`Apagar o curriculo de ${curriculo.nome}?`);

    if (!confirmed) {
      return;
    }

    await deleteCurriculo(curriculo.id);
    setCurriculos((items) => items.filter((item) => item.id !== curriculo.id));
    setTotal((currentTotal) => Math.max(currentTotal - 1, 0));
  }

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Brand href="#" aria-label="Metalurgica Vulcano">
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink href="#">Gerenciar Curriculos</NavLink>
            <NavLink href="#">Gerenciar Vagas</NavLink>
            <LogoutButton type="button" onClick={handleSignOut}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <SearchSection>
          <SectionCategory>Curriculos</SectionCategory>
          <SectionTitle>Gerenciar Curriculos</SectionTitle>

          <SearchContainer onSubmit={(event) => event.preventDefault()}>
            <SearchInputWrapper>
              <SearchInput
                type="text"
                placeholder="Digite sua busca"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <ClearButton type="button" onClick={handleClearSearch}>
                Limpar
              </ClearButton>
            </SearchInputWrapper>
          </SearchContainer>
        </SearchSection>

        <TableSection>
          <Legend>
            {statusLabels.map((item) => (
              <LegendItem key={item.status}>
                <Dot $status={item.status} />
                {item.label}
              </LegendItem>
            ))}
          </Legend>

          <TableWrapper>
            {loading && <StateMessage>Carregando curriculos...</StateMessage>}
            {!loading && errorMessage && <StateMessage>{errorMessage}</StateMessage>}
            {!loading && !errorMessage && curriculos.length === 0 && (
              <StateMessage>Nenhum curriculo encontrado.</StateMessage>
            )}
            {!loading && !errorMessage && curriculos.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Atuacao Principal</th>
                    <th>Acoes</th>
                    <th aria-label="Status" />
                  </tr>
                </thead>

                <tbody>
                  {curriculos.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nome}</td>
                      <td>{item.email ?? '-'}</td>
                      <td>{formatList(item.atuacoes)}</td>
                      <td>
                        <ActionButtons>
                          <ActionButton type="button" onClick={() => handleDelete(item)}>
                            Apagar
                          </ActionButton>
                          <ActionLink type="button" onClick={() => navigate(`/edit/${item.id}`)}>
                            Editar
                          </ActionLink>
                          <ActionLink type="button" onClick={() => navigate(`/view/${item.id}`)}>
                            Ver
                          </ActionLink>
                        </ActionButtons>
                      </td>
                      <td>
                        <Dot $status={item.status} $large />
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
      </Main>
    </Page>
  );
}
