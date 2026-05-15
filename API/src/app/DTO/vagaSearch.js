export function buildVagaWhere(query) {
  const search = query.search?.trim();
  const ativa = query.ativa;

  return {
    ...(ativa === 'true' || ativa === 'false' ? { ativa: ativa === 'true' } : {}),
    ...(search
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
