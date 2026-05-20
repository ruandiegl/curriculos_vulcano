import axios from 'axios';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../hooks/useAuth';
import { PENDING_CURRICULUM_STORAGE_KEY, createCurriculo } from '../../services/curriculos';
import type { CurriculoCreatePayload } from '../../services/curriculos';
import { formatCnh, formatCpf, formatPhone, formatRg, onlyDigits } from '../../utils/masks';
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
  RadioGroup,
  RadioLabel,
  Section,
  SectionTitle,
  Select,
  SubmitButton,
} from './styles';

const jobRoles = [
  'FISCAL',
  'FINANCEIRO',
  'SOLDADOR TIG',
  'SOLDADOR MIG/MAG',
  'MECANICO DE MANUTENCAO',
  'MECANICO DE MONTAGEM',
  'RECURSOS HUMANOS',
  'SEGURANCA DO TRABALHO',
  'ELETRICISTA',
  'QUALIDADE',
  'CONTROLADORIA',
  'ENGENHARIA',
  'COMPRAS',
  'ALMOXARIFADO',
  'LOGISTICA',
  'LIMPEZA',
  'CONSTRUCAO CIVIL',
  'TRANSPORTE / MOTORISTA',
  'AJUDANTE',
  'ESMERILHADOR',
  'OPERADOR DE EMPILHADEIRA',
  'OPERADOR DE PONTE ROLANTE',
  'OPERADOR DE MANDRILHADORA',
  'PINTOR DE VEICULOS',
  'MACARIQUEIRO',
  'DESENHISTA PROJETISTA',
  'OPERADOR DE MAQUINAS OPERATRIZES',
];

type FormState = {
  nome: string;
  celular: string;
  nascimento: string;
  estadoCivil: string;
  rg: string;
  telefone: string;
  cpf: string;
  possuiCnh: string;
  cursoAtivo: string;
  atuacaoPrincipal: string;
  atuacaoSecundaria: string;
  atuacaoTerciaria: string;
  numeroCnh: string;
  vencimentoCnh: string;
  categoriaCnh: string;
};

const initialForm: FormState = {
  nome: '',
  celular: '',
  nascimento: '',
  estadoCivil: 'Solteiro',
  rg: '',
  telefone: '',
  cpf: '',
  possuiCnh: 'Nao',
  cursoAtivo: 'Nao',
  atuacaoPrincipal: '',
  atuacaoSecundaria: '',
  atuacaoTerciaria: '',
  numeroCnh: '',
  vencimentoCnh: '',
  categoriaCnh: 'A',
};

function nullable(value: string) {
  return value.trim() || null;
}

