import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, MouseEvent, PointerEvent } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { EditIcon, TrashIcon } from '../../components/ActionIcons';
import { ConfirmModal } from '../../components/ConfirmModal';
import { createUsuario, deleteUsuario, listUsuarios, updateUsuario } from '../../services/usuarios';
import type { UsuarioPayload, UsuarioScope } from '../../services/usuarios';
import type { Usuario, UsuarioTipo } from '../../types/usuario';
import { isValidEmail, normalizeEmail } from '../../utils/email';
import {
  Avatar,
  Button,
  CheckboxRow,
  ClearButton,
  Content,
  ContentHeader,
  Field,
  FormActions,
  FormSection,
  FormTitle,
  IconActionButton,
  Input,
  MetricCard,
  ModalActions,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  PageButton,
  Pagination,
  RowActions,
  ScopeButton,
  ScopeGroup,
  SearchInput,
  SearchInputWrapper,
  SearchSection,
  SectionCategory,
  SectionTitle,
  Select,
  StateMessage,
  Table,
  TableSection,
  TableWrapper,
  TypeBadge,
  UserModal,
  UserModalBackdrop,
  UserModalHandle,
  UserCell,
  UserInfo,
  WorkspaceGrid,
} from './styles';

const PAGE_SIZE = 20;
const MOBILE_DRAWER_QUERY = '(max-width: 640px)';
const DRAWER_CLOSE_DISTANCE = 90;

type FormState = {
  nome: string;
  email: string;
  password: string;
  cpf: string;
  tipo: UsuarioTipo;
  possuiCurriculo: boolean;
};

const initialForm: FormState = {
  nome: '',
  email: '',
  password: '',
  cpf: '',
  tipo: 'admin',
  possuiCurriculo: false,
};

const scopes: Array<{ value: UsuarioScope; label: string }> = [
  { value: 'createdByMe', label: 'Criados por mim' },
  { value: 'admins', label: 'Admins e super admins' },
  { value: 'usuarios', label: 'Usuários comuns' },
  { value: 'all', label: 'Todos' },
];

function isMobileDrawer() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_DRAWER_QUERY).matches;
}

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.split('@')[0] || 'US';
  const words = source.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function getTypeLabel(tipo: UsuarioTipo) {
  if (tipo === 'superAdmin') return 'Super admin';
  if (tipo === 'admin') return 'Admin';
  return 'Usuário';
}

function formFromUsuario(usuario: Usuario): FormState {
  return {
    nome: usuario.nome ?? '',
    email: usuario.email ?? '',
    password: '',
    cpf: usuario.cpf ?? '',
    tipo: usuario.tipo,
    possuiCurriculo: Boolean(usuario.possuiCurriculo),
  };
}

function nullable(value: string) {
  return value.trim() || null;
}

function buildPayload(form: FormState, editing: boolean): UsuarioPayload | Partial<UsuarioPayload> {
  return {
    nome: form.nome.trim(),
    email: normalizeEmail(form.email),
    ...(form.password ? { password: form.password } : {}),
    cpf: nullable(form.cpf),
    tipo: form.tipo,
    possuiCurriculo: form.possuiCurriculo,
    ...(editing ? {} : !form.password ? { password: undefined } : {}),
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? fallback;
  }

  return fallback;
}

