const LIST_TEXT_LIMIT = 56;

function abbreviateText(value, limit = LIST_TEXT_LIMIT) {
  if (typeof value !== 'string') {
    return value;
  }

  const text = value.replace(/\s+/g, ' ').trim();

  if (text.length <= limit) {
    return text;
  }

  const contentLimit = Math.max(limit - 3, 1);
  const content = text.slice(0, contentLimit).trimEnd();
  const lastSpace = content.lastIndexOf(' ');
  const readableContent = lastSpace > contentLimit * 0.6 ? content.slice(0, lastSpace) : content;

  return `${readableContent}...`;
}

export function abbreviateCurriculosForList(curriculos) {
  return curriculos.map((curriculo) => {
    const atuacoes = curriculo.atuacoes ?? [];

    if (!atuacoes.length) {
      return curriculo;
    }

    const resumo = atuacoes
      .map((atuacao) => atuacao.nome)
      .filter(Boolean)
      .join(', ');

    return {
      ...curriculo,
      atuacoes: resumo
        ? [{ ...atuacoes[0], nome: abbreviateText(resumo) }]
        : atuacoes,
    };
  });
}

export function abbreviateCurriculoForList(curriculo) {
  return abbreviateCurriculosForList([curriculo])[0];
}

export function abbreviateCandidaturasForList(candidaturas) {
  return candidaturas.map((candidatura) => ({
    ...candidatura,
    usuario: candidatura.usuario
      ? {
          ...candidatura.usuario,
          curriculos: (candidatura.usuario.curriculos ?? []).map(abbreviateCurriculoForList),
        }
      : candidatura.usuario,
  }));
}
