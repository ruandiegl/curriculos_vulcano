export type UsuarioTipo = 'usuario' | 'admin' | 'superAdmin';

export type Usuario = {
  id: string;
  firebaseUid?: string;
  nome: string;
  email: string;
  cpf?: string | null;
  tipo: UsuarioTipo;
  createdById?: string | null;
  possuiCurriculo?: boolean;
  dataCheck?: string | null;
  horaCheck?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: Pick<Usuario, 'id' | 'nome' | 'email' | 'tipo'> | null;
};

export type UsuariosResponse = {
  data: Usuario[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
