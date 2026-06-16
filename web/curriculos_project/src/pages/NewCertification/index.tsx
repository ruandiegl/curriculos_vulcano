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
import { addCurso, getMeuCurriculo, updateCurriculo } from '../../services/curriculos';
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

export default function NewCertification() {
  const navigate = useNavigate();
  const { requestLogout } = useConfirmLogout();
  const [nome, setNome] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
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
          setCurriculoId(curriculo.id);
          setExistingItems(curriculo.cursos ?? []);
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
    setInstituicao('');
    setCargaHoraria('');
    setEditingId('');
  }

  function handleEdit(item: CurriculoRelation) {
    setNome(limitText(item.nome ?? '', textLimits.medium));
    setInstituicao(limitText(item.instituicao ?? '', textLimits.medium));
    setCargaHoraria(limitText(item.cargaHoraria ?? '', textLimits.short));
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
        cursos: existingItems
          .filter((existingItem) => existingItem.id !== deleteTarget.id)
          .map((existingItem) => ({
            nome: existingItem.nome ?? '',
            instituicao: existingItem.instituicao ?? null,
            cargaHoraria: existingItem.cargaHoraria ?? null,
          })),
      });
      setExistingItems(curriculo.cursos ?? []);
      if (editingId === deleteTarget.id) {
        resetForm();
      }
      setDeleteTarget(null);
      setMessage('Curso ou certificado removido com sucesso.');
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setMessage(error.response?.data?.message ?? error.response?.data?.error ?? 'Nao foi possivel remover.');
        return;
      }

      setMessage('Nao foi possivel remover. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!nome.trim()) {
      setMessage('Informe o nome do curso ou certificado.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        nome: nome.trim(),
        instituicao: instituicao.trim() || null,
        cargaHoraria: cargaHoraria.trim() || null,
      };

      if (editingId && curriculoId) {
        const curriculo = await updateCurriculo(curriculoId, {
          cursos: existingItems.map((item) => (item.id === editingId ? payload : {
            nome: item.nome ?? '',
            instituicao: item.instituicao ?? null,
            cargaHoraria: item.cargaHoraria ?? null,
          })),
        });
        setExistingItems(curriculo.cursos ?? []);
        resetForm();
        setMessage('Curso ou certificado atualizado com sucesso.');
        return;
      }

      const curriculo = await addCurso({
        ...payload,
      });
      setExistingItems(curriculo.cursos ?? []);
      resetForm();
      setMessage('Curso ou certificado cadastrado com sucesso.');
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setMessage(error.response?.data?.message ?? error.response?.data?.error ?? 'Nao foi possivel cadastrar.');
        return;
      }

      setMessage('Nao foi possivel cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserLayout>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/profile')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/profile')}>Inicio</NavLink>
            <NavLink onClick={() => navigate('/vagas')}>Vagas</NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <Section>
          <SectionTitle>Cadastrar Cursos/Certificados</SectionTitle>
          {message && (
            <FeedbackMessage variant={message.toLowerCase().includes('sucesso') ? 'success' : 'error'}>
              {message}
            </FeedbackMessage>
          )}

          <ExistingList>
            {existingItems.length === 0 && <EmptyState>Nenhum curso ou certificado cadastrado.</EmptyState>}
            {existingItems.map((item) => (
              <ExistingItem key={item.id}>
                <ExistingItemText>
                  {[item.nome, item.instituicao, item.cargaHoraria].filter(Boolean).join(' - ')}
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
                <label>Curso/Certificado</label>
                <input
                  type="text"
                  placeholder="Nome do Curso ou Certificado"
                  maxLength={textLimits.medium}
                  value={nome}
                  onChange={(event) => setNome(limitText(event.target.value, textLimits.medium))}
                />
              </InputGroup>
              <InputGroup>
                <label>Instituicao</label>
                <input
                  type="text"
                  placeholder="Instituicao"
                  maxLength={textLimits.medium}
                  value={instituicao}
                  onChange={(event) => setInstituicao(limitText(event.target.value, textLimits.medium))}
                />
              </InputGroup>
              <InputGroup>
                <label>Carga Horaria</label>
                <input
                  type="text"
                  placeholder="Carga Horaria"
                  maxLength={textLimits.short}
                  value={cargaHoraria}
                  onChange={(event) => setCargaHoraria(limitText(event.target.value, textLimits.short))}
                />
              </InputGroup>
            </FormGrid>

            <ActionButtons>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Salvando...' : editingId ? 'Salvar Alteracoes' : 'Cadastrar Curso/Certificado'}
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
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>

      {deleteTarget && (
        <ConfirmModal
          title="Excluir curso ou certificado?"
          description={`Esta acao vai remover "${deleteTarget.nome || deleteTarget.instituicao || 'este item'}" do seu curriculo.`}
          confirmLabel="Excluir"
          loading={loading}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </UserLayout>
  );
}
