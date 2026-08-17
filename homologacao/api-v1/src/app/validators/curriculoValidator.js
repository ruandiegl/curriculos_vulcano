import { z } from 'zod';
import { emailSchema } from './emailValidator.js';

const nullableText = z.string().optional().nullable();

export const enderecoSchema = z.object({
  rua: nullableText,
  numero: nullableText,
  complemento: nullableText,
  bairro: nullableText,
  cidade: nullableText,
  estado: nullableText,
});

export const atuacaoSchema = z.object({
  nome: z.string().min(1),
  prioridade: z.number().int().optional().nullable(),
});

export const cursoSchema = z.object({
  nome: z.string().min(1),
  instituicao: nullableText,
  cargaHoraria: nullableText,
});

export const experienciaSchema = z.object({
  empresa: z.string().min(1),
  cargo: nullableText,
  dataInicio: z.coerce.date().optional().nullable(),
  dataTermino: z.coerce.date().optional().nullable(),
  funcoes: nullableText,
});

export const escolaridadeSchema = z.object({
  curso: nullableText,
  escola: z.string().min(1),
  dataInicio: z.coerce.date().optional().nullable(),
  dataTermino: z.coerce.date().optional().nullable(),
});

export const curriculoSchema = z.object({
  usuarioId: z.string().uuid().optional().nullable(),
  nome: z.string().min(2),
  cpf: nullableText,
  rg: nullableText,
  nascimento: z.coerce.date().optional().nullable(),
  estadoCivil: nullableText,
  email: emailSchema.optional().nullable(),
  celular: nullableText,
  telefone: nullableText,
  possuiCnh: z.boolean().optional(),
  categoriaCnh: nullableText,
  numeroCnh: nullableText,
  vencimentoCnh: z.coerce.date().optional().nullable(),
  cursoAtivo: z.boolean().optional(),
  status: z.enum(['visualizado', 'entrevistado', 'selecionado', 'desconsiderado']).optional(),
  enderecos: z.array(enderecoSchema).optional(),
  atuacoes: z.array(atuacaoSchema).optional(),
  cursos: z.array(cursoSchema).optional(),
  experiencias: z.array(experienciaSchema).optional(),
  escolaridades: z.array(escolaridadeSchema).optional(),
});

export const curriculoUpdateSchema = curriculoSchema.partial();
export const curriculoUserCreateSchema = curriculoSchema.omit({
  usuarioId: true,
  status: true,
});
export const curriculoUserUpdateSchema = curriculoUserCreateSchema.partial();
