import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {
  ActionButton,
  ActionButtons,
  Brand,
  Copyright,
  DataItem,
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
  Value,
} from './styles';

export default function View() {
  const navigate = useNavigate();
  const possuiCNH = 'Sim';

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/dashboard')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/dashboard')}>Gerenciar Curriculos</NavLink>
            <NavLink onClick={() => {}}>Gerenciar Vagas</NavLink>
            <LogoutButton>Sair</LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
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
              <Value>21.807.878-0</Value>
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
              <Label>Possui curso ativo de CBSP e HUET?</Label>
              <Value>Sim</Value>
            </DataItem>
            <DataItem>
              <Label>Possui CNH?</Label>
              <Value>{possuiCNH}</Value>
            </DataItem>

            <DataItem>
              <Label>Cargo/Área de Atuação desejado 01</Label>
              <Value>SOLDADOR MIG/MAG</Value>
            </DataItem>
            <DataItem>
              <Label>Cargo/Área de Atuação desejado 02</Label>
              <Value>MECÂNICO DE MANUTENÇÃO</Value>
            </DataItem>
            <DataItem>
              <Label>Cargo/Área de Atuação desejado 03</Label>
              <Value>MECÂNICO DE MONTAGEM</Value>
            </DataItem>

            {possuiCNH === 'Sim' && (
              <>
                <DataItem>
                  <Label>Número da CNH</Label>
                  <Value />
                </DataItem>
                <DataItem>
                  <Label>Vencimento da CNH</Label>
                  <Value />
                </DataItem>
                <DataItem>
                  <Label>Categoria da CNH</Label>
                  <Value />
                </DataItem>
              </>
            )}
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

          <ActionButtons>
            <ActionButton onClick={() => navigate('/edit')}>Alterar Currículo</ActionButton>
            <ActionButton onClick={() => navigate('/dashboard')}>Voltar</ActionButton>
          </ActionButtons>
        </Section>
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/dashboard')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2023 Multi Publicidade</Copyright>
        </FooterContent>
      </Footer>
    </Page>
  );
}
