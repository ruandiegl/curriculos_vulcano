import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {
  ActionButtons,
  Brand,
  Copyright,
  Field,
  Footer,
  FooterContent,
  Grid,
  Greeting,
  Header,
  HeaderContent,
  HeaderNav,
  Input,
  Label,
  LogoutButton,
  Main,
  NavLink,
  Page,
  Section,
  SectionTitle,
  SubmitButton,
} from './styles';

export default function NewAddress() {
  const navigate = useNavigate();

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/')}>Início</NavLink>
            <NavLink onClick={() => {}}>Vagas</NavLink>
            <LogoutButton>Sair</LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <Greeting>
          <p>Perfeito, agora vamos precisar de seu endereço:</p>
        </Greeting>

        <Section>
          <SectionTitle>Endereço</SectionTitle>
          <Grid>
            <Field>
              <Label>CEP</Label>
              <Input type="text" placeholder="CEP" />
            </Field>
            <Field>
              <Label>Logradouro</Label>
              <Input type="text" placeholder="Logradouro" />
            </Field>
            <Field>
              <Label>Cidade</Label>
              <Input type="text" placeholder="Cidade" />
            </Field>

            <Field>
              <Label>Número</Label>
              <Input type="text" placeholder="Número" />
            </Field>
            <Field>
              <Label>Bairro</Label>
              <Input type="text" placeholder="Bairro" />
            </Field>
            <Field>
              <Label>Estado</Label>
              <Input type="text" placeholder="Estado" />
            </Field>

            <Field>
              <Label>Complemento</Label>
              <Input type="text" placeholder="Complemento" />
            </Field>
          </Grid>

          <ActionButtons>
            <SubmitButton type="button">CONTINUAR</SubmitButton>
          </ActionButtons>
        </Section>
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2023 Multi Publicidade</Copyright>
        </FooterContent>
      </Footer>
    </Page>
  );
}
