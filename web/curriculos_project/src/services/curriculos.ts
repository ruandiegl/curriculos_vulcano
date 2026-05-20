import { api } from './api';
import type { Curriculo, CurriculoStatus, CurriculosResponse } from '../types/curriculo';

export const PENDING_CURRICULUM_STORAGE_KEY = 'pendingCurriculumId';

type ListCurriculosParams = {
  page: number;
  limit: number;
  search?: string;
};

export type CurriculoUpdatePayload = Partial<{
  usuarioId: string | null;
  nome: string;
  email: string | null;
  cpf: string | null;
  rg: string | null;
  nascimento: string | null;
  celular: string | null;
  telefone: string | null;
  estadoCivil: string | null;
  status: CurriculoStatus;
  possuiCnh: boolean;
  categoriaCnh: string | null;
  numeroCnh: string | null;
  vencimentoCnh: string | null;
  cursoAtivo: boolean;
  enderecos: EnderecoPayload[];
  atuacoes: AtuacaoPayload[];
}>;

export type EnderecoPayload = {
  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
};

export type AtuacaoPayload = {
  nome: string;
  prioridade?: number | null;
};

export type CurriculoCreatePayload = Omit<CurriculoUpdatePayload, 'nome'> & {
  nome: string;
};

export async function listCurriculos({ page, limit, search }: ListCurriculosParams) {
  const response = await api.get<CurriculosResponse>('/curriculos', {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
    },
  });

  return response.data;
}

export async function getCurriculo(id: string) {
  const response = await api.get<Curriculo>(`/curriculos/${id}`);
  return response.data;
}

export async function createCurriculo(payload: CurriculoCreatePayload) {
  const response = await api.post<Curriculo>('/curriculos', payload);
  return response.data;
}

export async function updateCurriculo(id: string, payload: CurriculoUpdatePayload) {
  const response = await api.put<Curriculo>(`/curriculos/${id}`, payload);
  return response.data;
}

export async function deleteCurriculo(id: string) {
  await api.delete(`/curriculos/${id}`);
}
