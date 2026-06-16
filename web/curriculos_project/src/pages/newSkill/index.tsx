import axios from 'axios';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { EditIcon, TrashIcon } from '../../components/ActionIcons';
import { ConfirmModal } from '../../components/ConfirmModal';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { UserLayout } from '../../components/UserLayout';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { addAtuacao, getMeuCurriculo, updateCurriculo } from '../../services/curriculos';
import type { CurriculoRelation } from '../../types/curriculo';
import { limitText, textLimits } from '../../utils/formLimits';
import {
  ActionButtons,
  BackButton,
  Brand,
  Copyright,
  EmptyState,
  ExistingItemActions,
  ExistingItemText,
  ExistingItem,
  ExistingList,
  Footer,
  FooterContent,
  FormGrid,
  Header,
  HeaderContent,
  HeaderNav,
  IconActionButton,
  InputGroup,
  LogoutButton,
  Main,
  NavLink,
  Section,
  SectionTitle,
  SubmitButton,
} from './styles';

export default function NewSkill() {
  const navigate = useNavigate();
  const { requestLogout } = useConfirmLogout();
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingItems, setExistingItems] = useState<CurriculoRelation[]>([]);
  const [curriculoId, setCurriculoId] = useState('');
  const [editingId, setEditingId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<CurriculoRelation | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadCurriculo() {
      try {
        const curriculo = await getMeuCurriculo();
        if (isCurrent) {
          setCurriculoId(curriculo?.id);
          setExistingItems(curriculo?.atuacoes ?? []);
        }
      } catch {
        if (isCurrent) {
          setCurriculoId('');
          setExistingItems([]);
        }
      }
    }

    loadCurriculo();

    return () => {
      isCurrent = false;
    };
  }, []);

  function handleLogout() {
    requestLogout();
  }

  function resetForm() {
    setNome('');
    setEditingId('');
  }

  function handleEdit(item: CurriculoRelation) {
    setNome(limitText(item.nome ?? '', textLimits.medium));
    setEditingId(item.id);
    setMessage('');
  }

  async function confirmDelete() {
    if (!curriculoId || !deleteTarget) {
      return;
    }

    try {
      setLoading(true);
      const curriculo = await updateCurriculo(curriculoId, {
        atuacoes: existingItems
          .filter((existingItem) => existingItem.id !== deleteTarget?.id)
          .map((existingItem) => ({
            nome: existingItem.nome ?? '',
            prioridade: existingItem.prioridade ?? null,
          })),
      });
      setExistingItems(curriculo?.atuacoes ?? []);
      if (editingId === deleteTarget?.id) {
        resetForm();
      }
      setDeleteTarget(null);
      setMessage('Habilidade removida com sucesso.');
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setMessage(error.response?.data?.message ?? error.response?.data?.error ?? 'Não foi possível remover.');
        return;
      }

      setMessage('Não foi possível remover. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!nome.trim()) {
      setMessage('Informe uma habilidade ou conhecimento.');
      return;
    }

    try {
      setLoading(true);
      const payload = { nome: nome.trim(), prioridade: null };

      if (editingId && curriculoId) {
        const curriculo = await updateCurriculo(curriculoId, {
          atuacoes: existingItems.map((item) => (item.id === editingId ? payload : {
            nome: item.nome ?? '',
            prioridade: item.prioridade ?? null,
          })),
        });
        setExistingItems(curriculo?.atuacoes ?? []);
        resetForm();
        setMessage('Habilidade atualizada com sucesso.');
        return;
      }

      const curriculo = await addAtuacao(payload);
      setExistingItems(curriculo?.atuacoes ?? []);
      resetForm();
      setMessage('Habilidade cadastrada com sucesso.');
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setMessage(error.response?.data?.message ?? error.response?.data?.error ?? 'Não foi possível cadastrar.');
        return;
      }

      setMessage('Não foi possível cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserLayout>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/profile')}>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/profile')}>Início</NavLink>
            <NavLink onClick={() => navigate('/vagas')}>Vagas</NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <Section>
          <SectionTitle>Cadastrar Habilidades</SectionTitle>
          {message && (
            <FeedbackMessage variant={message.toLowerCase().includes('sucesso') ? 'success' : 'error'}>
              {message}
            </FeedbackMessage>
          )}

          <ExistingList>
            {existingItems.length === 0 && <EmptyState>Nenhuma habilidade cadastrada.</EmptyState>}
            {existingItems.map((item) => (
              <ExistingItem key={item.id}>
                <ExistingItemText>{item.nome ?? 'Não informado'}</ExistingItemText>
                <ExistingItemActions>
                  <IconActionButton type="button" $variant="edit" onClick={() => handleEdit(item)} title="Editar">
                    <EditIcon />
                  </IconActionButton>
                  <IconActionButton type="button" $variant="delete" onClick={() => setDeleteTarget(item)} title="Excluir">
                    <TrashIcon />
                  </IconActionButton>
                </ExistingItemActions>
              </ExistingItem>
            ))}
          </ExistingList>

          <form onSubmit={handleSubmit}>
            <FormGrid>
              <InputGroup>
                <label>Habilidade/Conhecimento</label>
                <input
                  type="text"
                  placeholder="Habilidade ou conhecimento"
                  maxLength={textLimits.medium}
                  value={nome}
                  onChange={(event) => setNome(limitText(event.target.value, textLimits.medium))}
                />
              </InputGroup>
            </FormGrid>

            <ActionButtons>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Cadastrar Habilidade'}
              </SubmitButton>
              {editingId && (
                <BackButton type="button" onClick={resetForm}>
                  Cancelar
                </BackButton>
              )}
              <BackButton type="button" onClick={() => navigate('/profile')}>
                Voltar
              </BackButton>
            </ActionButtons>
          </form>
        </Section>
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/profile')}>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>
          <Copyright>Â© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>

      {deleteTarget && (
        <ConfirmModal
          title="Excluir habilidade?"
          description={`Esta ação vai remover "${deleteTarget?.nome || 'esta habilidade'}" do seu currículo.`}
          confirmLabel="Excluir"
          loading={loading}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </UserLayout>
  );
}
