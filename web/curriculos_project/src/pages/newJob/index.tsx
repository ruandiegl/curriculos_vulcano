import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { ConfirmModal } from '../../components/ConfirmModal';
import {
  ActionButton,
  ActionButtons,
  Brand,
  CloseButton,
  Copyright,
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
  SectionTitleWrapper,
  SubmitButton,
  Table,
  TableSection,
  TableWrapper,
  TextArea,
} from './styles';

interface Job {
  id: number;
  title: string;
  area: string;
  count: number;
  candidates: number;
}

const initialJobs: Job[] = [
  { id: 1, title: 'Desenvolvedor Frontend', area: 'TI', count: 2, candidates: 15 },
  { id: 2, title: 'Analista de RH', area: 'Recursos Humanos', count: 1, candidates: 8 },
];

export default function NewJob() {
  const navigate = useNavigate();
  const { requestLogout, logoutModal } = useConfirmLogout();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [count, setCount] = useState('');
  const [description, setDescription] = useState('');

  function handleLogout() {
    requestLogout();
  }

  function confirmDeleteJob() {
    if (deleteTarget) {
      setJobs(jobs.filter((job) => job.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }

  function handleRegisterJob() {
    if (!title || !area || !count) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const newJob: Job = {
      id: Date.now(),
      title,
      area,
      count: Number(count),
      candidates: 0
    };

    setJobs([...jobs, newJob]);
    setShowForm(false);
    resetForm();
  }

  function resetForm() {
    setTitle('');
    setArea('');
    setCount('');
    setDescription('');
  }

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/dashboard')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/dashboard')}>Gerenciar Currículos</NavLink>
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

        <TableSection>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <th>Vaga</th>
                  <th>N. de vagas</th>
                  <th>Atuação</th>
                  <th>Candidatos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.count}</td>
                    <td>{job.area}</td>
                    <td>{job.candidates}</td>
                    <td>
                      <ActionButtons>
                        <ActionButton onClick={() => setDeleteTarget(job)}>Excluir</ActionButton>
                        <ActionButton onClick={() => {}}>Editar</ActionButton>
                      </ActionButtons>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </TableSection>

        {!showForm && (
          <OpenFormButton onClick={() => setShowForm(true)}>
            Cadastrar Vaga
          </OpenFormButton>
        )}

        {showForm && (
          <FormSection>
            <FormGrid>
              <Field>
                <Label>Nome da Vaga</Label>
                <Input 
                  placeholder="Nome da vaga" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <Field>
                <Label>Área de Atuação</Label>
                <Input 
                  placeholder="Área de atuação" 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </Field>
              <Field>
                <Label>Número de vagas</Label>
                <Input 
                  placeholder="Número de vagas" 
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                />
              </Field>
              <Field $fullWidth>
                <Label>Descrição da vaga</Label>
                <TextArea 
                  placeholder="Descrição da vaga" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field>
            </FormGrid>

            <FormActionButtons>
              <SubmitButton onClick={handleRegisterJob}>
                Cadastrar Vaga
              </SubmitButton>
              <CloseButton onClick={() => setShowForm(false)}>
                Fechar
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
          <Copyright>© 2023 Multi Publicidade</Copyright>
        </FooterContent>
      </Footer>

      {deleteTarget && (
        <ConfirmModal
          title="Excluir vaga?"
          description={`Esta acao vai remover a vaga "${deleteTarget.title}". Depois de confirmar, nao sera possivel desfazer.`}
          confirmLabel="Excluir"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteJob}
        />
      )}
      {logoutModal}
    </Page>
  );
}
