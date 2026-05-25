import { api } from './api';
import type { Vaga, VagasResponse } from '../types/vaga';

type ListVagasParams = {
  page?: number;
  limit?: number;
  search?: string;
  ativa?: boolean;
};

export type VagaPayload = {
  titulo: string;
  descricao?: string | null;
  cidade?: string | null;
  estado?: string | null;
  ativa?: boolean;
};

export async function listVagas({ page = 1, limit = 20, search, ativa }: ListVagasParams = {}) {
  const response = await api.get<VagasResponse>('/vagas', {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(typeof ativa === 'boolean' ? { ativa } : {}),
    },
  });

  return response.data;
}

export async function getVaga(id: string) {
  const response = await api.get<Vaga>(`/vagas/${id}`);
  return response.data;
}

export async function createVaga(payload: VagaPayload) {
  const response = await api.post<Vaga>('/vagas', payload);
  return response.data;
}

export async function updateVaga(id: string, payload: VagaPayload) {
  const response = await api.put<Vaga>(`/vagas/${id}`, payload);
  return response.data;
}

export async function deleteVaga(id: string) {
  await api.delete(`/vagas/${id}`);
}
