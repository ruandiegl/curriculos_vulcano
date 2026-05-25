import { api } from './api';
import type { Candidatura } from '../types/vaga';

type ListCandidaturasParams = {
  page?: number;
  limit?: number;
  usuarioId?: string;
  vagaId?: string;
};

export async function listCandidaturas({
  page = 1,
  limit = 100,
  usuarioId,
  vagaId,
}: ListCandidaturasParams = {}) {
  const response = await api.get<{
    data: Candidatura[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>('/candidaturas', {
    params: {
      page,
      limit,
      ...(usuarioId ? { usuarioId } : {}),
      ...(vagaId ? { vagaId } : {}),
    },
  });

  return response.data;
}

export async function createCandidatura(usuarioId: string, vagaId: string) {
  const response = await api.post<Candidatura>('/candidaturas', { usuarioId, vagaId });
  return response.data;
}
