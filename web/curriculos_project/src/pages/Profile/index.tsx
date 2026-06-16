import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { UserLayout } from '../../components/UserLayout';
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
  UserInfo,
} from './styles';

function formatEmpty(value?: string | null) {
  return value?.trim() || 'Não informado';
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
  const { requestLogout } = useConfirmLogout();
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
          setMessage('Não foi possível carregar os dados do currículo.');
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
        <Card>
          <CardTitle>Dados Pessoais</CardTitle>
          <CardDescription>
            {loading ? 'Carregando dados do currículo...' : message || 'Confira os dados de seu currículo'}
          </CardDescription>
          {curriculo && (
            <UserInfo>
              <InfoText>Nome: {formatEmpty(curriculo?.nome)}</InfoText>
              <InfoText>Email: {formatEmpty(curriculo?.email)}</InfoText>
              <InfoText>CPF: {formatEmpty(curriculo?.cpf)}</InfoText>
              <InfoText>Celular: {formatEmpty(curriculo?.celular)}</InfoText>
            </UserInfo>
          )}
          {curriculo && (
            <>
              <ActionLink onClick={() => navigate(`/view/${curriculo?.id}`)}>Ver Currículo &rarr;</ActionLink>
              <ActionLink onClick={() => navigate(`/edit/${curriculo?.id}`)}>Alterar Currículo &rarr;</ActionLink>
            </>
          )}
          {!loading && !curriculo && (
            <ActionLink onClick={() => navigate('/newCurriculum')}>Cadastrar currículo &rarr;</ActionLink>
          )}
        </Card>

        <Card>
          <CardTitle>Currículo em PDF</CardTitle>
          <CardDescription>
            {curriculo?.arquivos?.length
              ? `${curriculo?.arquivos.length} arquivo(s) cadastrado(s)`
              : 'Não há currículo em PDF cadastrado'}
          </CardDescription>
          {renderRelations(curriculo?.arquivos, (arquivo) => formatEmpty(arquivo?.nomeOriginal ?? arquivo?.nome))}
          <ActionLink onClick={() => navigate('/upload-pdf')}>Adicionar currículo em PDF &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Formações Acadêmicas</CardTitle>
          <CardDescription>
            {curriculo?.escolaridades?.length
              ? 'Formações cadastradas'
              : 'Não há formações acadêmicas cadastradas'}
          </CardDescription>
          {renderRelations(curriculo?.escolaridades, (escolaridade) => {
            const period = [formatDate(escolaridade.dataInicio), formatDate(escolaridade.dataTermino)]
              .filter(Boolean)
              .join(' ate ');
            return [
              escolaridade.curso,
              escolaridade.escola,
              period,
            ].filter(Boolean).join(' - ') || 'Não informado';
          })}
          <ActionLink onClick={() => navigate('/new-education')}>Adicionar formação acadêmica &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Experiências Profissionais</CardTitle>
          <CardDescription>
            {curriculo?.experiencias?.length
              ? 'Experiências cadastradas'
              : 'Não há experiências profissionais cadastradas'}
          </CardDescription>
          {renderRelations(curriculo?.experiencias, (experiencia) =>
            [
              experiencia.empresa,
              experiencia.cargo,
              [formatDate(experiencia.dataInicio), formatDate(experiencia.dataTermino)].filter(Boolean).join(' ate '),
              experiencia.funcoes,
            ].filter(Boolean).join(' - ') || 'Não informado',
          )}
          <ActionLink onClick={() => navigate('/new-experience')}>Adicionar experiência profissional &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Habilidades e Conhecimentos</CardTitle>
          <CardDescription>
            {curriculo?.atuacoes?.length
              ? 'Habilidades cadastradas'
              : 'Não há habilidades e conhecimentos cadastrados'}
          </CardDescription>
          {renderRelations(curriculo?.atuacoes, (atuacao) => formatEmpty(atuacao.nome))}
          <ActionLink onClick={() => navigate('/new-skill')}>Adicionar habilidade ou conhecimento &rarr;</ActionLink>
        </Card>

        <Card>
          <CardTitle>Cursos e Certificações</CardTitle>
          <CardDescription>
            {curriculo?.cursos?.length ? 'Cursos cadastrados' : 'Não há cursos ou certificações cadastrados'}
          </CardDescription>
          {renderRelations(curriculo?.cursos, (curso) =>
            [curso.nome, curso.instituicao, curso.cargaHoraria].filter(Boolean).join(' - ') || 'Não informado',
          )}
          <ActionLink onClick={() => navigate('/new-certification')}>Adicionar curso ou certificação &rarr;</ActionLink>
        </Card>
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/profile')}>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>
          <Copyright>Â© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>
    </UserLayout>
  );
}
