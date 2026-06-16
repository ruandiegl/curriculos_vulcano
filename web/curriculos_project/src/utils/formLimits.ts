export const textLimits = {
  short: 60,
  medium: 120,
  long: 300,
  search: 100,
  state: 2,
  number: 20,
  cep: 9,
  phone: 15,
  cpf: 14,
  rg: 14,
  cnh: 11,
};

export const MIN_DATE = '1900-01-01';
export const MAX_DATE = '2100-12-31';

export function limitText(value: string, maxLength: number) {
  return value.slice(0, maxLength);
}

export function normalizeDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '';
}

export function isValidDateInput(value: string, options?: { allowFuture?: boolean }) {
  if (!value) {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  if (value < MIN_DATE || value > MAX_DATE) {
    return false;
  }

  if (!options?.allowFuture) {
    const today = new Date().toISOString().slice(0, 10);
    return value <= today;
  }

  return true;
}
