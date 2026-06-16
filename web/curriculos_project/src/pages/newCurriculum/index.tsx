import axios from 'axios';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { UserLayout } from '../../components/UserLayout';
import { useAuth } from '../../hooks/useAuth';
import { PENDING_CURRICULUM_STORAGE_KEY, createCurriculo, getMeuCurriculo, updateCurriculo } from '../../services/curriculos';
import type { CurriculoCreatePayload } from '../../services/curriculos';
import type { Curriculo } from '../../types/curriculo';
import { MIN_DATE, isValidDateInput, limitText, normalizeDate, textLimits } from '../../utils/formLimits';
import { formatCnh, formatCpf, formatPhone, formatRg, onlyDigits } from '../../utils/masks';
import { initialForm, jobRoles, validateNewCurriculumForm } from './validation';
import type { FormState } from './validation';
import {
  ActionButtons,
  Brand,
  Copyright,
  Field,
  Footer,
  FooterContent,
  Grid,
  Greeting,
  Input,
  Label,
  Main,
  RadioGroup,
  RadioLabel,
  Section,
  SectionTitle,
  Select,
  SubmitButton,
} from './styles';

function nullable(value: string) {
  return value.trim() || null;
}

function limitCurriculumField<K extends keyof FormState>(field: K, value: FormState[K]) {
  const textValue = String(value);
  const limits: Partial<Record<keyof FormState, number>> = {
    nome: textLimits.medium,
    celular: textLimits.phone,
    telefone: textLimits.phone,
    rg: textLimits.rg,
    cpf: textLimits.cpf,
    numeroCnh: textLimits.cnh,
    categoriaCnh: 2,
  };

  if (field === 'nascimento' || field === 'vencimentoCnh') {
    return normalizeDate(textValue) as FormState[K];
  }

  return limitText(textValue, limits[field] ?? textLimits.medium) as FormState[K];
}

