import { isAtLeastAge } from '../../utils/date';
import { onlyDigits } from '../../utils/masks';

export const jobRoles = [
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

export type FormState = {
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

export const initialForm: FormState = {
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

function hasValue(value: string) {
  return Boolean(value.trim());
}

export function validateNewCurriculumForm(form: FormState) {
  if (form.nome.trim().length < 2) {
    return 'Informe o nome completo para continuar.';
  }

  if (!hasValue(form.celular)) {
    return 'Informe o celular para continuar.';
  }

  if (!hasValue(form.nascimento)) {
    return 'Informe a data de nascimento para continuar.';
  }

  if (!isAtLeastAge(form.nascimento, 16)) {
    return 'Informe uma data de nascimento valida.';
  }

  if (!hasValue(form.estadoCivil)) {
    return 'Informe o estado civil para continuar.';
  }

  if (!hasValue(form.rg)) {
    return 'Informe o RG para continuar.';
  }

  if (!hasValue(form.telefone)) {
    return 'Informe o telefone para continuar.';
  }

  if (!hasValue(form.cpf)) {
    return 'Informe o CPF para continuar.';
  }

  if (!hasValue(form.atuacaoPrincipal)) {
    return 'Selecione o cargo/area de atuacao desejado.';
  }

  if (!hasValue(form.atuacaoSecundaria)) {
    return 'Selecione o cargo/area de atuacao secundario.';
  }

  if (!hasValue(form.atuacaoTerciaria)) {
    return 'Selecione o cargo/area de atuacao terciario.';
  }

  if (form.cpf && onlyDigits(form.cpf).length !== 11) {
    return 'Informe um CPF com 11 digitos.';
  }

  if (form.rg && onlyDigits(form.rg).length < 7) {
    return 'Informe um RG valido.';
  }

  if (form.celular && onlyDigits(form.celular).length !== 11) {
    return 'Informe um celular com DDD e 9 digitos.';
  }

  if (form.telefone && ![10, 11].includes(onlyDigits(form.telefone).length)) {
    return 'Informe um telefone com DDD.';
  }

  if (form.possuiCnh === 'Sim' && form.numeroCnh && onlyDigits(form.numeroCnh).length !== 11) {
    return 'Informe a CNH com 11 digitos.';
  }

  if (form.possuiCnh === 'Sim' && !hasValue(form.numeroCnh)) {
    return 'Informe o numero da CNH para continuar.';
  }

  if (form.possuiCnh === 'Sim' && !hasValue(form.vencimentoCnh)) {
    return 'Informe o vencimento da CNH para continuar.';
  }

  if (form.possuiCnh === 'Sim' && !hasValue(form.categoriaCnh)) {
    return 'Informe a categoria da CNH para continuar.';
  }

  return null;
}
