import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import { getCurriculo, updateCurriculo } from '../../services/curriculos';
import type { Curriculo, CurriculoStatus } from '../../types/curriculo';
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
    celular: curriculo.celular ?? '',
    nascimento: curriculo.nascimento?.slice(0, 10) ?? '',
    estadoCivil: curriculo.estadoCivil ?? '',
    rg: curriculo.rg ?? '',
    telefone: curriculo.telefone ?? '',
    cpf: curriculo.cpf ?? '',
    cursoAtivo: curriculo.cursoAtivo ? 'Sim' : 'Nao',
    possuiCnh: curriculo.possuiCnh ? 'Sim' : 'Nao',
    numeroCnh: curriculo.numeroCnh ?? '',
    vencimentoCnh: curriculo.vencimentoCnh?.slice(0, 10) ?? '',
    categoriaCnh: curriculo.categoriaCnh ?? '',
    status: curriculo.status,
  };
}

export default function Edit() {
  const navigate = useNavigate();
  const [possuiCNH, setPossuiCNH] = useState('Não');
  const { id } = useParams();
  const navigate = useNavigate();
  const { signOut } = useAuth();
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || !form) {
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      await updateCurriculo(id, {
        nome: form.nome,
        celular: nullable(form.celular),
        nascimento: nullable(form.nascimento),
        estadoCivil: nullable(form.estadoCivil),
        rg: nullable(form.rg),
        telefone: nullable(form.telefone),
        cpf: nullable(form.cpf),
        cursoAtivo: form.cursoAtivo === 'Sim',
        possuiCnh: form.possuiCnh === 'Sim',
        numeroCnh: nullable(form.numeroCnh),
        vencimentoCnh: nullable(form.vencimentoCnh),
        categoriaCnh: nullable(form.categoriaCnh),
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
          <Brand onClick={() => navigate('/dashboard')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>

          <HeaderNav>
            <NavLink onClick={() => navigate('/dashboard')}>Gerenciar Curriculos</NavLink>
            <NavLink onClick={() => {}}>Gerenciar Vagas</NavLink>
            <LogoutButton>Sair</LogoutButton>
            <NavLink href="/dashboard">Gerenciar Curriculos</NavLink>
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
                  <Input type="text" value={form.celular} onChange={(e) => updateField('celular', e.target.value)} />
                </Field>
                <Field>
                  <Label>Categoria da CNH</Label>
                  <Select defaultValue="">
                    <option value="" disabled>Selecione</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="AB">AB</option>
                  </Select>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={form.nascimento}
                    onChange={(e) => updateField('nascimento', e.target.value)}
                  />
                </Field>

        <Section>
          <SectionTitle>Endereço</SectionTitle>
          <Grid>
            <Field>
              <Label>Logradouro</Label>
              <Input type="text" defaultValue="Avenida São Paulo" />
            </Field>
            <Field>
              <Label>Complemento</Label>
              <Input type="text" defaultValue="Casa" />
            </Field>
            <Field>
              <Label>Cidade</Label>
              <Input type="text" defaultValue="Barra Mansa" />
            </Field>

            <Field>
              <Label>Número</Label>
              <Input type="text" defaultValue="41" />
            </Field>
            <Field>
              <Label>Bairro</Label>
              <Input type="text" defaultValue="Colônia Santo Antônio" />
            </Field>
            <Field>
              <Label>Estado</Label>
              <Input type="text" defaultValue="RJ" />
            </Field>
          </Grid>

          <ActionButtons>
            <SubmitButton type="button">Alterar Currículo</SubmitButton>
            <ReturnButton type="button" onClick={() => navigate(-1)}>
              Voltar
            </ReturnButton>
          </ActionButtons>
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
                  <Input type="text" value={form.rg} onChange={(e) => updateField('rg', e.target.value)} />
                </Field>
                <Field>
                  <Label>Telefone</Label>
                  <Input type="text" value={form.telefone} onChange={(e) => updateField('telefone', e.target.value)} />
                </Field>

                <Field>
                  <Label>CPF</Label>
                  <Input type="text" value={form.cpf} onChange={(e) => updateField('cpf', e.target.value)} />
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

                {form.possuiCnh === 'Sim' && (
                  <>
                    <Field>
                      <Label>Numero da CNH</Label>
                      <Input
                        type="text"
                        value={form.numeroCnh}
                        onChange={(e) => updateField('numeroCnh', e.target.value)}
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
          <Brand onClick={() => navigate('/dashboard')}>
            <img src={logo} alt="Metalurgica Vulcano" />
          </Brand>
          <Copyright>© 2023 Multi Publicidade</Copyright>
        </FooterContent>
      </Footer>
    </Page>
  );
}
