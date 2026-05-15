import { z } from 'zod';

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
});

export const experienciaSchema = z.object({
  empresa: z.string().min(1),
  cargo: nullableText,
});

export const escolaridadeSchema = z.object({
  escola: z.string().min(1),
});

export const curriculoSchema = z.object({
  usuarioId: z.string().uuid().optional().nullable(),
  nome: z.string().min(2),
  cpf: nullableText,
  rg: nullableText,
  nascimento: z.coerce.date().optional().nullable(),
  estadoCivil: nullableText,
  email: z.string().email().optional().nullable(),
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
