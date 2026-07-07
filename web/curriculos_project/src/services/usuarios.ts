import { api } from './api';
import type { Usuario, UsuarioTipo, UsuariosResponse } from '../types/usuario';

export type UsuarioScope = 'createdByMe' | 'admins' | 'usuarios' | 'all';

export type UsuarioPayload = {
  nome: string;
  email: string;
  password?: string;
  cpf?: string | null;
  tipo: UsuarioTipo;
  possuiCurriculo?: boolean;
};

type ListUsuariosParams = {
  page: number;
  limit: number;
  search?: string;
  scope?: UsuarioScope;
};

export async function listUsuarios({ page, limit, search, scope }: ListUsuariosParams) {
  const response = await api.get<UsuariosResponse>('/usuarios', {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(scope ? { scope } : {}),
    },
  });

  return response.data;
}

export async function createUsuario(payload: UsuarioPayload) {
  const response = await api.post<Usuario>('/usuarios', payload);
  return response.data;
}

export async function updateUsuario(id: string, payload: Partial<UsuarioPayload>) {
  const response = await api.put<Usuario>(`/usuarios/${id}`, payload);
  return response.data;
}

export async function deleteUsuario(id: string) {
  await api.delete(`/usuarios/${id}`);
}