export default function NewCurriculum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [curriculoId, setCurriculoId] = useState('');
  const [loadingCurriculo, setLoadingCurriculo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadCurriculo() {
      try {
        setLoadingCurriculo(true);
        const curriculo = await getMeuCurriculo();

        if (!isCurrent) return;

        setCurriculoId(curriculo?.id);
        setForm(formFromCurriculo(curriculo));
        setMessage('');
      } catch {
        if (isCurrent) {
          setCurriculoId('');
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

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: limitCurriculumField(field, value) }));
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

  function formFromCurriculo(curriculo: Curriculo): FormState {
    const [principal, secundaria, terciaria] = [...(curriculo?.atuacoes ?? [])]
      .sort((a, b) => (a.prioridade ?? 99) - (b.prioridade ?? 99));

    return {
      nome: curriculo?.nome ?? '',
      celular: formatPhone(curriculo?.celular),
      nascimento: curriculo?.nascimento?.slice(0, 10) ?? '',
      estadoCivil: curriculo?.estadoCivil ?? initialForm.estadoCivil,
      rg: formatRg(curriculo?.rg),
      telefone: formatPhone(curriculo?.telefone),
      cpf: formatCpf(curriculo?.cpf),
      possuiCnh: curriculo?.possuiCnh ? 'Sim' : 'Nao',
      cursoAtivo: curriculo?.cursoAtivo ? 'Sim' : 'Nao',
      numeroCnh: formatCnh(curriculo?.numeroCnh),
      vencimentoCnh: curriculo?.vencimentoCnh?.slice(0, 10) ?? '',
      categoriaCnh: curriculo?.categoriaCnh ?? initialForm.categoriaCnh,
      atuacaoPrincipal: principal?.nome ?? '',
      atuacaoSecundaria: secundaria?.nome ?? '',
      atuacaoTerciaria: terciaria?.nome ?? '',
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    const validationMessage = validateNewCurriculumForm(form);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    if (!isValidDateInput(form.nascimento) || !isValidDateInput(form.vencimentoCnh, { allowFuture: true })) {
      setMessage('Informe datas válidas entre 1900 e 2100.');
      return;
    }

    try {
      setLoading(true);
      if (curriculoId) {
        await updateCurriculo(curriculoId, buildPayload());
        setMessage('Dados pessoais atualizados com sucesso.');
        return;
      }

      const curriculo = await createCurriculo(buildPayload());
      sessionStorage.setItem(PENDING_CURRICULUM_STORAGE_KEY, curriculo?.id);
      navigate('/newAddress', { state: { curriculoId: curriculo?.id } });
    } catch (error) {
      if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
        setMessage(
          error.response?.data?.message ??
            error.response?.data?.error ??
            'Não foi possível criar o currículo.',
        );
        return;
      }

      setMessage('Não foi possível criar o currículo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserLayout>
      <Main>
        <Greeting>
          <p>{curriculoId ? 'Atualize seus dados pessoais do currículo.' : 'Preencha seus dados pessoais para iniciar seu currículo.'}</p>
        </Greeting>

        <Section>
          <SectionTitle>Dados Pessoais</SectionTitle>
          {message && (
            <FeedbackMessage variant={message.toLowerCase().includes('sucesso') ? 'success' : 'error'}>
              {message}
            </FeedbackMessage>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Grid>
              <Field>
                <Label>Nome Completo</Label>
                <Input
                  type="text"
                  placeholder="Nome"
                  maxLength={textLimits.medium}
                  value={form.nome}
                  onChange={(e) => updateField('nome', e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Label>Celular</Label>
                <Input
                  type="text"
                  placeholder="(24) 99999-9999"
                  maxLength={textLimits.phone}
                  value={form.celular}
                  onChange={(e) => updateField('celular', formatPhone(e.target.value))}
                  required
                />
              </Field>
              <Field>
                <Label>Data de Nascimento</Label>
                <Input
                  type="date"
                  min={MIN_DATE}
                  max={new Date().toISOString().slice(0, 10)}
                  value={form.nascimento}
                  onChange={(e) => updateField('nascimento', e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Label>Estado Civil</Label>
                <Select value={form.estadoCivil} onChange={(e) => updateField('estadoCivil', e.target.value)} required>
                  <option value="Solteiro">Solteiro</option>
                  <option value="Casado">Casado</option>
                  <option value="Divorciado">Divorciado</option>
                  <option value="Viuvo">Viúvo</option>
                </Select>
              </Field>
              <Field>
                <Label>RG</Label>
                <Input
                  type="text"
                  placeholder="00.000.000-0"
                  maxLength={textLimits.rg}
                  value={form.rg}
                  onChange={(e) => updateField('rg', formatRg(e.target.value))}
                  required
                />
              </Field>
              <Field>
                <Label>Telefone</Label>
                <Input
                  type="text"
                  placeholder="(24) 3333-33333"
                  maxLength={textLimits.phone}
                  value={form.telefone}
                  onChange={(e) => updateField('telefone', formatPhone(e.target.value))}
                  required
                />
              </Field>

              <Field>
                <Label>CPF</Label>
                <Input
                  type="text"
                  placeholder="000.000.000-00"
                  maxLength={textLimits.cpf}
                  value={form.cpf}
                  onChange={(e) => updateField('cpf', formatCpf(e.target.value))}
                  required
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
                <Label>Cargo/Area de Atuação desejado</Label>
                <Select value={form.atuacaoPrincipal} onChange={(e) => updateField('atuacaoPrincipal', e.target.value)} required>
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
                <Label>Cargo/Area de Atuação secundário</Label>
                <Select value={form.atuacaoSecundaria} onChange={(e) => updateField('atuacaoSecundaria', e.target.value)} required>
                  <option value="">Selecione</option>
                  {jobRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Cargo/Area de Atuação terciário</Label>
                <Select value={form.atuacaoTerciaria} onChange={(e) => updateField('atuacaoTerciaria', e.target.value)} required>
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
                    <Label>Número da CNH</Label>
                    <Input
                      type="text"
                      placeholder="00000000000000000000"
                      maxLength={textLimits.cnh}
                      value={form.numeroCnh}
                      onChange={(e) => updateField('numeroCnh', formatCnh(e.target.value))}
                      required
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
                      required
                    />
                  </Field>
                  <Field>
                    <Label>Categoria da CNH</Label>
                    <Select value={form.categoriaCnh} onChange={(e) => updateField('categoriaCnh', e.target.value)} required>
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
              <SubmitButton type="submit" disabled={loading || loadingCurriculo}>
                {loading || loadingCurriculo ? 'Salvando...' : curriculoId ? 'Salvar Alterações' : 'Continuar'}
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
