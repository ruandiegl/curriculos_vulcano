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
  Section,
  SectionTitle,
  StatusLabel,
  StatusSelect,
  StatusWrapper,
  Value,
} from './styles';

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
        setMessage('Nao foi possivel carregar este curriculo.');
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
      setMessage('Nao foi possivel atualizar o status.');
    } finally {
      setSavingStatus(false);
    }
  }

  const firstAddress = curriculo?.enderecos?.[0];
  const possuiCNH = curriculo?.possuiCnh ? 'Sim' : 'Nao';
  const isAdmin = user?.tipo === 'admin';
  const homePath = user?.tipo === 'admin' ? '/dashboard' : '/profile';

  async function handleDownloadUploadedPdf() {
    const arquivo = curriculo?.arquivos?.[0];

    if (!curriculo || !arquivo?.id) {
      setMessage('Este curriculo nao possui PDF enviado pelo usuario.');
      return;
    }

    try {
      setMessage('');
      const blob = await downloadCurriculoArquivo(curriculo.id, arquivo.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = arquivo.nomeOriginal ?? `curriculo-${curriculo.nome}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage('Nao foi possivel baixar o PDF enviado pelo usuario.');
    }
  }

  const content = (
    <Main>
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
            {isAdmin && (
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
            )}
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
                <Value>{valueOrDash(formatPhone(curriculo.celular))}</Value>
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
                <Value>{valueOrDash(formatRg(curriculo.rg))}</Value>
              </DataItem>
              <DataItem>
                <Label>Telefone</Label>
                <Value>{valueOrDash(formatPhone(curriculo.telefone))}</Value>
              </DataItem>

              <DataItem>
                <Label>CPF</Label>
                <Value>{valueOrDash(formatCpf(curriculo.cpf))}</Value>
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
                    <Value>{valueOrDash(formatCnh(curriculo.numeroCnh))}</Value>
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
              <ActionButton href={homePath}>Voltar</ActionButton>
            </ActionButtons>

            {isAdmin && (
              <DownloadLinks>
                <DownloadLink as="button" type="button" onClick={() => downloadCurriculoSistemaPdf(curriculo)}>
                  + Download PDF (Sistema)
                </DownloadLink>
                <DownloadLink as="button" type="button" onClick={handleDownloadUploadedPdf}>
                  + Download PDF (Usuario)
                </DownloadLink>
              </DownloadLinks>
            )}
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
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink href={homePath}>{user?.tipo === 'admin' ? 'Gerenciar Curriculos' : 'Inicio'}</NavLink>
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
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>
      {logoutModal}
    </UserLayout>
  );
}
