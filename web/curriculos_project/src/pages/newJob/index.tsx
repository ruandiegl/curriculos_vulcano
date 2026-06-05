import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { ConfirmModal } from '../../components/ConfirmModal';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { createVaga, deleteVaga, getVaga, listVagas, updateVaga } from '../../services/vagas';
import type { VagaPayload } from '../../services/vagas';
import type { Vaga } from '../../types/vaga';
import { formatList, getStatusLabel } from '../../utils/status';
import {
  ActionButton,
  ActionButtons,
  Brand,
  CloseButton,
  Copyright,
  DetailGrid,
  EmptyState,
  Field,
  Footer,
  FooterContent,
  FormActionButtons,
  FormGrid,
  FormSection,
  Header,
  HeaderContent,
  HeaderNav,
  Input,
  Label,
  LogoutButton,
  Main,
  NavLink,
  OpenFormButton,
  Page,
  SearchBar,
  SearchInput,
  SectionTitleWrapper,
  Select,
  StatusBadge,
  SubmitButton,
  Table,
  TableSection,
  TableWrapper,
  TextArea,
} from './styles';

const PAGE_SIZE = 20;

type FormState = {
  titulo: string;
  cidade: string;
  estado: string;
  descricao: string;
  ativa: string;
};

const initialForm: FormState = {
  titulo: '',
  cidade: '',
  estado: '',
  descricao: '',
  ativa: 'true',
};

function toForm(vaga: Vaga): FormState {
  return {
    titulo: vaga.titulo ?? '',
    cidade: vaga.cidade ?? '',
    estado: vaga.estado ?? '',
    descricao: vaga.descricao ?? '',
    ativa: vaga.ativa ? 'true' : 'false',
  };
}

function nullable(value: string) {
  return value.trim() || null;
}

function buildPayload(form: FormState): VagaPayload {
  return {
    titulo: form.titulo.trim(),
    cidade: nullable(form.cidade),
    estado: nullable(form.estado),
    descricao: nullable(form.descricao),
    ativa: form.ativa === 'true',
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? fallback;
  }

  return fallback;
}

