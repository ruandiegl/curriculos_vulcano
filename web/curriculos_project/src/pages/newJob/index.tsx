import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { ConfirmModal } from '../../components/ConfirmModal';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { createVaga, deleteVaga, getVaga, listVagas, updateVaga } from '../../services/vagas';
import type { VagaPayload } from '../../services/vagas';
import type { Vaga } from '../../types/vaga';
import { formatList, getStatusLabel } from '../../utils/status';
import {
  ActionButton,
  ActionButtons,
  CandidateAvatar,
  CandidateCell,
  CandidateInfo,
  CharacterCounter,
  ClearButton,
  CloseButton,
  Content,
  ContentHeader,
  DetailGrid,
  EmptyState,
  Field,
  FormActionButtons,
  FormGrid,
  FormSection,
  IconActionButton,
  Input,
  Label,
  MetricCard,
  MetricsGrid,
  SearchActions,
  SearchContainer,
  SearchInput,
  SearchInputWrapper,
  SearchSection,
  SectionCategory,
  SectionTitle,
  Select,
  StatusBadge,
  SubmitButton,
  Table,
  TableSection,
  TableWrapper,
  TextArea,
} from './styles';

const PAGE_SIZE = 20;
const TITLE_LIMIT = 80;
const CITY_LIMIT = 60;
const STATE_LIMIT = 2;
const SEARCH_LIMIT = 100;
const DESCRIPTION_LIMIT = 300;

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

function nullable(value: string) {
  return value.trim() || null;
}

function toForm(vaga: Vaga): FormState {
  return {
    titulo: (vaga.titulo ?? '').slice(0, TITLE_LIMIT),
    cidade: (vaga.cidade ?? '').slice(0, CITY_LIMIT),
    estado: (vaga.estado ?? '').slice(0, STATE_LIMIT),
    descricao: (vaga.descricao ?? '').slice(0, DESCRIPTION_LIMIT),
    ativa: vaga.ativa ? 'true' : 'false',
  };
}

function buildPayload(form: FormState): VagaPayload {
  return {
    titulo: form.titulo.slice(0, TITLE_LIMIT).trim(),
    cidade: nullable(form.cidade.slice(0, CITY_LIMIT)),
    estado: nullable(form.estado.slice(0, STATE_LIMIT)),
    descricao: nullable(form.descricao.slice(0, DESCRIPTION_LIMIT)),
    ativa: form.ativa === 'true',
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? fallback;
  }

  return fallback;
}

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.split('@')[0] || 'AD';
  const words = source.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function formatLocation(vaga: Vaga) {
  return [vaga.cidade, vaga.estado].filter(Boolean).join(' / ') || 'Local não informado';
}

function truncateText(value: string | null | undefined, limit = 56) {
  const text = value?.trim();

  if (!text) {
    return 'Descrição não informada.';
  }

  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <path d="M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 16.5-.8 4.3 4.3-.8L18.8 8.7l-3.5-3.5L4 16.5Z" />
      <path d="m14.2 6.3 3.5 3.5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
    </svg>
  );
}

