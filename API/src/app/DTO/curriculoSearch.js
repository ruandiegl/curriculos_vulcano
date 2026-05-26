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

export function buildCurriculoWhere(query) {
  const search = query.search?.trim();
  const status = query.status?.trim();
  const cidade = query.cidade?.trim();
  const estado = query.estado?.trim();
  const atuacao = query.atuacao?.trim();
  const cursoAtivo = query.cursoAtivo;

  const and = [];

  if (status) {
    and.push({ status });
  }

  if (cidade || estado) {
    and.push({
      enderecos: {
        some: {
          ...(cidade ? { cidade: { contains: cidade, mode: 'insensitive' } } : {}),
          ...(estado ? { estado: { contains: estado, mode: 'insensitive' } } : {}),
        },
      },
    });
  }

  if (atuacao) {
    and.push({
      atuacoes: {
        some: { nome: { contains: atuacao, mode: 'insensitive' } },
      },
    });
  }

  if (cursoAtivo === 'true' || cursoAtivo === 'false') {
    and.push({ cursoAtivo: cursoAtivo === 'true' });
  }

  if (search) {
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
        { escolaridades: { some: { escola: { contains: search, mode: 'insensitive' } } } },
      ],
    });
  }

  return and.length ? { AND: and } : {};
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
