import logo from '../../assets/logo.png';
import {
  BackLink,
  Brand,
  Copyright,
  DataItem,
  DownloadLink,
  DownloadLinks,
  Footer,
  FooterContent,
  Grid,
  Header,
  HeaderContent,
  HeaderNav,
  Label,
  LogoutButton,
  Main,
  NavLink,
  Page,
  Section,
  SectionTitle,
  StatusLabel,
  StatusSelect,
  StatusWrapper,
  Value,
} from './styles';

export default function View() {
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
        <BackLink href="/dashboard">Voltar</BackLink>

        <StatusWrapper>
          <StatusLabel>Status</StatusLabel>
          <StatusSelect defaultValue="selecionado">
            <option value="selecionado">Selecionado</option>
            <option value="entrevistado">Entrevistado</option>
            <option value="desconsiderado">Desconsiderado</option>
            <option value="visualizado">Visualizado</option>
          </StatusSelect>
        </StatusWrapper>

        <Section>
          <SectionTitle>Dados Pessoais</SectionTitle>
          <Grid>
            <DataItem>
              <Label>Nome</Label>
              <Value>Adenilson knupp alves junior</Value>
            </DataItem>
            <DataItem>
              <Label>Celular</Label>
              <Value>(24) 98128-2805</Value>
            </DataItem>
            <DataItem>
              <Label>Data de Nascimento</Label>
              <Value>04/01/1995</Value>
            </DataItem>

            <DataItem>
              <Label>Estado Civil</Label>
              <Value>Solteiro</Value>
            </DataItem>
            <DataItem>
              <Label>RG</Label>
              <Value>(24) 9888-24214</Value>
            </DataItem>
            <DataItem>
              <Label>Telefone</Label>
              <Value>(24) 9888-24214</Value>
            </DataItem>

            <DataItem>
              <Label>CPF</Label>
              <Value>153.139.107-95</Value>
            </DataItem>
            <DataItem>
              <Label>Possui CNH?</Label>
              <Value>Não</Value>
            </DataItem>
            <DataItem>
              <Label>E-mail</Label>
              <Value>junior-knupp@hotmail.com</Value>
            </DataItem>

            <DataItem>
              <Label>Cargo/Área de Atuação desejado</Label>
              <Value>-</Value>
            </DataItem>
            <DataItem />
            <DataItem />

            <DataItem>
              <Label>Possui curso ativo de CBSP e HUET?</Label>
              <Value>Sim</Value>
            </DataItem>
          </Grid>
        </Section>

        <Section>
          <SectionTitle>Endereço</SectionTitle>
          <Grid>
            <DataItem>
              <Label>Logradouro</Label>
              <Value>Avenida São Paulo</Value>
            </DataItem>
            <DataItem>
              <Label>Complemento</Label>
              <Value>Casa</Value>
            </DataItem>
            <DataItem>
              <Label>Cidade</Label>
              <Value>Barra Mansa</Value>
            </DataItem>

            <DataItem>
              <Label>Número</Label>
              <Value>41</Value>
            </DataItem>
            <DataItem>
              <Label>Bairro</Label>
              <Value>Colônia Santo Antônio</Value>
            </DataItem>
            <DataItem>
              <Label>Estado</Label>
              <Value>RJ</Value>
            </DataItem>
          </Grid>
        </Section>

        <DownloadLinks>
          <DownloadLink href="#">+ Download PDF (Sistema)</DownloadLink>
          <DownloadLink href="#">+ Download PDF (Usuário)</DownloadLink>
        </DownloadLinks>
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
