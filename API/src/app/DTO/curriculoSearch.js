import { hasSearchText, textIncludes } from '../utils/textSearch.js';

const searchableFields = [
  'nome',
  'email',
  'cpf',
  'rg',
  'celular',
  'telefone',
  'estadoCivil',
  'categoriaCnh',
  'numeroCnh',
];

export function buildCurriculoWhere(query, { includeTextFilters = true } = {}) {
  const search = query.search?.trim();
  const status = query.status?.trim();
  const cidade = query.cidade?.trim();
  const estado = query.estado?.trim();
  const atuacao = query.atuacao?.trim();
  const cursoAtivo = query.cursoAtivo;
  const possuiCnh = query.possuiCnh;

  const and = [];

  if (status) {
    and.push({ status });
  }

  if (includeTextFilters && (cidade || estado)) {
    and.push({
      enderecos: {
        some: {
          ...(cidade ? { cidade: { contains: cidade, mode: 'insensitive' } } : {}),
          ...(estado ? { estado: { contains: estado, mode: 'insensitive' } } : {}),
        },
      },
    });
  }

  if (includeTextFilters && atuacao) {
    and.push({
      atuacoes: {
        some: { nome: { contains: atuacao, mode: 'insensitive' } },
      },
    });
  }

  if (cursoAtivo === 'true' || cursoAtivo === 'false') {
    and.push({ cursoAtivo: cursoAtivo === 'true' });
  }

  if (possuiCnh === 'true' || possuiCnh === 'false') {
    and.push({ possuiCnh: possuiCnh === 'true' });
  }

  if (includeTextFilters && search) {
    and.push({
      OR: [
        ...searchableFields.map((field) => ({
          [field]: { contains: search, mode: 'insensitive' },
        })),
        { usuario: { nome: { contains: search, mode: 'insensitive' } } },
        { usuario: { email: { contains: search, mode: 'insensitive' } } },
        { enderecos: { some: { cidade: { contains: search, mode: 'insensitive' } } } },
        { enderecos: { some: { bairro: { contains: search, mode: 'insensitive' } } } },
        { atuacoes: { some: { nome: { contains: search, mode: 'insensitive' } } } },
        { cursos: { some: { nome: { contains: search, mode: 'insensitive' } } } },
        { cursos: { some: { instituicao: { contains: search, mode: 'insensitive' } } } },
        { experiencias: { some: { empresa: { contains: search, mode: 'insensitive' } } } },
        { experiencias: { some: { cargo: { contains: search, mode: 'insensitive' } } } },
        { experiencias: { some: { funcoes: { contains: search, mode: 'insensitive' } } } },
        { escolaridades: { some: { escola: { contains: search, mode: 'insensitive' } } } },
        { escolaridades: { some: { curso: { contains: search, mode: 'insensitive' } } } },
      ],
    });
  }

  return and.length ? { AND: and } : {};
}

export function hasCurriculoTextFilters(query) {
  return [query.search, query.cidade, query.estado, query.atuacao].some(hasSearchText);
}

function someRelationMatches(items, field, search) {
  return Array.isArray(items) && items.some((item) => textIncludes(item?.[field], search));
}

function matchesCurriculoSearch(curriculo, search) {
  const directValues = searchableFields.map((field) => curriculo[field]);
  const relationValues = [
    curriculo.usuario?.nome,
    curriculo.usuario?.email,
    ...(curriculo.enderecos ?? []).flatMap((endereco) => [endereco.cidade, endereco.bairro, endereco.estado, endereco.cep]),
    ...(curriculo.atuacoes ?? []).map((atuacao) => atuacao.nome),
    ...(curriculo.cursos ?? []).flatMap((curso) => [curso.nome, curso.instituicao, curso.cargaHoraria]),
    ...(curriculo.experiencias ?? []).flatMap((experiencia) => [
      experiencia.empresa,
      experiencia.cargo,
      experiencia.funcoes,
    ]),
    ...(curriculo.escolaridades ?? []).flatMap((escolaridade) => [escolaridade.escola, escolaridade.curso]),
  ];

  return [...directValues, ...relationValues].some((value) => textIncludes(value, search));
}

export function filterCurriculosByText(query, curriculos) {
  const search = query.search?.trim();
  const cidade = query.cidade?.trim();
  const estado = query.estado?.trim();
  const atuacao = query.atuacao?.trim();

  return curriculos.filter((curriculo) => {
    if (hasSearchText(cidade) && !someRelationMatches(curriculo.enderecos, 'cidade', cidade)) {
      return false;
    }

    if (hasSearchText(estado) && !someRelationMatches(curriculo.enderecos, 'estado', estado)) {
      return false;
    }

    if (hasSearchText(atuacao) && !someRelationMatches(curriculo.atuacoes, 'nome', atuacao)) {
      return false;
    }

    return !hasSearchText(search) || matchesCurriculoSearch(curriculo, search);
  });
}

export const curriculoInclude = {
  usuario: true,
  enderecos: true,
  atuacoes: { orderBy: [{ prioridade: 'asc' }, { createdAt: 'asc' }] },
  cursos: true,
  experiencias: true,
  escolaridades: true,
  arquivos: { orderBy: { createdAt: 'desc' }, take: 1 },
};
