import axios from 'axios';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { UserLayout } from '../../components/UserLayout';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { PENDING_CURRICULUM_STORAGE_KEY, getMeuCurriculo, updateCurriculo } from '../../services/curriculos';
import { limitText, textLimits } from '../../utils/formLimits';
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

function limitAddressField(field: keyof FormState, value: string) {
  const limits: Record<keyof FormState, number> = {
    cep: textLimits.cep,
    rua: textLimits.medium,
    cidade: textLimits.short,
    numero: textLimits.number,
    bairro: textLimits.short,
    estado: textLimits.state,
    complemento: textLimits.medium,
  };

  const limited = limitText(value, limits[field]);
  return field === 'estado' ? limited.toUpperCase() : limited;
}

export default function NewAddress() {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestLogout } = useConfirmLogout();
  const state = location.state as LocationState | null;
  const initialCurriculoId = state?.curriculoId ?? sessionStorage.getItem(PENDING_CURRICULUM_STORAGE_KEY) ?? '';
  const [form, setForm] = useState<FormState>(initialForm);
  const [curriculoId, setCurriculoId] = useState(initialCurriculoId);
  const [loadingCurriculo, setLoadingCurriculo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [message, setMessage] = useState(
    initialCurriculoId ? '' : 'Crie os dados pessoais do currículo antes de informar o endereço.',
  );
  const messageVariant = message.toLowerCase().includes('sucesso')
    ? 'success'
    : message.toLowerCase().startsWith('crie')
      ? 'info'
      : 'error';

  useEffect(() => {
    let isCurrent = true;

    async function loadCurriculo() {
      try {
        setLoadingCurriculo(true);
        const curriculo = await getMeuCurriculo();
        const endereco = curriculo?.enderecos?.[0];

        if (!isCurrent) return;

        setCurriculoId(curriculo?.id);
        setForm({
          cep: limitAddressField('cep', endereco?.cep ?? ''),
          rua: limitAddressField('rua', endereco?.rua ?? ''),
          cidade: limitAddressField('cidade', endereco?.cidade ?? ''),
          numero: limitAddressField('numero', endereco?.numero ?? ''),
          bairro: limitAddressField('bairro', endereco?.bairro ?? ''),
          estado: limitAddressField('estado', endereco?.estado ?? ''),
          complemento: limitAddressField('complemento', endereco?.complemento ?? ''),
        });
        setMessage('');
      } catch {
        if (isCurrent && !initialCurriculoId) {
          setMessage('Crie os dados pessoais do currículo antes de informar o endereço.');
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
  }, [initialCurriculoId]);

  function handleLogout() {
    requestLogout();
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: limitAddressField(field, value) }));
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
        setMessage('CEP não encontrado. Preencha o endereço manualmente.');
        return;
      }

      setForm((current) => ({ ...current,
        rua: limitAddressField('rua', response.data.logradouro ?? current.rua),
        bairro: limitAddressField('bairro', response.data.bairro ?? current.bairro),
        cidade: limitAddressField('cidade', response.data.localidade ?? current.cidade),
        estado: limitAddressField('estado', response.data.uf ?? current.estado),
        complemento: limitAddressField('complemento', response.data.complemento || current.complemento),
      }));
    } catch {
      setMessage('Não foi possível buscar o CEP. Preencha o endereço manualmente.');
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
      setMessage('Não encontrei o curriculo iniciado. Volte e preencha os dados pessoais novamente.');
      return;
    }

    if (!form.rua.trim() || !form.cidade.trim() || !form.estado.trim()) {
      setMessage('Informe logradouro, cidade e estado para continuar.');
      return;
    }

    try {
      setLoading(true);
      await updateCurriculo(curriculoId, {
        enderecos: [
          {
            rua: nullable(form.rua),
            numero: nullable(form.numero),
            cep: nullable(form.cep),
            complemento: nullable(form.complemento),
            bairro: nullable(form.bairro),
            cidade: nullable(form.cidade),
            estado: nullable(form.estado),
          },
        ],
      });

      sessionStorage.removeItem(PENDING_CURRICULUM_STORAGE_KEY);
      setMessage('Endereço atualizado com sucesso.');
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Não foi possível salvar o endereço.',
        );
        return;
      }

      setMessage('Não foi possível salvar o endereço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserLayout>
      <Header>
        <HeaderContent>
          <Brand onClick={() => navigate('/')}>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/')}>Início</NavLink>
            <NavLink onClick={() => navigate('/vagas')}>Vagas</NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <Greeting>
          <p>{curriculoId ? 'Atualize seu endereço cadastrado.' : 'Informe seu endereço para continuar.'}</p>
        </Greeting>

        <Section>
          <SectionTitle>Endereço</SectionTitle>
          {message && <FeedbackMessage variant={messageVariant}>{message}</FeedbackMessage>}

          <form onSubmit={handleSubmit}>
            <Grid>
              <Field>
                <Label>CEP</Label>
                <Input
                  type="text"
                  placeholder="CEP"
                  maxLength={textLimits.cep}
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
                  maxLength={textLimits.medium}
                  value={form.rua}
                  onChange={(e) => updateField('rua', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Cidade</Label>
                <Input
                  type="text"
                  placeholder="Cidade"
                  maxLength={textLimits.short}
                  value={form.cidade}
                  onChange={(e) => updateField('cidade', e.target.value)}
                />
              </Field>

              <Field>
                <Label>Número</Label>
                <Input
                  type="text"
                  placeholder="Número"
                  maxLength={textLimits.number}
                  value={form.numero}
                  onChange={(e) => updateField('numero', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Bairro</Label>
                <Input
                  type="text"
                  placeholder="Bairro"
                  maxLength={textLimits.short}
                  value={form.bairro}
                  onChange={(e) => updateField('bairro', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Estado</Label>
                <Input
                  type="text"
                  placeholder="Estado"
                  maxLength={textLimits.state}
                  value={form.estado}
                  onChange={(e) => updateField('estado', e.target.value)}
                />
              </Field>

              <Field>
                <Label>Complemento</Label>
                <Input
                  type="text"
                  placeholder="Complemento"
                  maxLength={textLimits.medium}
                  value={form.complemento}
                  onChange={(e) => updateField('complemento', e.target.value)}
                />
              </Field>
            </Grid>

            <ActionButtons>
              <SubmitButton type="submit" disabled={loading || loadingCep || loadingCurriculo || !curriculoId}>
                {loading ? 'Salvando...' : loadingCep ? 'Buscando CEP...' : curriculoId ? 'Salvar Alterações' : 'Continuar'}
              </SubmitButton>
            </ActionButtons>
          </form>
        </Section>
      </Main>

      <Footer>
        <FooterContent>
          <Brand onClick={() => navigate('/')}>
            <img src={logo} alt="Metalúrgica Vulcano" />
          </Brand>
          <Copyright>Â© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>
    </UserLayout>
  );
}