export default function NewCurriculum() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function handleLogout() {
    signOut();
    navigate('/');
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function buildPayload(): CurriculoCreatePayload {
    const atuacoes = [
      form.atuacaoPrincipal,
      form.atuacaoSecundaria,
      form.atuacaoTerciaria,
    ]
      .map((nome, index) => ({ nome: nome.trim(), prioridade: index + 1 }))
      .filter((atuacao) => atuacao.nome);

    return {
      usuarioId: user?.id ?? null,
      nome: form.nome.trim(),
      email: user?.email ?? null,
      celular: nullable(onlyDigits(form.celular)),
      nascimento: nullable(form.nascimento),
      estadoCivil: nullable(form.estadoCivil),
      rg: nullable(onlyDigits(form.rg)),
      telefone: nullable(onlyDigits(form.telefone)),
      cpf: nullable(onlyDigits(form.cpf)),
      possuiCnh: form.possuiCnh === 'Sim',
      cursoAtivo: form.cursoAtivo === 'Sim',
      numeroCnh: form.possuiCnh === 'Sim' ? nullable(onlyDigits(form.numeroCnh)) : null,
      vencimentoCnh: form.possuiCnh === 'Sim' ? nullable(form.vencimentoCnh) : null,
      categoriaCnh: form.possuiCnh === 'Sim' ? nullable(form.categoriaCnh) : null,
      atuacoes,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (form.nome.trim().length < 2) {
      setMessage('Informe o nome completo para continuar.');
      return;
    }

    if (!form.atuacaoPrincipal) {
      setMessage('Selecione ao menos uma area de atuacao.');
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
      setLoading(true);
      const curriculo = await createCurriculo(buildPayload());
      sessionStorage.setItem(PENDING_CURRICULUM_STORAGE_KEY, curriculo.id);
      navigate('/newAddress', { state: { curriculoId: curriculo.id } });
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Nao foi possivel criar o curriculo.',
        );
        return;
      }

      setMessage('Nao foi possivel criar o curriculo. Tente novamente.');
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
          <p>Seja bem vindo(a) a central de Recursos Humanos do Grupo Metalurgica Vulcano!</p>
          <p>Vamos precisar de suas informacoes - Preencha seus dados pessoais</p>
        </Greeting>

        <Section>
          <SectionTitle>Dados Pessoais</SectionTitle>
          {message && <Label>{message}</Label>}

          <form onSubmit={handleSubmit}>
            <Grid>
              <Field>
                <Label>Nome Completo</Label>
                <Input
                  type="text"
                  placeholder="ruan diego dos santos"
                  value={form.nome}
                  onChange={(e) => updateField('nome', e.target.value)}
                />
              </Field>
              <Field>
                <Label>Celular</Label>
                <Input
                  type="text"
                  placeholder="(24) 99999-9999"
                  value={form.celular}
                  onChange={(e) => updateField('celular', formatPhone(e.target.value))}
                />
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
                  <option value="Solteiro">Solteiro</option>
                  <option value="Casado">Casado</option>
                  <option value="Divorciado">Divorciado</option>
                  <option value="Viuvo">Viuvo</option>
                </Select>
              </Field>
              <Field>
                <Label>RG</Label>
                <Input
                  type="text"
                  placeholder="00.000.000-0"
                  value={form.rg}
                  onChange={(e) => updateField('rg', formatRg(e.target.value))}
                />
              </Field>
              <Field>
                <Label>Telefone</Label>
                <Input
                  type="text"
                  placeholder="(24) 3333-33333"
                  value={form.telefone}
                  onChange={(e) => updateField('telefone', formatPhone(e.target.value))}
                />
              </Field>

              <Field>
                <Label>CPF</Label>
                <Input
                  type="text"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={(e) => updateField('cpf', formatCpf(e.target.value))}
                />
              </Field>
              <Field>
                <Label>Possui CNH?</Label>
                <RadioGroup>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="cnh"
                      value="Sim"
                      checked={form.possuiCnh === 'Sim'}
                      onChange={(e) => updateField('possuiCnh', e.target.value)}
                    />
                    Sim
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="cnh"
                      value="Nao"
                      checked={form.possuiCnh === 'Nao'}
                      onChange={(e) => updateField('possuiCnh', e.target.value)}
                    />
                    Nao
                  </RadioLabel>
                </RadioGroup>
              </Field>
              <Field>
                <Label>Possui curso ativo de CBSP e HUET?</Label>
                <RadioGroup>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="cbsp"
                      value="Sim"
                      checked={form.cursoAtivo === 'Sim'}
                      onChange={(e) => updateField('cursoAtivo', e.target.value)}
                    />
                    Sim
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="cbsp"
                      value="Nao"
                      checked={form.cursoAtivo === 'Nao'}
                      onChange={(e) => updateField('cursoAtivo', e.target.value)}
                    />
                    Nao
                  </RadioLabel>
                </RadioGroup>
              </Field>

              <Field>
                <Label>Cargo/Area de Atuacao desejado</Label>
                <Select value={form.atuacaoPrincipal} onChange={(e) => updateField('atuacaoPrincipal', e.target.value)}>
                  <option value="" disabled>
                    Selecione
                  </option>
                  {jobRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Cargo/Area de Atuacao secundario</Label>
                <Select value={form.atuacaoSecundaria} onChange={(e) => updateField('atuacaoSecundaria', e.target.value)}>
                  <option value="">Selecione</option>
                  {jobRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Cargo/Area de Atuacao terciario</Label>
                <Select value={form.atuacaoTerciaria} onChange={(e) => updateField('atuacaoTerciaria', e.target.value)}>
                  <option value="">Selecione</option>
                  {jobRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
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
                      placeholder="00000000000000000000"
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
                    <Select value={form.categoriaCnh} onChange={(e) => updateField('categoriaCnh', e.target.value)}>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="AB">AB</option>
                    </Select>
                  </Field>
                </>
              )}
            </Grid>

            <ActionButtons>
              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Continuar'}
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
