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
import { addEscolaridade, getMeuCurriculo, updateCurriculo } from '../../services/curriculos';
import type { CurriculoRelation } from '../../types/curriculo';
import { MAX_DATE, MIN_DATE, isValidDateInput, limitText, normalizeDate, textLimits } from '../../utils/formLimits';
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

export default function NewEducation() {
  const navigate = useNavigate();
  const { requestLogout } = useConfirmLogout();
  const [curso, setCurso] = useState('');
  const [escola, setEscola] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
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
          setExistingItems(curriculo?.escolaridades ?? []);
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
    setCurso('');
    setEscola('');
    setDataInicio('');
    setDataTermino('');
    setEditingId('');
  }

  function handleEdit(item: CurriculoRelation) {
    setCurso(limitText(item.curso ?? '', textLimits.medium));
    setEscola(limitText(item.escola ?? '', textLimits.medium));
    setDataInicio(normalizeDate(item.dataInicio?.slice(0, 10) ?? ''));
    setDataTermino(normalizeDate(item.dataTermino?.slice(0, 10) ?? ''));
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
        escolaridades: existingItems
          .filter((existingItem) => existingItem.id !== deleteTarget?.id)
          .map((existingItem) => ({
            curso: existingItem.curso ?? null,
            escola: existingItem.escola ?? '',
            dataInicio: existingItem.dataInicio?.slice(0, 10) ?? null,
            dataTermino: existingItem.dataTermino?.slice(0, 10) ?? null,
          })),
      });
      setExistingItems(curriculo?.escolaridades ?? []);
      if (editingId === deleteTarget?.id) {
        resetForm();
      }
      setDeleteTarget(null);
      setMessage('Formação removida com sucesso.');
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

    if (!escola.trim()) {
      setMessage('Informe a escola ou formação.');
      return;
    }

    if (!isValidDateInput(dataInicio) || !isValidDateInput(dataTermino, { allowFuture: true })) {
      setMessage('Informe datas válidas entre 1900 e 2100.');
      return;
    }

    if (dataInicio && dataTermino && dataTermino < dataInicio) {
      setMessage('A data de término não pode ser anterior à data de início.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        curso: curso.trim() || null,
        escola: escola.trim(),
        dataInicio: dataInicio || null,
        dataTermino: dataTermino || null,
      };

      if (editingId && curriculoId) {
        const curriculo = await updateCurriculo(curriculoId, {
          escolaridades: existingItems.map((item) => (item.id === editingId ? payload : {
            curso: item.curso ?? null,
            escola: item.escola ?? '',
            dataInicio: item.dataInicio?.slice(0, 10) ?? null,
            dataTermino: item.dataTermino?.slice(0, 10) ?? null,
          })),
        });
        setExistingItems(curriculo?.escolaridades ?? []);
        resetForm();
        setMessage('Formação atualizada com sucesso.');
        return;
      }

      const curriculo = await addEscolaridade({ ...payload,
      });
      setExistingItems(curriculo?.escolaridades ?? []);
      resetForm();
      setMessage('Formação cadastrada com sucesso.');
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
          <SectionTitle>Cadastrar Formação Acadêmica</SectionTitle>
          {message && (
            <FeedbackMessage variant={message.toLowerCase().includes('sucesso') ? 'success' : 'error'}>
              {message}
            </FeedbackMessage>
          )}

          <ExistingList>
            {existingItems.length === 0 && <EmptyState>Nenhuma formação cadastrada.</EmptyState>}
            {existingItems.map((item) => (
              <ExistingItem key={item.id}>
                <ExistingItemText>
                  {[item.curso, item.escola, item.dataInicio?.slice(0, 10), item.dataTermino?.slice(0, 10)]
                    .filter(Boolean)
                    .join(' - ')}
                </ExistingItemText>
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
                <label>Curso</label>
                <input
                  type="text"
                  placeholder="Nome do Curso"
                  maxLength={textLimits.medium}
                  value={curso}
                  onChange={(event) => setCurso(limitText(event.target.value, textLimits.medium))}
                />
              </InputGroup>
              <InputGroup>
                <label>Escola/Formação</label>
                <input
                  type="text"
                  placeholder="Escola ou formação"
                  maxLength={textLimits.medium}
                  value={escola}
                  onChange={(event) => setEscola(limitText(event.target.value, textLimits.medium))}
                />
              </InputGroup>
              <InputGroup>
                <label>Data de Início</label>
                <input
                  type="date"
                  min={MIN_DATE}
                  max={new Date().toISOString().slice(0, 10)}
                  value={dataInicio}
                  onChange={(event) => setDataInicio(normalizeDate(event.target.value))}
                />
              </InputGroup>
              <InputGroup>
                <label>Data de Término</label>
                <input
                  type="date"
                  min={MIN_DATE}
                  max={MAX_DATE}
                  value={dataTermino}
                  onChange={(event) => setDataTermino(normalizeDate(event.target.value))}
                />
              </InputGroup>
            </FormGrid>

            <ActionButtons>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Cadastrar Formação'}
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
          title="Excluir formação?"
          description={`Esta ação vai remover "${deleteTarget?.curso || deleteTarget?.escola || 'esta formação'}" do seu currículo.`}
          confirmLabel="Excluir"
          loading={loading}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </UserLayout>
  );
}
