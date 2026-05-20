import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import { PENDING_CURRICULUM_STORAGE_KEY, updateCurriculo } from '../../services/curriculos';
import {
  ActionButtons,
  Brand,
  Copyright,
  Field,
  Footer,
  FooterContent,
  Grid,
  Greeting,
  Header,
  HeaderContent,
  HeaderNav,
  Input,
  Label,
  LogoutButton,
  Main,
  NavLink,
  Page,
  Section,
  SectionTitle,
  SubmitButton,
} from './styles';

type LocationState = {
  curriculoId?: string;
};

type FormState = {
  cep: string;
  rua: string;
  cidade: string;
  numero: string;
  bairro: string;
  estado: string;
  complemento: string;
};

type ViaCepResponse = {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  complemento?: string;
};

const initialForm: FormState = {
  cep: '',
  rua: '',
  cidade: '',
  numero: '',
  bairro: '',
  estado: '',
  complemento: '',
};

function nullable(value: string) {
  return value.trim() || null;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function formatCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export default function NewAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const state = location.state as LocationState | null;
  const initialCurriculoId = state?.curriculoId ?? sessionStorage.getItem(PENDING_CURRICULUM_STORAGE_KEY) ?? '';
  const [form, setForm] = useState<FormState>(initialForm);
  const [curriculoId] = useState(initialCurriculoId);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [message, setMessage] = useState(
    initialCurriculoId ? '' : 'Crie os dados pessoais do curriculo antes de informar o endereco.',
  );

  function handleLogout() {
    signOut();
    navigate('/');
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function fetchAddressByCep(cep: string) {
    const digits = onlyDigits(cep);

    if (digits.length !== 8) {
      return;
    }

    try {
      setLoadingCep(true);
      setMessage('');

      const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${digits}/json/`);

      if (response.data.erro) {
        setMessage('CEP nao encontrado. Preencha o endereco manualmente.');
        return;
      }

      setForm((current) => ({
        ...current,
        rua: response.data.logradouro ?? current.rua,
        bairro: response.data.bairro ?? current.bairro,
        cidade: response.data.localidade ?? current.cidade,
        estado: response.data.uf ?? current.estado,
        complemento: response.data.complemento || current.complemento,
      }));
    } catch {
      setMessage('Nao foi possivel buscar o CEP. Preencha o endereco manualmente.');
    } finally {
      setLoadingCep(false);
    }
  }

  function handleCepChange(value: string) {
    const cep = formatCep(value);
    updateField('cep', cep);

    if (onlyDigits(cep).length === 8) {
      fetchAddressByCep(cep);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!curriculoId) {
      setMessage('Nao encontrei o curriculo iniciado. Volte e preencha os dados pessoais novamente.');
      return;
    }

    if (!form.rua.trim() || !form.cidade.trim() || !form.estado.trim()) {
      setMessage('Informe logradouro, cidade e estado para continuar.');
      return;
    }

    try {
      setLoading(true);
      const updated = await updateCurriculo(curriculoId, {
        enderecos: [
          {
            rua: nullable(form.rua),
            numero: nullable(form.numero),
            complemento: nullable(form.complemento),
            bairro: nullable(form.bairro),
            cidade: nullable(form.cidade),
            estado: nullable(form.estado),
          },
        ],
      });

      sessionStorage.removeItem(PENDING_CURRICULUM_STORAGE_KEY);
      navigate(`/view/${updated.id}`);
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Nao foi possivel salvar o endereco.',
        );
        return;
      }

      setMessage('Nao foi possivel salvar o endereco. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/')}>Inicio</NavLink>
            <NavLink onClick={() => {}}>Vagas</NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <Greeting>
          <p>Perfeito, agora vamos precisar de seu endereco:</p>
        </Greeting>

        <Section>
          <SectionTitle>Endereco</SectionTitle>
          {message && <Label>{message}</Label>}

          <form onSubmit={handleSubmit}>
            <Grid>
              <Field>
                <Label>CEP</Label>
                <Input
                  type="text"
                  placeholder="CEP"
                  value={form.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  onBlur={(e) => fetchAddressByCep(e.target.value)}
                />
              </Field>
              <Field>
                <Label>Logradouro</Label>
                <Input
                  type="text"
                  placeholder="Logradouro"
                  value={form.rua}
                  onChange={(e) => updateField('rua', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Cidade</Label>
                <Input
                  type="text"
                  placeholder="Cidade"
                  value={form.cidade}
                  onChange={(e) => updateField('cidade', e.target.value)}
                />
              </Field>

              <Field>
                <Label>Numero</Label>
                <Input
                  type="text"
                  placeholder="Numero"
                  value={form.numero}
                  onChange={(e) => updateField('numero', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Bairro</Label>
                <Input
                  type="text"
                  placeholder="Bairro"
                  value={form.bairro}
                  onChange={(e) => updateField('bairro', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Estado</Label>
                <Input
                  type="text"
                  placeholder="Estado"
                  value={form.estado}
                  onChange={(e) => updateField('estado', e.target.value)}
                />
              </Field>

              <Field>
                <Label>Complemento</Label>
                <Input
                  type="text"
                  placeholder="Complemento"
                  value={form.complemento}
                  onChange={(e) => updateField('complemento', e.target.value)}
                />
              </Field>
            </Grid>

            <ActionButtons>
              <SubmitButton type="submit" onClick={() => handleSubmit} disabled={loading || loadingCep || !curriculoId}>
                {loading ? 'Salvando...' : loadingCep ? 'Buscando CEP...' : 'Continuar'}
              </SubmitButton>
            </ActionButtons>
          </form>
        </Section>
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2023 Multi Publicidade</Copyright>
        </FooterContent>
      </Footer>
    </Page>
  );
}
