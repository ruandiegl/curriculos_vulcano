import logo from '../../assets/logo.png';
import {
  ActionButtons,
  Brand,
  Copyright,
  Field,
  Footer,
  FooterContent,
  Grid,
  Header,
  HeaderContent,
  HeaderNav,
  Input,
  Label,
  LogoutButton,
  Main,
  NavLink,
  Page,
  ReturnButton,
  Section,
  SectionTitle,
  Select,
  SubmitButton,
} from './styles';

export default function Edit() {
  return (
    <Page>
      <Header>
        <HeaderContent>
          <Brand href="/dashboard">
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink href="/dashboard">Gerenciar Curriculos</NavLink>
            <NavLink href="#">Gerenciar Vagas</NavLink>
            <LogoutButton>Sair</LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <Section>
          <SectionTitle>Dados Pessoais</SectionTitle>
          <Grid>
            <Field>
              <Label>Nome</Label>
              <Input type="text" defaultValue="Adenilson knupp alves junior" />
            </Field>
            <Field>
              <Label>Celular</Label>
              <Input type="text" defaultValue="(24) 98128-2805" />
            </Field>
            <Field>
              <Label>Data de Nascimento</Label>
              <Input type="text" defaultValue="04/01/1995" />
            </Field>

            <Field>
              <Label>Estado Civil</Label>
              <Select defaultValue="Solteiro">
                <option value="Solteiro">Solteiro</option>
                <option value="Casado">Casado</option>
                <option value="Divorciado">Divorciado</option>
                <option value="Viúvo">Viúvo</option>
              </Select>
            </Field>
            <Field>
              <Label>RG</Label>
              <Input type="text" defaultValue="21.807.878-0" />
            </Field>
            <Field>
              <Label>Telefone</Label>
              <Input type="text" defaultValue="(24) 9888-24214" />
            </Field>

            <Field>
              <Label>CPF</Label>
              <Input type="text" defaultValue="153.139.107-95" />
            </Field>
            <Field>
              <Label>Possui curso ativo de CBSP e HUET?</Label>
              <Select defaultValue="Sim">
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </Select>
            </Field>
            <Field>
              <Label>Possui CNH?</Label>
              <Select defaultValue="Não">
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </Select>
            </Field>

            <Field>
              <Label>Cargo/Área de Atuação desejado 01</Label>
              <Select defaultValue="SOLDADOR MIG/MAG">
                <option value="SOLDADOR MIG/MAG">SOLDADOR MIG/MAG</option>
                <option value="OUTRO">OUTRO</option>
              </Select>
            </Field>
            <Field>
              <Label>Cargo/Área de Atuação desejado 02</Label>
              <Select defaultValue="MECÂNICO DE MANUTENÇÃO">
                <option value="MECÂNICO DE MANUTENÇÃO">MECÂNICO DE MANUTENÇÃO</option>
                <option value="OUTRO">OUTRO</option>
              </Select>
            </Field>
            <Field>
              <Label>Cargo/Área de Atuação desejado 03</Label>
              <Select defaultValue="MECÂNICO DE MONTAGEM">
                <option value="MECÂNICO DE MONTAGEM">MECÂNICO DE MONTAGEM</option>
                <option value="OUTRO">OUTRO</option>
              </Select>
            </Field>
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Endereço</SectionTitle>
          <Grid>
            <Field>
              <Label>Logradouro</Label>
              <Input type="text" defaultValue="Avenida São Paulo" />
            </Field>
            <Field>
              <Label>Complemento</Label>
              <Input type="text" defaultValue="Casa" />
            </Field>
            <Field>
              <Label>Cidade</Label>
              <Input type="text" defaultValue="Barra Mansa" />
            </Field>

            <Field>
              <Label>Número</Label>
              <Input type="text" defaultValue="41" />
            </Field>
            <Field>
              <Label>Bairro</Label>
              <Input type="text" defaultValue="Colônia Santo Antônio" />
            </Field>
            <Field>
              <Label>Estado</Label>
              <Input type="text" defaultValue="RJ" />
            </Field>
          </Grid>

          <ActionButtons>
            <SubmitButton type="button">Alterar Currículo</SubmitButton>
            <ReturnButton type="button" onClick={() => window.history.back()}>
              Voltar
            </ReturnButton>
          </ActionButtons>
        </Section>
      </Main>

      <Footer>
        <FooterContent>
          <Brand href="/dashboard">
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2023 Multi Publicidade</Copyright>
        </FooterContent>
      </Footer>
    </Page>
  );
}
