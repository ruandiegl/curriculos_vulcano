import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import { getCurriculo, updateCurriculo } from '../../services/curriculos';
import type { Curriculo, CurriculoStatus } from '../../types/curriculo';
import { formatList, getStatusColor, getStatusLabel, statusLabels } from '../../utils/status';
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
  StatusLabel,
  StatusSelect,
  StatusWrapper,
  Value,
} from './styles';

function valueOrDash(value?: string | null) {
  return value || '-';
}

export default function View() {
  const navigate = useNavigate();
  const possuiCNH = 'Sim';
  const { id } = useParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [curriculo, setCurriculo] = useState<Curriculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadCurriculo() {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setMessage('');
        setCurriculo(await getCurriculo(id));
      } catch {
        setMessage('Nao foi possivel carregar este curriculo.');
      } finally {
        setLoading(false);
      }
    }

    loadCurriculo();
  }, [id]);

  function handleLogout() {
    signOut();
    navigate('/');
  }

  async function handleStatusChange(status: CurriculoStatus) {
    if (!id || !curriculo) {
      return;
    }

    try {
      setSavingStatus(true);
      setMessage('');
      const updated = await updateCurriculo(id, { status });
      setCurriculo(updated);
      setMessage('Status atualizado com sucesso.');
    } catch {
      setMessage('Nao foi possivel atualizar o status.');
    } finally {
      setSavingStatus(false);
    }
  }

  const firstAddress = curriculo?.enderecos?.[0];
  const possuiCNH = curriculo?.possuiCnh ? 'Sim' : 'Nao';

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
            <NavLink href="/dashboard">Gerenciar Curriculos</NavLink>
            <NavLink href="#">Gerenciar Vagas</NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
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
        <StatusWrapper>
          <StatusLabel>{loading ? 'Carregando curriculo...' : message}</StatusLabel>
          {curriculo && (
            <>
              <StatusLabel>
                Status atual:{' '}
                <span style={{ color: getStatusColor(curriculo.status), fontWeight: 800 }}>
                  {getStatusLabel(curriculo.status)}
                </span>
              </StatusLabel>
              <StatusSelect
                value={curriculo.status}
                disabled={savingStatus}
                onChange={(event) => handleStatusChange(event.target.value as CurriculoStatus)}
              >
                {statusLabels.map((item) => (
                  <option key={item.status} value={item.status}>
                    {item.label}
                  </option>
                ))}
              </StatusSelect>
            </>
          )}
        </StatusWrapper>

        {curriculo && (
          <>
            <Section>
              <SectionTitle>Dados Pessoais</SectionTitle>
              <Grid>
                <DataItem>
                  <Label>Nome</Label>
                  <Value>{curriculo.nome}</Value>
                </DataItem>
                <DataItem>
                  <Label>Celular</Label>
                  <Value>{valueOrDash(curriculo.celular)}</Value>
                </DataItem>
                <DataItem>
                  <Label>Data de Nascimento</Label>
                  <Value>{valueOrDash(curriculo.nascimento?.slice(0, 10))}</Value>
                </DataItem>

                <DataItem>
                  <Label>Estado Civil</Label>
                  <Value>{valueOrDash(curriculo.estadoCivil)}</Value>
                </DataItem>
                <DataItem>
                  <Label>RG</Label>
                  <Value>{valueOrDash(curriculo.rg)}</Value>
                </DataItem>
                <DataItem>
                  <Label>Telefone</Label>
                  <Value>{valueOrDash(curriculo.telefone)}</Value>
                </DataItem>

                <DataItem>
                  <Label>CPF</Label>
                  <Value>{valueOrDash(curriculo.cpf)}</Value>
                </DataItem>
                <DataItem>
                  <Label>Possui curso ativo de CBSP e HUET?</Label>
                  <Value>{curriculo.cursoAtivo ? 'Sim' : 'Nao'}</Value>
                </DataItem>
                <DataItem>
                  <Label>Possui CNH?</Label>
                  <Value>{possuiCNH}</Value>
                </DataItem>

                <DataItem>
                  <Label>Cargo/Area de Atuacao desejado</Label>
                  <Value>{formatList(curriculo.atuacoes)}</Value>
                </DataItem>
                <DataItem>
                  <Label>Cursos</Label>
                  <Value>{formatList(curriculo.cursos)}</Value>
                </DataItem>
                <DataItem>
                  <Label>Experiencias</Label>
                  <Value>{formatList(curriculo.experiencias)}</Value>
                </DataItem>

                {curriculo.possuiCnh && (
                  <>
                    <DataItem>
                      <Label>Numero da CNH</Label>
                      <Value>{valueOrDash(curriculo.numeroCnh)}</Value>
                    </DataItem>
                    <DataItem>
                      <Label>Vencimento da CNH</Label>
                      <Value>{valueOrDash(curriculo.vencimentoCnh?.slice(0, 10))}</Value>
                    </DataItem>
                    <DataItem>
                      <Label>Categoria da CNH</Label>
                      <Value>{valueOrDash(curriculo.categoriaCnh)}</Value>
                    </DataItem>
                  </>
                )}
              </Grid>
            </Section>

            <Section>
              <SectionTitle>Endereco</SectionTitle>
              <Grid>
                <DataItem>
                  <Label>Logradouro</Label>
                  <Value>{valueOrDash(firstAddress?.rua)}</Value>
                </DataItem>
                <DataItem>
                  <Label>Complemento</Label>
                  <Value>{valueOrDash(firstAddress?.bairro)}</Value>
                </DataItem>
                <DataItem>
                  <Label>Cidade</Label>
                  <Value>{valueOrDash(firstAddress?.cidade)}</Value>
                </DataItem>

                <DataItem>
                  <Label>Numero</Label>
                  <Value>{valueOrDash(firstAddress?.numero)}</Value>
                </DataItem>
                <DataItem>
                  <Label>Bairro</Label>
                  <Value>{valueOrDash(firstAddress?.bairro)}</Value>
                </DataItem>
                <DataItem>
                  <Label>Estado</Label>
                  <Value>{valueOrDash(firstAddress?.estado)}</Value>
                </DataItem>
              </Grid>

              <ActionButtons>
                <ActionButton href={`/edit/${curriculo.id}`}>Alterar Curriculo</ActionButton>
                <ActionButton href="/dashboard">Voltar</ActionButton>
              </ActionButtons>
            </Section>
          </>
        )}
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
