import { api } from './api';
import type { Curriculo, CurriculoStatus, CurriculosResponse } from '../types/curriculo';

type ListCurriculosParams = {
  page: number;
  limit: number;
  search?: string;
};

export type CurriculoUpdatePayload = Partial<{
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
}>;

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

export async function updateCurriculo(id: string, payload: CurriculoUpdatePayload) {
  const response = await api.put<Curriculo>(`/curriculos/${id}`, payload);
  return response.data;
}

export async function deleteCurriculo(id: string) {
  await api.delete(`/curriculos/${id}`);
}