export default function NewJob() {
  const navigate = useNavigate();
  const { requestLogout, logoutModal } = useConfirmLogout();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [selectedVaga, setSelectedVaga] = useState<Vaga | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVaga, setEditingVaga] = useState<Vaga | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vaga | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [message, setMessage] = useState('');

  const candidates = useMemo(() => selectedVaga?.candidaturas ?? [], [selectedVaga]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadVagas(search);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  async function loadVagas(searchValue = search) {
    try {
      setLoading(true);
      setMessage('');
      const response = await listVagas({ page: 1, limit: PAGE_SIZE, search: searchValue.trim() });
      setVagas(response.data);
    } catch (error) {
      setMessage(getErrorMessage(error, 'Nao foi possivel carregar as vagas.'));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    requestLogout();
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreateForm() {
    setSelectedVaga(null);
    setEditingVaga(null);
    setForm(initialForm);
    setMessage('');
    setShowForm(true);
  }

  function openEditForm(vaga: Vaga) {
    setSelectedVaga(null);
    setEditingVaga(vaga);
    setForm(toForm(vaga));
    setMessage('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingVaga(null);
    setForm(initialForm);
  }

  async function handleSaveVaga() {
    setMessage('');

    if (form.titulo.trim().length < 2) {
      setMessage('Informe o nome da vaga para continuar.');
      return;
    }

    try {
      setSaving(true);

      if (editingVaga) {
        const updated = await updateVaga(editingVaga.id, buildPayload(form));
        setVagas((items) => items.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
        if (selectedVaga?.id === updated.id) {
          setSelectedVaga((current) => (current ? { ...current, ...updated } : current));
        }
      } else {
        const created = await createVaga(buildPayload(form));
        setVagas((items) => [created, ...items]);
      }

      closeForm();
    } catch (error) {
      setMessage(getErrorMessage(error, 'Nao foi possivel salvar a vaga.'));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteJob() {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      await deleteVaga(deleteTarget.id);
      setVagas((items) => items.filter((item) => item.id !== deleteTarget.id));
      if (selectedVaga?.id === deleteTarget.id) {
        setSelectedVaga(null);
      }
      setDeleteTarget(null);
    } catch (error) {
      setMessage(getErrorMessage(error, 'Nao foi possivel excluir a vaga.'));
    } finally {
      setDeleting(false);
    }
  }

  async function handleViewVaga(vaga: Vaga) {
    try {
      setShowForm(false);
      setEditingVaga(null);
      setForm(initialForm);
      setLoadingDetails(true);
      setMessage('');
      const details = await getVaga(vaga.id);
      setSelectedVaga(details);
    } catch (error) {
      setMessage(getErrorMessage(error, 'Nao foi possivel carregar os detalhes da vaga.'));
    } finally {
      setLoadingDetails(false);
    }
  }

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/dashboard')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/dashboard')}>Gerenciar Curriculos</NavLink>
            <NavLink onClick={() => navigate('/newJob')}>Gerenciar Vagas</NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <SectionTitleWrapper>
          <span>Vagas</span>
          <h1>Gerenciar Vagas</h1>
        </SectionTitleWrapper>

        {message && <FeedbackMessage>{message}</FeedbackMessage>}

        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Buscar vaga"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <OpenFormButton type="button" onClick={openCreateForm}>
            Cadastrar Vaga
          </OpenFormButton>
        </SearchBar>

        <TableSection>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Vaga</th>
                  <th>Local</th>
                  <th>Status</th>
                  <th>Candidatos</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5}>Carregando vagas...</td>
                  </tr>
                )}

                {!loading && vagas.length === 0 && (
                  <tr>
                    <td colSpan={5}>Nenhuma vaga encontrada.</td>
                  </tr>
                )}

                {!loading &&
                  vagas.map((vaga) => (
                    <tr key={vaga.id}>
                      <td>{vaga.titulo}</td>
                      <td>{[vaga.cidade, vaga.estado].filter(Boolean).join(' / ') || '-'}</td>
                      <td>
                        <StatusBadge $active={vaga.ativa}>{vaga.ativa ? 'Ativa' : 'Inativa'}</StatusBadge>
                      </td>
                      <td>{vaga.candidaturas?.length ?? 0}</td>
                      <td>
                        <ActionButtons>
                          <ActionButton type="button" onClick={() => handleViewVaga(vaga)}>
                            Ver
                          </ActionButton>
                          <ActionButton type="button" onClick={() => openEditForm(vaga)}>
                            Editar
                          </ActionButton>
                          <ActionButton type="button" onClick={() => setDeleteTarget(vaga)}>
                            Excluir
                          </ActionButton>
                        </ActionButtons>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </TableWrapper>
        </TableSection>

        {showForm && (
          <FormSection>
            <SectionTitleWrapper>
              <span>{editingVaga ? 'Editar' : 'Cadastro'}</span>
              <h1>{editingVaga ? 'Alterar Vaga' : 'Cadastrar Vaga'}</h1>
            </SectionTitleWrapper>

            <FormGrid>
              <Field>
                <Label>Nome da Vaga</Label>
                <Input
                  placeholder="Nome da vaga"
                  value={form.titulo}
                  onChange={(event) => updateField('titulo', event.target.value)}
                />
              </Field>
              <Field>
                <Label>Cidade</Label>
                <Input
                  placeholder="Cidade"
                  value={form.cidade}
                  onChange={(event) => updateField('cidade', event.target.value)}
                />
              </Field>
              <Field>
                <Label>Estado</Label>
                <Input
                  placeholder="UF"
                  value={form.estado}
                  onChange={(event) => updateField('estado', event.target.value.toUpperCase().slice(0, 2))}
                />
              </Field>
              <Field>
                <Label>Status</Label>
                <Select value={form.ativa} onChange={(event) => updateField('ativa', event.target.value)}>
                  <option value="true">Ativa</option>
                  <option value="false">Inativa</option>
                </Select>
              </Field>
              <Field $fullWidth>
                <Label>Descricao da vaga</Label>
                <TextArea
                  placeholder="Descricao da vaga"
                  value={form.descricao}
                  onChange={(event) => updateField('descricao', event.target.value)}
                />
              </Field>
            </FormGrid>

            <FormActionButtons>
              <SubmitButton type="button" disabled={saving} onClick={handleSaveVaga}>
                {saving ? 'Salvando...' : editingVaga ? 'Salvar Alteracoes' : 'Cadastrar Vaga'}
              </SubmitButton>
              <CloseButton type="button" onClick={closeForm}>
                Fechar
              </CloseButton>
            </FormActionButtons>
          </FormSection>
        )}

        {selectedVaga && (
          <FormSection>
            <SectionTitleWrapper>
              <span>{loadingDetails ? 'Carregando detalhes' : 'Detalhes da vaga'}</span>
              <h1>{selectedVaga.titulo}</h1>
            </SectionTitleWrapper>

            <DetailGrid>
              <div>
                <strong>Status</strong>
                <span>{selectedVaga.ativa ? 'Ativa' : 'Inativa'}</span>
              </div>
              <div>
                <strong>Local</strong>
                <span>{[selectedVaga.cidade, selectedVaga.estado].filter(Boolean).join(' / ') || '-'}</span>
              </div>
              <div>
                <strong>Candidatos</strong>
                <span>{candidates.length}</span>
              </div>
              <div>
                <strong>Descricao</strong>
                <span>{selectedVaga.descricao || '-'}</span>
              </div>
            </DetailGrid>

            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Candidato</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Atuacao</th>
                    <th>Status Curriculo</th>
                    <th>Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.length === 0 && (
                    <tr>
                      <td colSpan={6}>Nenhuma candidatura encontrada para esta vaga.</td>
                    </tr>
                  )}

                  {candidates.map((candidatura) => {
                    const curriculo = candidatura.usuario?.curriculos?.[0];

                    return (
                      <tr key={candidatura.id}>
                        <td>{curriculo?.nome ?? candidatura.usuario?.nome ?? '-'}</td>
                        <td>{curriculo?.email ?? candidatura.usuario?.email ?? '-'}</td>
                        <td>{curriculo?.celular ?? curriculo?.telefone ?? '-'}</td>
                        <td>{formatList(curriculo?.atuacoes)}</td>
                        <td>{curriculo?.status ? getStatusLabel(curriculo.status) : '-'}</td>
                        <td>
                          {curriculo ? (
                            <ActionButton type="button" onClick={() => navigate(`/view/${curriculo.id}`)}>
                              Ver Curriculo
                            </ActionButton>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </TableWrapper>

            {candidates.length === 0 && (
              <EmptyState>
                Nenhum candidato se candidatou a esta vaga ate o momento.
              </EmptyState>
            )}

            <FormActionButtons>
              <CloseButton type="button" onClick={() => setSelectedVaga(null)}>
                Fechar detalhes
              </CloseButton>
            </FormActionButtons>
          </FormSection>
        )}
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/dashboard')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>

      {deleteTarget && (
        <ConfirmModal
          title="Excluir vaga?"
          description={`Esta acao vai remover a vaga "${deleteTarget.titulo}". Depois de confirmar, nao sera possivel desfazer.`}
          confirmLabel="Excluir"
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteJob}
        />
      )}
      {logoutModal}
    </Page>
  );
}
