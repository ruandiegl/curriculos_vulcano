import type { Curriculo } from './curriculo';

export type VagaUsuario = {
  id: string;
  nome: string;
  email: string;
  curriculos?: Curriculo[];
};

export type Candidatura = {
  id: string;
  usuarioId: string;
  vagaId: string;
  createdAt: string;
  usuario?: VagaUsuario;
};

export type Vaga = {
  id: string;
  titulo: string;
  descricao?: string | null;
  cidade?: string | null;
  estado?: string | null;
  ativa: boolean;
  createdAt?: string;
  updatedAt?: string;
  candidaturas?: Candidatura[];
};

export type VagasResponse = {
  data: Vaga[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
