import { hasSearchText, textIncludes } from '../utils/textSearch.js';

const searchableFields = ['titulo', 'descricao', 'cidade', 'estado'];

export function buildVagaWhere(query, { includeTextFilters = true } = {}) {
  const search = query.search?.trim();
  const ativa = query.ativa;

  return {
    ...(ativa === 'true' || ativa === 'false' ? { ativa: ativa === 'true' } : {}),
    ...(includeTextFilters && search
      ? {
          OR: [
            { titulo: { contains: search, mode: 'insensitive' } },
            { descricao: { contains: search, mode: 'insensitive' } },
            { cidade: { contains: search, mode: 'insensitive' } },
            { estado: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };
}

export function hasVagaTextFilters(query) {
  return hasSearchText(query.search);
}

export function filterVagasByText(query, vagas) {
  const search = query.search?.trim();

  if (!hasSearchText(search)) {
    return vagas;
  }

  return vagas.filter((vaga) => searchableFields.some((field) => textIncludes(vaga[field], search)));
}
