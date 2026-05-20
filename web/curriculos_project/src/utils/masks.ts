export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function formatCpf(value?: string | null) {
  return onlyDigits(value ?? '')
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

export function formatRg(value?: string | null) {
  return onlyDigits(value ?? '')
    .slice(0, 9)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

export function formatPhone(value?: string | null) {
  const digits = onlyDigits(value ?? '').slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : '';
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatCnh(value?: string | null) {
  return onlyDigits(value ?? '').slice(0, 11);
}

export function valueOrDash(value?: string | null) {
  return value || '-';
}

