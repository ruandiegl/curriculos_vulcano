import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import {
  ActionButtons,
  BackButton,
  Brand,
  Copyright,
  FileInputContainer,
  Footer,
  FooterContent,
  Greeting,
  Header,
  HeaderContent,
  HeaderNav,
  LogoutButton,
  Main,
  NavLink,
  Page,
  Section,
  SectionTitle,
} from './styles';

export default function UploadPDF() {
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
        <Greeting>
          <p>Prezado, Faça upload de seu currículo em PDF:</p>
        </Greeting>

        <Section>
          <SectionTitle>Cadastrar Currículo</SectionTitle>
          
          <FileInputContainer>
            <input type="file" accept=".pdf" />
          </FileInputContainer>

          <ActionButtons>
            <BackButton type="button" onClick={() => navigate('/profile')}>
              Voltar
            </BackButton>
          </ActionButtons>
        </Section>
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
