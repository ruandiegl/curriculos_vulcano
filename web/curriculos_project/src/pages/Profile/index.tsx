import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { getMeuCurriculo } from '../../services/curriculos';
import type { Curriculo, CurriculoRelation } from '../../types/curriculo';
import {
  ActionLink,
  Brand,
  Card,
  CardDescription,
  CardTitle,
  Copyright,
  Footer,
  FooterContent,
  Header,
  HeaderContent,
  HeaderNav,
  InfoText,
  LogoutButton,
  Main,
  NavLink,
  Page,
  UserInfo,
} from './styles';

function formatEmpty(value?: string | null) {
  return value?.trim() || 'Nao informado';
}

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function renderRelations(items: CurriculoRelation[] | undefined, getLabel: (item: CurriculoRelation) => string) {
  if (!items?.length) {
    return null;
  }

  return (
    <UserInfo>
      {items.map((item) => (
        <InfoText key={item.id}>{getLabel(item)}</InfoText>
      ))}
    </UserInfo>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { requestLogout, logoutModal } = useConfirmLogout();
  const [curriculo, setCurriculo] = useState<Curriculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        const data = await getMeuCurriculo();
        if (mounted) {
          setCurriculo(data);
          setMessage('');
        }
      } catch {
        if (mounted) {
          setCurriculo(null);
          setMessage('Nao foi possivel carregar os dados do curriculo.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  function handleLogout() {
    requestLogout();
  }

  return (
    <Page>
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
        <Card>
          <CardTitle>Dados Pessoais</CardTitle>
          <CardDescription>
            {loading ? 'Carregando dados do curriculo...' : message || 'Confira os dados de seu curriculo'}
          </CardDescription>
          {curriculo && (
            <UserInfo>
              <InfoText>Nome: {formatEmpty(curriculo.nome)}</InfoText>
              <InfoText>Email: {formatEmpty(curriculo.email)}</InfoText>
              <InfoText>CPF: {formatEmpty(curriculo.cpf)}</InfoText>
              <InfoText>Celular: {formatEmpty(curriculo.celular)}</InfoText>
            </UserInfo>
          )}
          {curriculo && (
            <>
              <ActionLink onClick={() => navigate(`/view/${curriculo.id}`)}>Ver Curriculo &rarr;</ActionLink>
              <ActionLink onClick={() => navigate(`/edit/${curriculo.id}`)}>Alterar Curriculo &rarr;</ActionLink>
            </>
          )}
          {!loading && !curriculo && (
            <ActionLink onClick={() => navigate('/newCurriculum')}>Cadastrar curriculo &rarr;</ActionLink>
          )}
        </Card>

        <Card>
          <CardTitle>Curriculo em PDF</CardTitle>
          <CardDescription>
            {curriculo?.arquivos?.length
              ? `${curriculo.arquivos.length} arquivo(s) cadastrado(s)`
              : 'Nao ha curriculo em PDF cadastrado'}
          </CardDescription>
          {renderRelations(curriculo?.arquivos, (arquivo) => formatEmpty(arquivo.nomeOriginal ?? arquivo.nome))}
          <ActionLink onClick={() => navigate('/upload-pdf')}>Adicionar curriculo em PDF &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Formacoes Academicas</CardTitle>
          <CardDescription>
            {curriculo?.escolaridades?.length
              ? 'Formacoes cadastradas'
              : 'Nao ha formacoes academicas cadastradas'}
          </CardDescription>
          {renderRelations(curriculo?.escolaridades, (escolaridade) => {
            const period = [formatDate(escolaridade.dataInicio), formatDate(escolaridade.dataTermino)]
              .filter(Boolean)
              .join(' ate ');
            return [
              escolaridade.curso,
              escolaridade.escola,
              period,
            ].filter(Boolean).join(' - ') || 'Nao informado';
          })}
          <ActionLink onClick={() => navigate('/new-education')}>Adicionar formacao academica &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Experiencias Profissionais</CardTitle>
          <CardDescription>
            {curriculo?.experiencias?.length
              ? 'Experiencias cadastradas'
              : 'Nao ha experiencias profissionais cadastradas'}
          </CardDescription>
          {renderRelations(curriculo?.experiencias, (experiencia) =>
            [
              experiencia.empresa,
              experiencia.cargo,
              [formatDate(experiencia.dataInicio), formatDate(experiencia.dataTermino)].filter(Boolean).join(' ate '),
              experiencia.funcoes,
            ].filter(Boolean).join(' - ') || 'Nao informado',
          )}
          <ActionLink onClick={() => navigate('/new-experience')}>Adicionar experiencia profissional &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Habilidades e Conhecimentos</CardTitle>
          <CardDescription>
            {curriculo?.atuacoes?.length
              ? 'Habilidades cadastradas'
              : 'Nao ha habilidades e conhecimentos cadastrados'}
          </CardDescription>
          {renderRelations(curriculo?.atuacoes, (atuacao) => formatEmpty(atuacao.nome))}
          <ActionLink onClick={() => navigate('/new-skill')}>Adicionar habilidade ou conhecimento &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Cursos e Certificacoes</CardTitle>
          <CardDescription>
            {curriculo?.cursos?.length ? 'Cursos cadastrados' : 'Nao ha cursos ou certificacoes cadastrados'}
          </CardDescription>
          {renderRelations(curriculo?.cursos, (curso) =>
            [curso.nome, curso.instituicao, curso.cargaHoraria].filter(Boolean).join(' - ') || 'Nao informado',
          )}
          <ActionLink onClick={() => navigate('/new-certification')}>Adicionar curso ou certificacao &rarr;</ActionLink>
        </Card>
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/profile')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>
      {logoutModal}
    </Page>
  );
}
