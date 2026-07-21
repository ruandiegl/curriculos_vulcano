export function normalizeSearchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function hasSearchText(value) {
  return normalizeSearchText(value).length > 0;
}

function getTokenVariants(token) {
  const variants = new Set([token]);

  if (token.endsWith('icos')) {
    variants.add(`${token.slice(0, -4)}icas`);
  } else if (token.endsWith('icas')) {
    variants.add(`${token.slice(0, -4)}icos`);
  } else if (token.endsWith('ico')) {
    variants.add(`${token.slice(0, -3)}ica`);
  } else if (token.endsWith('ica')) {
    variants.add(`${token.slice(0, -3)}ico`);
  }

  return [...variants];
}

function tokenMatches(value, token) {
  return getTokenVariants(token).some((variant) => value.includes(variant));
}

export function textIncludes(value, search) {
  const normalizedSearch = normalizeSearchText(search);

  if (!normalizedSearch) {
    return true;
  }

  const normalizedValue = normalizeSearchText(value);

  if (normalizedValue.includes(normalizedSearch)) {
    return true;
  }

  return normalizedSearch.split(/\s+/).filter(Boolean).every((token) => tokenMatches(normalizedValue, token));
}
