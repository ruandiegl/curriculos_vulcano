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

export default function NewEducation() {
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
          <SectionTitle>Cadastrar Formação Acadêmica</SectionTitle>
          
          <FormGrid>
            <InputGroup>
              <label>Curso</label>
              <input type="text" placeholder="Nome do Curso" />
            </InputGroup>

            <InputGroup>
              <label>Escola</label>
              <input type="text" placeholder="Escola" />
            </InputGroup>

            <InputGroup>
              <label>Data de Início</label>
              <input type="text" placeholder="Data de Início" />
            </InputGroup>

            <InputGroup>
              <label>Data de Término</label>
              <input type="text" placeholder="Data de Término" />
            </InputGroup>
          </FormGrid>

          <ActionButtons>
            <SubmitButton type="button">
              Cadastrar Formação
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