export default function NewJob() {
  const navigate = useNavigate();
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
  const activeJobs = useMemo(() => vagas.filter((vaga) => vaga.ativa).length, [vagas]);

  useEffect(() => {
    let isCurrent = true;
    const timeoutId = window.setTimeout(() => {
      async function loadVagas() {
        try {
          setLoading(true);
          setMessage('');
          const response = await listVagas({ page: 1, limit: PAGE_SIZE, search: search.trim() });
          if (isCurrent) {
            setVagas(response.data);
          }
        } catch (error) {
          if (isCurrent) {
            setMessage(getErrorMessage(error, 'Não foi possível carregar as vagas.'));
          }
        } finally {
          if (isCurrent) {
            setLoading(false);
          }
        }
      }

      loadVagas();
    }, 250);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    const nextValue = String(value);
    const limitedValue = {
      titulo: nextValue.slice(0, TITLE_LIMIT),
      cidade: nextValue.slice(0, CITY_LIMIT),
      estado: nextValue.toUpperCase().slice(0, STATE_LIMIT),
      descricao: nextValue.slice(0, DESCRIPTION_LIMIT),
      ativa: nextValue,
    }[field] as FormState[K];

    setForm((current) => ({ ...current,
      [field]: limitedValue,
    }));
  }

  function updateSearch(value: string) {
    setSearch(value.slice(0, SEARCH_LIMIT));
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
      setMessage(getErrorMessage(error, 'Não foi possível salvar a vaga.'));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteJob() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteVaga(deleteTarget?.id);
      setVagas((items) => items.filter((item) => item.id !== deleteTarget?.id));
      if (selectedVaga?.id === deleteTarget?.id) {
        setSelectedVaga(null);
      }
      setDeleteTarget(null);
    } catch (error) {
      setMessage(getErrorMessage(error, 'Não foi possível excluir a vaga.'));
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
      setMessage(getErrorMessage(error, 'Não foi possível carregar os detalhes da vaga.'));
    } finally {
      setLoadingDetails(false);
    }
  }

  return (
    <AdminLayout activeSection="vagas">
        <Content>
          <ContentHeader>
            <div>
              <SectionCategory>Vagas</SectionCategory>
              <SectionTitle>Gerenciar Vagas</SectionTitle>
            </div>

            <MetricsGrid>
              <MetricCard>
                <span>Vagas</span>
                <strong>{vagas.length}</strong>
              </MetricCard>
              <MetricCard>
                <span>Ativas</span>
                <strong>{activeJobs}</strong>
              </MetricCard>
            </MetricsGrid>
          </ContentHeader>

          {message && <FeedbackMessage>{message}</FeedbackMessage>}

          <SearchSection>
            <SearchActions>
              <SearchContainer onSubmit={(event) => event.preventDefault()}>
                <SearchInputWrapper>
                  <SearchInput
                    type="text"
                    placeholder="Buscar vaga por titulo, cidade ou estado"
                    maxLength={SEARCH_LIMIT}
                    value={search}
                    onChange={(event) => updateSearch(event.target.value)}
                  />
                  <ClearButton type="button" onClick={() => setSearch('')}>
                    Limpar
                  </ClearButton>
                </SearchInputWrapper>
              </SearchContainer>

              <SubmitButton type="button" onClick={openCreateForm}>
                Cadastrar Vaga
              </SubmitButton>
            </SearchActions>
          </SearchSection>

          <TableSection>
            <TableWrapper>
              <Table>
                <colgroup>
                  <col style={{ width: '36%' }} />
                  <col style={{ width: '24%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Vaga</th>
                    <th>Local</th>
                    <th>Status</th>
                    <th>Candidatos</th>
                    <th>Ações</th>
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
                      <tr
                        key={vaga.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleViewVaga(vaga)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleViewVaga(vaga);
                          }
                        }}
                      >
                        <td>
                          <CandidateCell>
                            <CandidateAvatar>{getInitials(vaga.titulo)}</CandidateAvatar>
                            <CandidateInfo>
                              <strong>{vaga.titulo}</strong>
                              <span title={vaga.descricao ?? undefined}>{truncateText(vaga.descricao)}</span>
                            </CandidateInfo>
                          </CandidateCell>
                        </td>
                        <td>{formatLocation(vaga)}</td>
                        <td>
                          <StatusBadge $active={vaga.ativa}>
                            <span aria-hidden="true" />
                            {vaga.ativa ? 'Ativa' : 'Inativa'}
                          </StatusBadge>
                        </td>
                        <td>{vaga.candidaturas?.length ?? 0}</td>
                        <td>
                          <ActionButtons>
                            <IconActionButton
                              type="button"
                              aria-label={`Ver vaga ${vaga.titulo}`}
                              title="Ver vaga"
                              $variant="view"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleViewVaga(vaga);
                              }}
                            >
                              <EyeIcon />
                            </IconActionButton>
                            <IconActionButton
                              type="button"
                              aria-label={`Editar vaga ${vaga.titulo}`}
                              title="Editar vaga"
                              $variant="edit"
                              onClick={(event) => {
                                event.stopPropagation();
                                openEditForm(vaga);
                              }}
                            >
                              <EditIcon />
                            </IconActionButton>
                            <IconActionButton
                              type="button"
                              aria-label={`Excluir vaga ${vaga.titulo}`}
                              title="Excluir vaga"
                              $variant="delete"
                              onClick={(event) => {
                                event.stopPropagation();
                                setDeleteTarget(vaga);
                              }}
                            >
                              <TrashIcon />
                            </IconActionButton>
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
              <SectionCategory>{editingVaga ? 'Editar vaga' : 'Cadastro'}</SectionCategory>
              <SectionTitle>{editingVaga ? 'Alterar Vaga' : 'Cadastrar Vaga'}</SectionTitle>

              <FormGrid>
                <Field>
                  <Label>Nome da Vaga</Label>
                  <Input
                    placeholder="Nome da vaga"
                    maxLength={TITLE_LIMIT}
                    value={form.titulo}
                    onChange={(event) => updateField('titulo', event.target.value)}
                  />
                </Field>
                <Field>
                  <Label>Cidade</Label>
                  <Input
                    placeholder="Cidade"
                    maxLength={CITY_LIMIT}
                    value={form.cidade}
                    onChange={(event) => updateField('cidade', event.target.value)}
                  />
                </Field>
                <Field>
                  <Label>Estado</Label>
                  <Input
                    placeholder="UF"
                    maxLength={STATE_LIMIT}
                    value={form.estado}
                    onChange={(event) => updateField('estado', event.target.value)}
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
                  <Label>Descrição da vaga</Label>
                  <TextArea
                    placeholder="Descreva a oportunidade de forma breve"
                    maxLength={DESCRIPTION_LIMIT}
                    value={form.descricao}
                    onChange={(event) => updateField('descricao', event.target.value)}
                  />
                  <CharacterCounter>
                    {form.descricao.length}/{DESCRIPTION_LIMIT}
                  </CharacterCounter>
                </Field>
              </FormGrid>

              <FormActionButtons>
                <SubmitButton type="button" disabled={saving} onClick={handleSaveVaga}>
                  {saving ? 'Salvando...' : editingVaga ? 'Salvar Alterações' : 'Cadastrar Vaga'}
                </SubmitButton>
                <CloseButton type="button" onClick={closeForm}>
                  Fechar
                </CloseButton>
              </FormActionButtons>
            </FormSection>
          )}

          {selectedVaga && (
            <FormSection>
              <SectionCategory>{loadingDetails ? 'Carregando detalhes' : 'Detalhes da vaga'}</SectionCategory>
              <SectionTitle>{selectedVaga?.titulo}</SectionTitle>

              <DetailGrid>
                <div>
                  <strong>Status</strong>
                  <span>{selectedVaga?.ativa ? 'Ativa' : 'Inativa'}</span>
                </div>
                <div>
                  <strong>Local</strong>
                  <span>{formatLocation(selectedVaga)}</span>
                </div>
                <div>
                  <strong>Candidatos</strong>
                  <span>{candidates.length}</span>
                </div>
                <div>
                  <strong>Descrição</strong>
                  <span>{truncateText(selectedVaga?.descricao, DESCRIPTION_LIMIT)}</span>
                </div>
              </DetailGrid>

              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>Candidato</th>
                      <th>E-mail</th>
                      <th>Telefone</th>
                      <th>Atuação</th>
                      <th>Status Curriculo</th>
                      <th>Ações</th>
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
                          <td>{curriculo?.status ? getStatusLabel(curriculo?.status) : '-'}</td>
                          <td>
                            {curriculo ? (
                              <ActionButton type="button" onClick={() => navigate(`/view/${curriculo?.id}`)}>
                                Ver Currículo
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
                <EmptyState>Nenhum candidato se candidatou a esta vaga ate o momento.</EmptyState>
              )}

              <FormActionButtons>
                <CloseButton type="button" onClick={() => setSelectedVaga(null)}>
                  Fechar detalhes
                </CloseButton>
              </FormActionButtons>
            </FormSection>
          )}
        </Content>

      {deleteTarget && (
        <ConfirmModal
          title="Excluir vaga?"
          description={`Esta ação vai remover a vaga "${deleteTarget?.titulo}". Depois de confirmar, não será possivel desfazer.`}
          confirmLabel="Excluir"
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteJob}
        />
      )}
    </AdminLayout>
  );
}
