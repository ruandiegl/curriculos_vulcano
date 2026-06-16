import axios from 'axios';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { AdminLayout } from '../../components/AdminLayout';
import { UserLayout } from '../../components/UserLayout';
import { useConfirmLogout } from '../../hooks/useConfirmLogout';
import { ConfirmModal } from '../../components/ConfirmModal';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { useAuth } from '../../hooks/useAuth';
import { getCurriculo, updateCurriculo } from '../../services/curriculos';
import type { Curriculo, CurriculoStatus } from '../../types/curriculo';
import { isAtLeastAge } from '../../utils/date';
import { MIN_DATE, isValidDateInput, limitText, normalizeDate, textLimits } from '../../utils/formLimits';
import { formatCnh, formatCpf, formatPhone, formatRg, onlyDigits } from '../../utils/masks';
import { statusLabels } from '../../utils/status';
import {
  ActionButtons,
  Brand,
  Copyright,
  Field,
  FieldsetTitle,
  Footer,
  FooterContent,
  Grid,
  Header,
  HeaderContent,
  HeaderNav,
  Input,
  Label,
  LogoutButton,
  Main,
  NavLink,
  ReturnButton,
  Section,
  SectionTitle,
  Select,
  SubmitButton,
} from './styles';

type FormState = {
  nome: string;
  celular: string;
  nascimento: string;
  estadoCivil: string;
  rg: string;
  telefone: string;
  cpf: string;
  cursoAtivo: string;
  possuiCnh: string;
  numeroCnh: string;
  vencimentoCnh: string;
  categoriaCnh: string;
  status: CurriculoStatus;
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

function nullable(value: string) {
  return value.trim() || null;
}

function formatCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function limitEditField<K extends keyof FormState>(field: K, value: FormState[K]) {
  const textValue = String(value);
  const limits: Partial<Record<keyof FormState, number>> = {
    nome: textLimits.medium,
    celular: textLimits.phone,
    telefone: textLimits.phone,
    rg: textLimits.rg,
    cpf: textLimits.cpf,
    numeroCnh: textLimits.cnh,
    categoriaCnh: 2,
    cep: textLimits.cep,
    rua: textLimits.medium,
    cidade: textLimits.short,
    numero: textLimits.number,
    bairro: textLimits.short,
    estado: textLimits.state,
    complemento: textLimits.medium,
  };

  if (field === 'nascimento' || field === 'vencimentoCnh') {
    return normalizeDate(textValue) as FormState[K];
  }

  const limited = limitText(textValue, limits[field] ?? textLimits.medium);
  return (field === 'estado' || field === 'categoriaCnh' ? limited.toUpperCase() : limited) as FormState[K];
}

function formFromCurriculo(curriculo: Curriculo): FormState {
  const endereco = curriculo.enderecos?.[0];

  return {
    nome: limitEditField('nome', curriculo.nome ?? ''),
    celular: formatPhone(curriculo.celular),
    nascimento: normalizeDate(curriculo.nascimento?.slice(0, 10) ?? ''),
    estadoCivil: curriculo.estadoCivil ?? '',
    rg: formatRg(curriculo.rg),
    telefone: formatPhone(curriculo.telefone),
    cpf: formatCpf(curriculo.cpf),
    cursoAtivo: curriculo.cursoAtivo ? 'Sim' : 'Nao',
    possuiCnh: curriculo.possuiCnh ? 'Sim' : 'Nao',
    numeroCnh: formatCnh(curriculo.numeroCnh),
    vencimentoCnh: normalizeDate(curriculo.vencimentoCnh?.slice(0, 10) ?? ''),
    categoriaCnh: limitEditField('categoriaCnh', curriculo.categoriaCnh ?? ''),
    status: curriculo.status,
    cep: '',
    rua: limitEditField('rua', endereco?.rua ?? ''),
    cidade: limitEditField('cidade', endereco?.cidade ?? ''),
    numero: limitEditField('numero', endereco?.numero ?? ''),
    bairro: limitEditField('bairro', endereco?.bairro ?? ''),
    estado: limitEditField('estado', endereco?.estado ?? ''),
    complemento: limitEditField('complemento', endereco?.complemento ?? ''),
  };
}

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requestLogout, logoutModal } = useConfirmLogout();
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadCurriculo() {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setMessage('');
        const curriculo = await getCurriculo(id);
        setForm(formFromCurriculo(curriculo));
      } catch {
        setMessage('Nao foi possivel carregar este curriculo.');
      } finally {
        setLoading(false);
      }
    }

    loadCurriculo();
  }, [id]);

  function handleLogout() {
    requestLogout();
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => (current ? { ...current, [field]: limitEditField(field, value) } : current));
  }

  async function fetchAddressByCep(cep: string) {
    const digits = onlyDigits(cep);

    if (digits.length !== 8) {
      return;
    }

    try {
      setMessage('');
      const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${digits}/json/`);

      if (response.data.erro) {
        setMessage('CEP nao encontrado. Preencha o endereco manualmente.');
        return;
      }

      setForm((current) => current ? {
        ...current,
        rua: limitEditField('rua', response.data.logradouro ?? current.rua),
        bairro: limitEditField('bairro', response.data.bairro ?? current.bairro),
        cidade: limitEditField('cidade', response.data.localidade ?? current.cidade),
        estado: limitEditField('estado', response.data.uf ?? current.estado),
        complemento: limitEditField('complemento', response.data.complemento || current.complemento),
      } : current);
    } catch {
      setMessage('Nao foi possivel buscar o CEP. Preencha o endereco manualmente.');
    }
  }

  function handleCepChange(value: string) {
    const cep = formatCep(value);
    updateField('cep', cep);

    if (onlyDigits(cep).length === 8) {
      fetchAddressByCep(cep);
    }
  }

  const isAdmin = user?.tipo === 'admin';
  const homePath = isAdmin ? '/dashboard' : '/profile';
  const messageVariant = message.toLowerCase().includes('sucesso') ? 'success' : 'error';

  function validateForm() {
    if (!form) {
      return false;
    }

    if (form.nome.trim().length < 2) {
      setMessage('Informe o nome completo para continuar.');
      return false;
    }

    if (form.nascimento && !isAtLeastAge(form.nascimento, 16)) {
      setMessage('O candidato deve ter pelo menos 16 anos para cadastrar o curriculo.');
      return false;
    }

    if (!isValidDateInput(form.nascimento) || !isValidDateInput(form.vencimentoCnh, { allowFuture: true })) {
      setMessage('Informe datas validas entre 1900 e 2100.');
      return false;
    }

    if (form.cpf && onlyDigits(form.cpf).length !== 11) {
      setMessage('Informe um CPF com 11 digitos.');
      return false;
    }

    if (form.rg && onlyDigits(form.rg).length < 7) {
      setMessage('Informe um RG valido.');
      return false;
    }

    if (form.celular && onlyDigits(form.celular).length !== 11) {
      setMessage('Informe um celular com DDD e 9 digitos.');
      return false;
    }

    if (form.telefone && ![10, 11].includes(onlyDigits(form.telefone).length)) {
      setMessage('Informe um telefone com DDD.');
      return false;
    }

    if (form.possuiCnh === 'Sim' && form.numeroCnh && onlyDigits(form.numeroCnh).length !== 11) {
      setMessage('Informe a CNH com 11 digitos.');
      return false;
    }

    return true;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !form) {
      return;
    }

    setMessage('');

    if (!validateForm()) {
      return;
    }

    setConfirmOpen(true);
  }

  async function confirmUpdate() {
    if (!id || !form) {
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      await updateCurriculo(id, {
        nome: form.nome,
        celular: nullable(onlyDigits(form.celular)),
        nascimento: nullable(form.nascimento),
        estadoCivil: nullable(form.estadoCivil),
        rg: nullable(onlyDigits(form.rg)),
        telefone: nullable(onlyDigits(form.telefone)),
        cpf: nullable(onlyDigits(form.cpf)),
        cursoAtivo: form.cursoAtivo === 'Sim',
        possuiCnh: form.possuiCnh === 'Sim',
        numeroCnh: form.possuiCnh === 'Sim' ? nullable(onlyDigits(form.numeroCnh)) : null,
        vencimentoCnh: nullable(form.vencimentoCnh),
        categoriaCnh: form.possuiCnh === 'Sim' ? nullable(form.categoriaCnh) : null,
        status: form.status,
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

      setMessage('Curriculo atualizado com sucesso.');
      setConfirmOpen(false);
    } catch {
      setMessage('Nao foi possivel atualizar o curriculo.');
    } finally {
      setSaving(false);
    }
  }

  const mainContent = (
      <Main>
        <Section>
          <SectionTitle>{loading ? 'Carregando Curriculo' : 'Dados Pessoais'}</SectionTitle>
          {message && <FeedbackMessage variant={messageVariant}>{message}</FeedbackMessage>}

          {form && (
            <form onSubmit={handleSubmit}>
              <FieldsetTitle>Dados Pessoais</FieldsetTitle>
              <Grid>
                <Field>
                  <Label>Nome</Label>
                  <Input type="text" maxLength={textLimits.medium} value={form.nome} onChange={(e) => updateField('nome', e.target.value)} />
                </Field>
                <Field>
                  <Label>Celular</Label>
                  <Input type="text" maxLength={textLimits.phone} value={form.celular} onChange={(e) => updateField('celular', formatPhone(e.target.value))} />
                </Field>
                <Field>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    min={MIN_DATE}
                    max={new Date().toISOString().slice(0, 10)}
                    value={form.nascimento}
                    onChange={(e) => updateField('nascimento', e.target.value)}
                  />
                </Field>

                <Field>
                  <Label>Estado Civil</Label>
                  <Select value={form.estadoCivil} onChange={(e) => updateField('estadoCivil', e.target.value)}>
                    <option value="">SELECIONE UMA OPCAO</option>
                    <option value="Solteiro">Solteiro</option>
                    <option value="Casado">Casado</option>
                    <option value="Divorciado">Divorciado</option>
                    <option value="Viuvo">Viuvo</option>
                  </Select>
                </Field>
                <Field>
                  <Label>RG</Label>
                  <Input type="text" maxLength={textLimits.rg} value={form.rg} onChange={(e) => updateField('rg', formatRg(e.target.value))} />
                </Field>
                <Field>
                  <Label>Telefone</Label>
                  <Input type="text" maxLength={textLimits.phone} value={form.telefone} onChange={(e) => updateField('telefone', formatPhone(e.target.value))} />
                </Field>

                <Field>
                  <Label>CPF</Label>
                  <Input type="text" maxLength={textLimits.cpf} value={form.cpf} onChange={(e) => updateField('cpf', formatCpf(e.target.value))} />
                </Field>
                <Field>
                  <Label>Possui curso ativo de CBSP e HUET?</Label>
                  <Select value={form.cursoAtivo} onChange={(e) => updateField('cursoAtivo', e.target.value)}>
                    <option value="Sim">Sim</option>
                    <option value="Nao">Nao</option>
                  </Select>
                </Field>
                <Field>
                  <Label>Possui CNH?</Label>
                  <Select value={form.possuiCnh} onChange={(e) => updateField('possuiCnh', e.target.value)}>
                    <option value="Sim">Sim</option>
                    <option value="Nao">Nao</option>
                  </Select>
                </Field>

                {isAdmin && (
                  <Field>
                    <Label>Status</Label>
                    <Select
                      value={form.status}
                      onChange={(e) => updateField('status', e.target.value as CurriculoStatus)}
                    >
                      {statusLabels.map((item) => (
                        <option key={item.status} value={item.status}>
                          {item.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                )}

                {form.possuiCnh === 'Sim' && (
                  <>
                    <Field>
                      <Label>Numero da CNH</Label>
                      <Input
                        type="text"
                        maxLength={textLimits.cnh}
                        value={form.numeroCnh}
                        onChange={(e) => updateField('numeroCnh', formatCnh(e.target.value))}
                      />
                    </Field>
                    <Field>
                      <Label>Vencimento da CNH</Label>
                      <Input
                        type="date"
                        min={MIN_DATE}
                        max="2100-12-31"
                        value={form.vencimentoCnh}
                        onChange={(e) => updateField('vencimentoCnh', e.target.value)}
                      />
                    </Field>
                    <Field>
                      <Label>Categoria da CNH</Label>
                      <Input
                        type="text"
                        maxLength={2}
                        value={form.categoriaCnh}
                        onChange={(e) => updateField('categoriaCnh', e.target.value)}
                      />
                    </Field>
                  </>
                )}
              </Grid>

              <FieldsetTitle>Endereco</FieldsetTitle>
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
                  <Input type="text" maxLength={textLimits.medium} value={form.rua} onChange={(e) => updateField('rua', e.target.value)} />
                </Field>
                <Field>
                  <Label>Cidade</Label>
                  <Input type="text" maxLength={textLimits.short} value={form.cidade} onChange={(e) => updateField('cidade', e.target.value)} />
                </Field>

                <Field>
                  <Label>Numero</Label>
                  <Input type="text" maxLength={textLimits.number} value={form.numero} onChange={(e) => updateField('numero', e.target.value)} />
                </Field>
                <Field>
                  <Label>Bairro</Label>
                  <Input type="text" maxLength={textLimits.short} value={form.bairro} onChange={(e) => updateField('bairro', e.target.value)} />
                </Field>
                <Field>
                  <Label>Estado</Label>
                  <Input type="text" maxLength={textLimits.state} value={form.estado} onChange={(e) => updateField('estado', e.target.value)} />
                </Field>

                <Field>
                  <Label>Complemento</Label>
                  <Input
                    type="text"
                    maxLength={textLimits.medium}
                    value={form.complemento}
                    onChange={(e) => updateField('complemento', e.target.value)}
                  />
                </Field>
              </Grid>

              <ActionButtons>
                <SubmitButton type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : 'Alterar Curriculo'}
                </SubmitButton>
                <ReturnButton type="button" onClick={() => navigate(id ? `/view/${id}` : '/dashboard')}>
                  Voltar
                </ReturnButton>
              </ActionButtons>
            </form>
          )}
        </Section>
      </Main>
  );

  const modals = (
    <>
      {confirmOpen && (
        <ConfirmModal
          title="Alterar curriculo?"
          description="As informacoes deste curriculo serao atualizadas com os dados preenchidos na tela. Confirme para salvar as alteracoes."
          confirmLabel="Salvar alteracoes"
          tone="default"
          loading={saving}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={confirmUpdate}
        />
      )}
    </>
  );

  if (isAdmin) {
    return (
      <AdminLayout activeSection="curriculos">
        {mainContent}
        {modals}
      </AdminLayout>
    );
  }

  return (
    <UserLayout>
      <Header>
        <HeaderContent>
          <Brand href={homePath}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink href={homePath}>Inicio</NavLink>
            <NavLink href="/vagas">Vagas</NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      {mainContent}

      <Footer>
        <FooterContent>
          <Brand href={homePath}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2026 Cesar Garcia Consultoria de TI</Copyright>
        </FooterContent>
      </Footer>
      {modals}
      {logoutModal}
    </UserLayout>
  );
}
