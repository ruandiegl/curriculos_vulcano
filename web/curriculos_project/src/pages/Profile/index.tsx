import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
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
  UserInfo,
} from './styles';

export default function Profile() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  function handleLogout() {
    signOut();
    navigate('/');
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
            <NavLink onClick={() => {}}>Vagas</NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <Card>
          <CardTitle>Dados Pessoais</CardTitle>
          <CardDescription>Confira os dados de seu Currículo</CardDescription>
          <UserInfo>
            <InfoText>Nome: ruan diego dos santos</InfoText>
            <InfoText>Email: teste@geral.com</InfoText>
            <InfoText>CPF: 000.000.000-00</InfoText>
          </UserInfo>
          <ActionLink onClick={() => {}}>Ver Currículo &rarr;</ActionLink>
          <ActionLink onClick={() => {}}>Alterar Currículo &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Currículo em PDF</CardTitle>
          <CardDescription>Não há currículo em PDF cadastrado</CardDescription>
          <ActionLink onClick={() => navigate('/upload-pdf')}>Adicionar Currículo em PDF &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Formações Acadêmicas</CardTitle>
          <CardDescription>Não há formações acadêmicas cadastradas</CardDescription>
          <ActionLink onClick={() => navigate('/new-education')}>Adicionar formação Acadêmicas &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Experiências Profissionais</CardTitle>
          <CardDescription>Não há experiências profissionais cadastradas</CardDescription>
          <ActionLink onClick={() => navigate('/new-experience')}>Adicionar Experiência Profissional &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Habilidades e Conhecimentos</CardTitle>
          <CardDescription>Não há habilidades e conhecimentos cadastrados</CardDescription>
          <ActionLink onClick={() => navigate('/new-skill')}>Adicionar Habilidades e Conhecimentos &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Cursos e Certificações</CardTitle>
          <CardDescription>Não há cursos ou certificações cadastrados</CardDescription>
          <ActionLink onClick={() => navigate('/new-certification')}>Adicionar Cursos ou Certificações &rarr;</ActionLink>
        </Card>
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/profile')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2023 Multi Publicidade</Copyright>
        </FooterContent>
      </Footer>
    </Page>
  );
}
