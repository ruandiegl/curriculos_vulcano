import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import {
  ActionButton,
  ActionButtons,
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
  Table,
  TableSection,
  TableWrapper,
} from './styles';

const curriculos = [
  {
    nome: 'Adenilson knupp alves junior',
    email: 'junior-knupp@hotmail.com',
    cargo: 'SOLDADOR MIG/MAG',
    status: 'selecionado',
  },
  {
    nome: 'Admilson Pereira Machado',
    email: 'admilson1machado@gmail.com',
    cargo: 'DESENHISTA PROJETISTA',
    status: 'visualizado',
  },
  {
    nome: 'Adriano Luiz de O Bonfim',
    email: 'bonfim90@yahoo.com.br',
    cargo: 'ELETRICISTA',
    status: 'visualizado',
  },
 

];

const statusLabels = [
  { label: 'Desconsiderado', status: 'desconsiderado' },
  { label: 'Entrevistado', status: 'entrevistado' },
  { label: 'Selecionado', status: 'selecionado' },
  { label: 'Visualizado', status: 'visualizado' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  function handleSignOut() {
    signOut();
    navigate('/');
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

          <SearchContainer>
            <SearchInputWrapper>
              <SearchInput type="text" placeholder="Digite sua busca" />
              <ClearButton>Limpar</ClearButton>
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
                  <tr key={`${item.email}-${item.status}`}>
                    <td>{item.nome}</td>
                    <td>{item.email}</td>
                    <td>{item.cargo}</td>
                    <td>
                      <ActionButtons>
                        <ActionButton>Apagar</ActionButton>
                        <ActionButton>Editar</ActionButton>
                        <ActionButton>Ver</ActionButton>
                      </ActionButtons>
                    </td>
                    <td>
                      <Dot $status={item.status} $large />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          <Pagination>
            <PageButton>&laquo;</PageButton>
            <PageButton>&lsaquo;</PageButton>
            <PageButton $active>1</PageButton>
            <PageButton>2</PageButton>
            <PageButton>3</PageButton>
            <PageButton>4</PageButton>
            <PageButton>5</PageButton>
            <PageButton>6</PageButton>
            <PageButton>7</PageButton>
            <PageButton>&rsaquo;</PageButton>
            <PageButton>&raquo;</PageButton>
          </Pagination>
        </TableSection>
      </Main>
    </Page>
  );
}
