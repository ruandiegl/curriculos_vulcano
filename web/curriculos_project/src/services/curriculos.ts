import { api } from './api';
import type { Curriculo, CurriculoRelation, CurriculoStatus, CurriculosResponse } from '../types/curriculo';

export const PENDING_CURRICULUM_STORAGE_KEY = 'pendingCurriculumId';

type ListCurriculosParams = {
  page: number;
  limit: number;
  search?: string;
  status?: CurriculoStatus;
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
  cursos: CursoPayload[];
  experiencias: ExperienciaPayload[];
  escolaridades: EscolaridadePayload[];
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

export type CursoPayload = {
  nome: string;
  instituicao?: string | null;
  cargaHoraria?: string | null;
};

export type ExperienciaPayload = {
  empresa: string;
  cargo?: string | null;
  dataInicio?: string | null;
  dataTermino?: string | null;
  funcoes?: string | null;
};

export type EscolaridadePayload = {
  curso?: string | null;
  escola: string;
  dataInicio?: string | null;
  dataTermino?: string | null;
};

export type CurriculoCreatePayload = Omit<CurriculoUpdatePayload, 'nome'> & {
  nome: string;
};

export async function listCurriculos({ page, limit, search, status }: ListCurriculosParams) {
  const response = await api.get<CurriculosResponse>('/curriculos', {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
    },
  });

  return response.data;
}

export async function getCurriculo(id: string) {
  const response = await api.get<Curriculo>(`/curriculos/${id}`);
  return response.data;
}

export async function getMeuCurriculo() {
  const response = await api.get<Curriculo>('/curriculos/me');
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

export async function downloadCurriculoArquivo(curriculoId: string, arquivoId: string) {
  const response = await api.get<Blob>(`/curriculos/${curriculoId}/pdf/${arquivoId}/download`, {
    responseType: 'blob',
  });

  return response.data;
}

export async function listCurriculoArquivos(curriculoId: string) {
  const response = await api.get<CurriculoRelation[]>(`/curriculos/${curriculoId}/pdf`);
  return response.data;
}

export async function uploadCurriculoArquivo(curriculoId: string, arquivo: File) {
  const formData = new FormData();
  formData.append('arquivo', arquivo);

  const response = await api.post<CurriculoRelation>(`/curriculos/${curriculoId}/pdf`, formData);
  return response.data;
}

export async function deleteCurriculoArquivo(curriculoId: string, arquivoId: string) {
  await api.delete(`/curriculos/${curriculoId}/pdf/${arquivoId}`);
}

export async function addCurso(payload: CursoPayload) {
  const response = await api.post<Curriculo>('/curriculos/me/cursos', payload);
  return response.data;
}

export async function addExperiencia(payload: ExperienciaPayload) {
  const response = await api.post<Curriculo>('/curriculos/me/experiencias', payload);
  return response.data;
}

export async function addEscolaridade(payload: EscolaridadePayload) {
  const response = await api.post<Curriculo>('/curriculos/me/escolaridades', payload);
  return response.data;
}

export async function addAtuacao(payload: AtuacaoPayload) {
  const response = await api.post<Curriculo>('/curriculos/me/atuacoes', payload);
  return response.data;
}
