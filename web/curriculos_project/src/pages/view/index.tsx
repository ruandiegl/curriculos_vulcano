import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { AdminLayout } from '../../components/AdminLayout';
import { UserLayout } from '../../components/UserLayout';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { useAuth } from '../../hooks/useAuth';
import { downloadCurriculoArquivo, getCurriculo, updateCurriculo } from '../../services/curriculos';
import type { Curriculo, CurriculoStatus } from '../../types/curriculo';
import { downloadCurriculoSistemaPdf } from '../../utils/curriculoPdf';
import { formatCnh, formatCpf, formatPhone, formatRg, valueOrDash } from '../../utils/masks';
import { formatList, getStatusColor, getStatusLabel, statusLabels } from '../../utils/status';
import {
  ActionButton,
  ActionButtons,
  ActionGroup,
  ActionPanel,
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
  Section,
  SectionTitle,
  StatusLabel,
  StatusSelect,
  StatusWrapper,
  Value,
} from './styles';

function formatDate(value?: string | null) {
  return value?.slice(0, 10) || null;
}

export default function View() {
  const { id } = useParams();
  const { user } = useAuth();
  const { requestLogout, logoutModal } = useConfirmLogout();
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
        setMessage('Não foi possível carregar este currículo.');
      } finally {
        setLoading(false);
      }
    }

    loadCurriculo();
  }, [id]);

  function handleLogout() {
    requestLogout();
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
      setMessage('Não foi possível atualizar o status.');
    } finally {
      setSavingStatus(false);
    }
  }

  const firstAddress = curriculo?.enderecos?.[0];
  const possuiCNH = curriculo?.possuiCnh ? 'Sim' : 'Não';
  const isAdmin = user?.tipo === 'admin';
  const homePath = user?.tipo === 'admin' ? '/dashboard' : '/profile';

  async function handleDownloadUploadedPdf() {
    const arquivo = curriculo?.arquivos?.[0];

    if (!curriculo || !arquivo?.id) {
      setMessage('Este curriculo não possui PDF enviado pelo usuário.');
      return;
    }

    try {
      setMessage('');
      const blob = await downloadCurriculoArquivo(curriculo?.id, arquivo?.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = arquivo?.nomeOriginal ?? `curriculo-${curriculo?.nome}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage('Não foi possível baixar o PDF enviado pelo usuário.');
    }
  }

  const content = (
    <Main>
      <StatusWrapper>
        <StatusLabel>{loading ? 'Carregando currículo...' : message}</StatusLabel>
        {curriculo && (
          <>
            <StatusLabel>
              Status atual:{' '}
              <span style={{ color: getStatusColor(curriculo?.status), fontWeight: 800 }}>
                {getStatusLabel(curriculo?.status)}
              </span>
            </StatusLabel>
            {isAdmin && (
              <StatusSelect
                value={curriculo?.status}
                disabled={savingStatus}
                onChange={(event) => handleStatusChange(event.target.value as CurriculoStatus)}
              >
                {statusLabels.map((item) => (
                  <option key={item.status} value={item.status}>
                    {item.label}
                  </option>
                ))}
              </StatusSelect>
            )}
          </>
        )}
      </StatusWrapper>

      {curriculo && (
        <>
          <ActionPanel>
            <ActionGroup>
              {isAdmin && (
                <>
                  <ActionButton as="button" type="button" onClick={() => downloadCurriculoSistemaPdf(curriculo)}>
                    Baixar PDF do Sistema
                  </ActionButton>
                  <ActionButton as="button" type="button" onClick={handleDownloadUploadedPdf}>
                    Baixar PDF Enviado
                  </ActionButton>
                </>
              )}
            </ActionGroup>
            <ActionButtons>
              <ActionButton href={homePath}>Voltar</ActionButton>
              <ActionButton href={`/edit/${curriculo?.id}`}>Alterar Currículo</ActionButton>
            </ActionButtons>
          </ActionPanel>

          <Section>
            <SectionTitle>Dados Pessoais</SectionTitle>
            <Grid>
              <DataItem>
                <Label>Nome</Label>
                <Value>{curriculo?.nome}</Value>
              </DataItem>
              <DataItem>
                <Label>Celular</Label>
                <Value>{valueOrDash(formatPhone(curriculo?.celular))}</Value>
              </DataItem>
              <DataItem>
                <Label>Data de Nascimento</Label>
                <Value>{valueOrDash(curriculo?.nascimento?.slice(0, 10))}</Value>
              </DataItem>

              <DataItem>
                <Label>Estado Civil</Label>
                <Value>{valueOrDash(curriculo?.estadoCivil)}</Value>
              </DataItem>
              <DataItem>
                <Label>RG</Label>
                <Value>{valueOrDash(formatRg(curriculo?.rg))}</Value>
              </DataItem>
              <DataItem>
                <Label>Telefone</Label>
                <Value>{valueOrDash(formatPhone(curriculo?.telefone))}</Value>
              </DataItem>

              <DataItem>
                <Label>CPF</Label>
                <Value>{valueOrDash(formatCpf(curriculo?.cpf))}</Value>
              </DataItem>
              <DataItem>
                <Label>Possui curso ativo de CBSP e HUET?</Label>
                <Value>{curriculo?.cursoAtivo ? 'Sim' : 'Não'}</Value>
              </DataItem>
              <DataItem>
                <Label>Possui CNH?</Label>
                <Value>{possuiCNH}</Value>
              </DataItem>

              <DataItem>
                <Label>Cargo/Área de Atuação desejado</Label>
                <Value>{formatList(curriculo?.atuacoes)}</Value>
              </DataItem>

              {curriculo?.possuiCnh && (
                <>
                  <DataItem>
                    <Label>Número da CNH</Label>
                    <Value>{valueOrDash(formatCnh(curriculo?.numeroCnh))}</Value>
                  </DataItem>
                  <DataItem>
                    <Label>Vencimento da CNH</Label>
                    <Value>{valueOrDash(curriculo?.vencimentoCnh?.slice(0, 10))}</Value>
                  </DataItem>
                  <DataItem>
                    <Label>Categoria da CNH</Label>
                    <Value>{valueOrDash(curriculo?.categoriaCnh)}</Value>
                  </DataItem>
                </>
              )}
            </Grid>
          </Section>

          <Section>
            <SectionTitle>Endereço</SectionTitle>
            <Grid>
              <DataItem>
                <Label>CEP</Label>
                <Value>{valueOrDash(firstAddress?.cep)}</Value>
              </DataItem>
              <DataItem>
                <Label>Logradouro</Label>
                <Value>{valueOrDash(firstAddress?.rua)}</Value>
              </DataItem>
              <DataItem>
                <Label>Complemento</Label>
                <Value>{valueOrDash(firstAddress?.complemento)}</Value>
              </DataItem>
              <DataItem>
                <Label>Cidade</Label>
                <Value>{valueOrDash(firstAddress?.cidade)}</Value>
              </DataItem>

              <DataItem>
                <Label>Número</Label>
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
          </Section>

          <Section>
            <SectionTitle>Formação Acadêmica</SectionTitle>
            <Grid>
              {(curriculo?.escolaridades?.length ? curriculo.escolaridades : [null]).map((item, index) => (
                <DataItem key={item?.id ?? `empty-education-${index}`}>
                  <Label>{item ? valueOrDash(item.curso ?? item.escola) : 'Formação'}</Label>
                  <Value>
                    {item
                      ? [item.escola, formatDate(item.dataInicio), formatDate(item.dataTermino)]
                        .filter(Boolean)
                        .join(' - ')
                      : 'Nenhuma formação cadastrada'}
                  </Value>
                </DataItem>
              ))}
            </Grid>
          </Section>

          <Section>
            <SectionTitle>Experiência Profissional</SectionTitle>
            <Grid>
              {(curriculo?.experiencias?.length ? curriculo.experiencias : [null]).map((item, index) => (
                <DataItem key={item?.id ?? `empty-experience-${index}`}>
                  <Label>{item ? valueOrDash(item.empresa) : 'Experiência'}</Label>
                  <Value>
                    {item
                      ? [
                        item.cargo,
                        formatDate(item.dataInicio),
                        formatDate(item.dataTermino) ?? 'Atual',
                        item.funcoes,
                      ].filter(Boolean).join(' - ')
                      : 'Nenhuma experiência cadastrada'}
                  </Value>
                </DataItem>
              ))}
            </Grid>
          </Section>

          <Section>
            <SectionTitle>Cursos e Certificações</SectionTitle>
            <Grid>
              {(curriculo?.cursos?.length ? curriculo.cursos : [null]).map((item, index) => (
                <DataItem key={item?.id ?? `empty-course-${index}`}>
                  <Label>{item ? valueOrDash(item.nome) : 'Curso ou certificação'}</Label>
                  <Value>
                    {item
                      ? [item.instituicao, item.cargaHoraria].filter(Boolean).join(' - ') || valueOrDash(item.nome)
                      : 'Nenhum curso ou certificação cadastrado'}
                  </Value>
                </DataItem>
              ))}
            </Grid>
          </Section>
        </>
      )}
    </Main>
  );

  if (isAdmin) {
    return <AdminLayout activeSection="curriculos">{content}</AdminLayout>;
  }

  return (
    <UserLayout>
      <Header>
        <HeaderContent>
          <Brand href={homePath}>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink href={homePath}>{user?.tipo === 'admin' ? 'Gerenciar Currículos' : 'Início'}</NavLink>
            <NavLink href={user?.tipo === 'admin' ? '/newJob' : '/vagas'}>
              {user?.tipo === 'admin' ? 'Gerenciar Vagas' : 'Vagas'}
            </NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      {content}

      <Footer>
        <FooterContent>
          <Brand href={homePath}>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>
          <Copyright>Â© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>
      {logoutModal}
    </UserLayout>
  );
}
