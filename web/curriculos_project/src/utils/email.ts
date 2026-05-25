export const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)(?!.*\.@)[A-Za-z0-9!#$%&'*+\/=?^_`{|}~.-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  const normalized = normalizeEmail(email);
  const [localPart] = normalized.split('@');

  return normalized.length <= 254 && Boolean(localPart) && localPart.length <= 64 && EMAIL_REGEX.test(normalized);
}
