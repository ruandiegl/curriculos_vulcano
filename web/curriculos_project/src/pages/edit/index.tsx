import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import { getCurriculo, updateCurriculo } from '../../services/curriculos';
import type { Curriculo, CurriculoStatus } from '../../types/curriculo';
import { formatCnh, formatCpf, formatPhone, formatRg, onlyDigits } from '../../utils/masks';
import { statusLabels } from '../../utils/status';
import {
  ActionButtons,
  Brand,
  Copyright,
  Field,
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
  Page,
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
};

function nullable(value: string) {
  return value.trim() || null;
}

function formFromCurriculo(curriculo: Curriculo): FormState {
  return {
    nome: curriculo.nome ?? '',
    celular: formatPhone(curriculo.celular),
    nascimento: curriculo.nascimento?.slice(0, 10) ?? '',
    estadoCivil: curriculo.estadoCivil ?? '',
    rg: formatRg(curriculo.rg),
    telefone: formatPhone(curriculo.telefone),
    cpf: formatCpf(curriculo.cpf),
    cursoAtivo: curriculo.cursoAtivo ? 'Sim' : 'Nao',
    possuiCnh: curriculo.possuiCnh ? 'Sim' : 'Nao',
    numeroCnh: formatCnh(curriculo.numeroCnh),
    vencimentoCnh: curriculo.vencimentoCnh?.slice(0, 10) ?? '',
    categoriaCnh: curriculo.categoriaCnh ?? '',
    status: curriculo.status,
  };
}

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    signOut();
    navigate('/');
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => (current ? { ...current, [field]: value } : current));
  }

  const homePath = user?.tipo === 'admin' ? '/dashboard' : '/profile';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !form) {
      return;
    }

    if (form.cpf && onlyDigits(form.cpf).length !== 11) {
      setMessage('Informe um CPF com 11 digitos.');
      return;
    }

    if (form.rg && onlyDigits(form.rg).length < 7) {
      setMessage('Informe um RG valido.');
      return;
    }

    if (form.celular && onlyDigits(form.celular).length !== 11) {
      setMessage('Informe um celular com DDD e 9 digitos.');
      return;
    }

    if (form.telefone && ![10, 11].includes(onlyDigits(form.telefone).length)) {
      setMessage('Informe um telefone com DDD.');
      return;
    }

    if (form.possuiCnh === 'Sim' && form.numeroCnh && onlyDigits(form.numeroCnh).length !== 11) {
      setMessage('Informe a CNH com 11 digitos.');
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
      });

      setMessage('Curriculo atualizado com sucesso.');
    } catch {
      setMessage('Nao foi possivel atualizar o curriculo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <Header>
        <HeaderContent>
          <Brand href={homePath}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink href={homePath}>{user?.tipo === 'admin' ? 'Gerenciar Curriculos' : 'Inicio'}</NavLink>
            <NavLink href="#">Gerenciar Vagas</NavLink>
            <LogoutButton type="button" onClick={handleLogout}>
              Sair
            </LogoutButton>
          </HeaderNav>
        </HeaderContent>
      </Header>

      <Main>
        <Section>
          <SectionTitle>{loading ? 'Carregando Curriculo' : 'Dados Pessoais'}</SectionTitle>
          {message && <Label>{message}</Label>}

          {form && (
            <form onSubmit={handleSubmit}>
              <Grid>
                <Field>
                  <Label>Nome</Label>
                  <Input type="text" value={form.nome} onChange={(e) => updateField('nome', e.target.value)} />
                </Field>
                <Field>
                  <Label>Celular</Label>
                  <Input type="text" value={form.celular} onChange={(e) => updateField('celular', formatPhone(e.target.value))} />
                </Field>
                <Field>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
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
                  <Input type="text" value={form.rg} onChange={(e) => updateField('rg', formatRg(e.target.value))} />
                </Field>
                <Field>
                  <Label>Telefone</Label>
                  <Input type="text" value={form.telefone} onChange={(e) => updateField('telefone', formatPhone(e.target.value))} />
                </Field>

                <Field>
                  <Label>CPF</Label>
                  <Input type="text" value={form.cpf} onChange={(e) => updateField('cpf', formatCpf(e.target.value))} />
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

                {user?.tipo === 'admin' && (
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
                        value={form.numeroCnh}
                        onChange={(e) => updateField('numeroCnh', formatCnh(e.target.value))}
                      />
                    </Field>
                    <Field>
                      <Label>Vencimento da CNH</Label>
                      <Input
                        type="date"
                        value={form.vencimentoCnh}
                        onChange={(e) => updateField('vencimentoCnh', e.target.value)}
                      />
                    </Field>
                    <Field>
                      <Label>Categoria da CNH</Label>
                      <Input
                        type="text"
                        value={form.categoriaCnh}
                        onChange={(e) => updateField('categoriaCnh', e.target.value)}
                      />
                    </Field>
                  </>
                )}
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

      <Footer>
        <FooterContent>
          <Brand href={homePath}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2023 Multi Publicidade</Copyright>
        </FooterContent>
      </Footer>
    </Page>
  );
}