export default function Users() {
  const editDragStartYRef = useRef<number | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [scope, setScope] = useState<UsuarioScope>('createdByMe');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const pages = useMemo(() => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, totalPages]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
      setAppliedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    let isCurrent = true;

    async function loadUsuarios() {
      try {
        setLoading(true);
        setErrorMessage('');
        const response = await listUsuarios({
          page,
          limit: PAGE_SIZE,
          search: appliedSearch,
          scope,
        });

        if (!isCurrent) return;

        setUsuarios(response.data);
        setTotal(response.meta.total);
        setTotalPages(Math.max(response.meta.totalPages, 1));
      } catch (error) {
        if (isCurrent) {
          setErrorMessage(getErrorMessage(error, 'Nao foi possivel carregar os usuarios.'));
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadUsuarios();

    return () => {
      isCurrent = false;
    };
  }, [page, appliedSearch, scope]);

  function resetForm() {
    setForm(initialForm);
    setEditingUser(null);
  }

  function editUsuario(usuario: Usuario) {
    setEditingUser(usuario);
    setForm(formFromUsuario(usuario));
    setMessage('');
    setErrorMessage('');
  }

  function updateField<Key extends keyof FormState>(field: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!form.nome.trim() || !form.email.trim()) {
      setErrorMessage('Informe nome e e-mail.');
      return;
    }

    if (!isValidEmail(form.email)) {
      setErrorMessage('Informe um e-mail valido.');
      return;
    }

    if (!editingUser && (form.tipo === 'admin' || form.tipo === 'superAdmin') && !form.password) {
      setErrorMessage('Informe uma senha para usuarios administrativos.');
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload(form, Boolean(editingUser));
      const saved = editingUser
        ? await updateUsuario(editingUser.id, payload)
        : await createUsuario(payload as UsuarioPayload);

      setUsuarios((current) => {
        if (editingUser) {
          return current.map((usuario) => (usuario.id === saved.id ? saved : usuario));
        }

        return scope === 'createdByMe' || scope === 'all' ? [saved, ...current].slice(0, PAGE_SIZE) : current;
      });
      setMessage(editingUser ? 'Usuario atualizado.' : 'Usuario criado.');
      resetForm();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Nao foi possivel salvar o usuario.'));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteUsuario(deleteTarget.id);
      setUsuarios((current) => current.filter((usuario) => usuario.id !== deleteTarget.id));
      setTotal((current) => Math.max(current - 1, 0));
      setDeleteTarget(null);
      setMessage('Usuario removido.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Nao foi possivel remover o usuario.'));
    } finally {
      setDeleting(false);
    }
  }

  function closeEditModal() {
    resetForm();
  }

  function handleEditBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closeEditModal();
    }
  }

  function handleEditPointerDown(event: PointerEvent<HTMLFormElement>) {
    if (!isMobileDrawer()) {
      return;
    }

    editDragStartYRef.current = event.clientY;
  }

  function handleEditPointerUp(event: PointerEvent<HTMLFormElement>) {
    const startY = editDragStartYRef.current;
    editDragStartYRef.current = null;

    if (!isMobileDrawer() || startY === null) {
      return;
    }

    if (event.clientY - startY >= DRAWER_CLOSE_DISTANCE) {
      closeEditModal();
    }
  }

  return (
    <AdminLayout activeSection="usuarios">
      <Content>
        <ContentHeader>
          <div>
            <SectionCategory>Super admin</SectionCategory>
            <SectionTitle>Gerenciar usuários</SectionTitle>
          </div>
          <MetricCard>
            <span>Encontrados</span>
            <strong>{total}</strong>
          </MetricCard>
        </ContentHeader>

        <SearchSection>
          <SearchInputWrapper>
            <SearchInput
              type="text"
              placeholder="Buscar por nome, e-mail, CPF ou UID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <ClearButton type="button" onClick={() => setSearch('')}>
              Limpar
            </ClearButton>
          </SearchInputWrapper>

          <ScopeGroup aria-label="Escopo de usuarios">
            {scopes.map((item) => (
              <ScopeButton
                key={item.value}
                type="button"
                $active={scope === item.value}
                onClick={() => {
                  setScope(item.value);
                  setPage(1);
                }}
              >
                {item.label}
              </ScopeButton>
            ))}
          </ScopeGroup>
        </SearchSection>

        <WorkspaceGrid>
          <FormSection onSubmit={handleSubmit}>
            <FormTitle>Novo usuário</FormTitle>

            <Field>
              Nome
              <Input value={form.nome} onChange={(event) => updateField('nome', event.target.value)} />
            </Field>

            <Field>
              E-mail
              <Input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
            </Field>

            <Field>
              Senha
              <Input
                type="password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
              />
            </Field>

            <Field>
              CPF
              <Input value={form.cpf} onChange={(event) => updateField('cpf', event.target.value)} />
            </Field>

            <Field>
              Perfil
              <Select
                value={form.tipo}
                onChange={(event) => updateField('tipo', event.target.value as UsuarioTipo)}
              >
                <option value="admin">Admin</option>
                <option value="usuario">Usuário comum</option>
                <option value="superAdmin">Super admin</option>
              </Select>
            </Field>

            <CheckboxRow>
              <input
                type="checkbox"
                checked={form.possuiCurriculo}
                onChange={(event) => updateField('possuiCurriculo', event.target.checked)}
              />
              Possui currículo
            </CheckboxRow>

            {message && <StateMessage $variant="success">{message}</StateMessage>}
            {errorMessage && <StateMessage $variant="error">{errorMessage}</StateMessage>}

            <FormActions>
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Criar usuário'}
              </Button>
            </FormActions>
          </FormSection>

          <TableSection>
            <TableWrapper>
              {loading && <StateMessage>Carregando usuarios...</StateMessage>}
              {!loading && !errorMessage && usuarios.length === 0 && (
                <StateMessage>Nenhum usuario encontrado.</StateMessage>
              )}
              {!loading && usuarios.length > 0 && (
                <Table>
                  <colgroup>
                    <col style={{ width: '34%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '26%' }} />
                    <col style={{ width: '22%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Usuário</th>
                      <th>Perfil</th>
                      <th>Criado por</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td data-label="Usuário">
                          <UserCell>
                            <Avatar>{getInitials(usuario.nome, usuario.email)}</Avatar>
                            <UserInfo>
                              <strong>{usuario.nome}</strong>
                              <span>{usuario.email}</span>
                            </UserInfo>
                          </UserCell>
                        </td>
                        <td data-label="Perfil">
                          <TypeBadge $type={usuario.tipo}>{getTypeLabel(usuario.tipo)}</TypeBadge>
                        </td>
                        <td data-label="Criado por">{usuario.createdBy?.nome ?? '-'}</td>
                        <td data-label="Ações">
                          <RowActions>
                            <IconActionButton
                              type="button"
                              aria-label={`Editar usuario ${usuario.nome}`}
                              title="Editar usuario"
                              $variant="edit"
                              onClick={() => editUsuario(usuario)}
                            >
                              <EditIcon />
                            </IconActionButton>
                            <IconActionButton
                              type="button"
                              aria-label={`Remover usuario ${usuario.nome}`}
                              title="Remover usuario"
                              $variant="delete"
                              onClick={() => setDeleteTarget(usuario)}
                            >
                              <TrashIcon />
                            </IconActionButton>
                          </RowActions>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </TableWrapper>

            <Pagination>
              <PageButton type="button" disabled={page === 1} onClick={() => setPage(1)}>
                &laquo;
              </PageButton>
              <PageButton type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
                &lsaquo;
              </PageButton>
              {pages.map((item) => (
                <PageButton key={item} type="button" $active={item === page} onClick={() => setPage(item)}>
                  {item}
                </PageButton>
              ))}
              <PageButton
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                &rsaquo;
              </PageButton>
              <PageButton type="button" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
                &raquo;
              </PageButton>
            </Pagination>
          </TableSection>
        </WorkspaceGrid>
      </Content>

      {editingUser && (
        <UserModalBackdrop role="presentation" onClick={handleEditBackdropClick}>
          <UserModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            onSubmit={handleSubmit}
            onPointerDown={handleEditPointerDown}
            onPointerUp={handleEditPointerUp}
            onPointerCancel={() => {
              editDragStartYRef.current = null;
            }}
          >
            <UserModalHandle aria-hidden="true" />
            <ModalHeader>
              <div>
                <SectionCategory>Editar usuario</SectionCategory>
                <ModalTitle id="edit-user-title">{editingUser.nome}</ModalTitle>
              </div>
              <ModalCloseButton type="button" aria-label="Fechar edicao" onClick={closeEditModal}>
                x
              </ModalCloseButton>
            </ModalHeader>

            <ModalBody>
              <Field>
                Nome
                <Input value={form.nome} onChange={(event) => updateField('nome', event.target.value)} />
              </Field>

              <Field>
                E-mail
                <Input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
              </Field>

              <Field>
                Senha (opcional)
                <Input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                />
              </Field>

              <Field>
                CPF
                <Input value={form.cpf} onChange={(event) => updateField('cpf', event.target.value)} />
              </Field>

              <Field>
                Perfil
                <Select
                  value={form.tipo}
                  onChange={(event) => updateField('tipo', event.target.value as UsuarioTipo)}
                >
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario comum</option>
                  <option value="superAdmin">Super admin</option>
                </Select>
              </Field>

              <CheckboxRow>
                <input
                  type="checkbox"
                  checked={form.possuiCurriculo}
                  onChange={(event) => updateField('possuiCurriculo', event.target.checked)}
                />
                Possui curriculo
              </CheckboxRow>

              {message && <StateMessage $variant="success">{message}</StateMessage>}
              {errorMessage && <StateMessage $variant="error">{errorMessage}</StateMessage>}
            </ModalBody>

            <ModalActions>
              <Button type="button" $secondary onClick={closeEditModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar alteracoes'}
              </Button>
            </ModalActions>
          </UserModal>
        </UserModalBackdrop>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Remover usuário?"
          description={`Esta ação vai remover ${deleteTarget.nome}. Confirme apenas se este acesso nao deve mais existir.`}
          confirmLabel="Remover"
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </AdminLayout>
  );
}
