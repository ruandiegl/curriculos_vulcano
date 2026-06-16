import axios from 'axios';
import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { ConfirmModal } from '../../components/ConfirmModal';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { UserLayout } from '../../components/UserLayout';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import {
  deleteCurriculoArquivo,
  downloadCurriculoArquivo,
  getMeuCurriculo,
  uploadCurriculoArquivo,
} from '../../services/curriculos';
import type { CurriculoRelation } from '../../types/curriculo';
import {
  ActionButtons,
  BackButton,
  Brand,
  Copyright,
  FileInputContainer,
  FileList,
  FileListActions,
  FileListButton,
  FileListEmpty,
  FileListItem,
  FileListMeta,
  FileListName,
  Footer,
  FooterContent,
  Greeting,
  Header,
  HeaderContent,
  HeaderNav,
  LogoutButton,
  Main,
  NavLink,
  Section,
  SectionTitle,
  SubmitButton,
} from './styles';

export default function UploadPDF() {
  const navigate = useNavigate();
  const { requestLogout } = useConfirmLogout();
  const [curriculoId, setCurriculoId] = useState('');
  const [arquivos, setArquivos] = useState<CurriculoRelation[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [loadingCurriculo, setLoadingCurriculo] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<CurriculoRelation | null>(null);
  const [confirmReplaceOpen, setConfirmReplaceOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadCurriculo() {
      try {
        setLoadingCurriculo(true);
        const curriculo = await getMeuCurriculo();

        if (isCurrent) {
          setCurriculoId(curriculo.id);
          setArquivos(curriculo.arquivos ?? []);
          setMessage('');
        }
      } catch {
        if (isCurrent) {
          setCurriculoId('');
          setArquivos([]);
          setMessage('');
        }
      } finally {
        if (isCurrent) {
          setLoadingCurriculo(false);
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

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setMessage('');
    setSuccessMessage('');
    setSelectedFile(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setSuccessMessage('');

    if (!curriculoId) {
      setMessage('Cadastre seu curriculo antes de enviar o PDF.');
      return;
    }

    if (!selectedFile) {
      setMessage('Selecione um arquivo PDF para enviar.');
      return;
    }

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setMessage('Selecione um arquivo no formato PDF.');
      return;
    }

    if (arquivos.length > 0) {
      setConfirmReplaceOpen(true);
      return;
    }

    await uploadSelectedFile();
  }

  async function uploadSelectedFile() {
    if (!curriculoId || !selectedFile) {
      return;
    }

    try {
      setUploading(true);
      setConfirmReplaceOpen(false);
      const arquivo = await uploadCurriculoArquivo(curriculoId, selectedFile);
      setArquivos([arquivo]);
      setSelectedFile(null);
      setFileInputKey((current) => current + 1);
      setSuccessMessage(arquivos.length > 0 ? 'Curriculo em PDF substituido com sucesso.' : 'Curriculo em PDF enviado com sucesso.');
    } catch (error) {
      setMessage(getErrorMessage(error, 'Nao foi possivel enviar o curriculo em PDF.'));
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(arquivo: CurriculoRelation) {
    if (!curriculoId || !arquivo.id) {
      return;
    }

    try {
      setDownloadingId(arquivo.id);
      setMessage('');
      setSuccessMessage('');
      const blob = await downloadCurriculoArquivo(curriculoId, arquivo.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = arquivo.nomeOriginal ?? arquivo.nome ?? 'curriculo.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage(getErrorMessage(error, 'Nao foi possivel baixar este curriculo.'));
    } finally {
      setDownloadingId('');
    }
  }

  async function handleDelete() {
    if (!curriculoId || !deleteTarget?.id) {
      return;
    }

    try {
      setDeletingId(deleteTarget.id);
      setMessage('');
      setSuccessMessage('');
      await deleteCurriculoArquivo(curriculoId, deleteTarget.id);
      setDeleteTarget(null);
      setArquivos([]);
      setSuccessMessage('Curriculo em PDF excluido com sucesso.');
    } catch (error) {
      setMessage(getErrorMessage(error, 'Nao foi possivel excluir este curriculo.'));
    } finally {
      setDeletingId('');
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
        <Greeting>
          <p>Prezado, Faça upload de seu currículo em PDF:</p>
        </Greeting>

        <Section>
          <SectionTitle>Cadastrar Currículo</SectionTitle>
          
          {message && <FeedbackMessage>{message}</FeedbackMessage>}
          {successMessage && <FeedbackMessage variant="success">{successMessage}</FeedbackMessage>}

          <form onSubmit={handleSubmit}>
            <FileInputContainer>
              <input
                key={fileInputKey}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                disabled={loadingCurriculo || uploading}
              />
            </FileInputContainer>

            <ActionButtons>
              <SubmitButton type="submit" disabled={loadingCurriculo || uploading || !curriculoId}>
                {loadingCurriculo ? 'Carregando...' : uploading ? 'Enviando...' : 'Enviar'}
              </SubmitButton>
              <BackButton type="button" onClick={() => navigate('/profile')}>
                Voltar
              </BackButton>
            </ActionButtons>
          </form>

          <FileList aria-label="Curriculos enviados">
            {arquivos.length === 0 && (
              <FileListEmpty>Nenhum curriculo em PDF enviado.</FileListEmpty>
            )}

            {arquivos.map((arquivo) => (
              <FileListItem key={arquivo.id}>
                <div>
                  <FileListName>{arquivo.nomeOriginal ?? arquivo.nome ?? 'curriculo.pdf'}</FileListName>
                  {arquivo.createdAt && (
                    <FileListMeta>Enviado em {new Date(arquivo.createdAt).toLocaleDateString('pt-BR')}</FileListMeta>
                  )}
                </div>

                <FileListActions>
                  <FileListButton
                    type="button"
                    disabled={downloadingId === arquivo.id}
                    onClick={() => handleDownload(arquivo)}
                  >
                    {downloadingId === arquivo.id ? 'Baixando...' : 'Baixar'}
                  </FileListButton>
                  <FileListButton
                    type="button"
                    $danger
                    disabled={Boolean(deletingId)}
                    onClick={() => setDeleteTarget(arquivo)}
                  >
                    Excluir
                  </FileListButton>
                </FileListActions>
              </FileListItem>
            ))}
          </FileList>
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
      {confirmReplaceOpen && (
        <ConfirmModal
          title="Substituir curriculo em PDF?"
          description="Voce ja possui um curriculo em PDF enviado. Ao confirmar, o arquivo atual sera substituido pelo novo."
          confirmLabel="Substituir"
          cancelLabel="Cancelar"
          loadingLabel="Substituindo..."
          tone="default"
          loading={uploading}
          onCancel={() => setConfirmReplaceOpen(false)}
          onConfirm={uploadSelectedFile}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Excluir curriculo em PDF?"
          description={`Esta acao ira remover o arquivo ${deleteTarget.nomeOriginal ?? deleteTarget.nome ?? 'selecionado'}.`}
          confirmLabel="Excluir"
          loading={deletingId === deleteTarget.id}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </UserLayout>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? fallback;
  }

  return fallback;
}
