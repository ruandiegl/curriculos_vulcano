export type CurriculoStatus = 'visualizado' | 'entrevistado' | 'selecionado' | 'desconsiderado';

export type CurriculoRelation = {
  id: string;
  nome?: string | null;
  prioridade?: number | null;
  instituicao?: string | null;
  empresa?: string | null;
  cargo?: string | null;
  curso?: string | null;
  cargaHoraria?: string | null;
  dataInicio?: string | null;
  dataTermino?: string | null;
  funcoes?: string | null;
  escola?: string | null;
  cidade?: string | null;
  estado?: string | null;
  bairro?: string | null;
  rua?: string | null;
  numero?: string | null;
  cep?: string | null;
  complemento?: string | null;
  nomeOriginal?: string | null;
  createdAt?: string | null;
};

export type Curriculo = {
  id: string;
  nome: string;
  email?: string | null;
  cpf?: string | null;
  rg?: string | null;
  nascimento?: string | null;
  estadoCivil?: string | null;
  celular?: string | null;
  telefone?: string | null;
  possuiCnh?: boolean;
  categoriaCnh?: string | null;
  numeroCnh?: string | null;
  vencimentoCnh?: string | null;
  cursoAtivo?: boolean;
  status: CurriculoStatus;
  createdAt?: string;
  updatedAt?: string;
  enderecos?: CurriculoRelation[];
  atuacoes?: CurriculoRelation[];
  cursos?: CurriculoRelation[];
  experiencias?: CurriculoRelation[];
  escolaridades?: CurriculoRelation[];
  arquivos?: CurriculoRelation[];
};

export type CurriculosResponse = {
  data: Curriculo[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
