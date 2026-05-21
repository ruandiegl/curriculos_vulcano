import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
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
        <Section>
          <SectionTitle>Cadastrar Cursos/Certificados</SectionTitle>
          
          <FormGrid>
            <InputGroup>
              <label>Curso/Certificado</label>
              <input type="text" placeholder="Nome do Curso ou Certificado" />
            </InputGroup>
            <InputGroup>
              <label>Instituição</label>
              <input type="text" placeholder="Instituição" />
            </InputGroup>
            <InputGroup>
              <label>Carga Horária</label>
              <input type="text" placeholder="Carga Horária" />
            </InputGroup>
          </FormGrid>

          <ActionButtons>
            <SubmitButton type="button">
              Cadastrar Curso/Certificado
            </SubmitButton>
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
