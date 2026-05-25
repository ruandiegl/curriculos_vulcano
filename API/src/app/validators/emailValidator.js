import { z } from 'zod';

export const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)(?!.*\.@)[A-Za-z0-9!#$%&'*+\/=?^_`{|}~.-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

export const emailSchema = z
  .string()
  .trim()
  .max(254, 'Email deve ter no maximo 254 caracteres.')
  .refine((email) => {
    const [localPart] = email.split('@');
    return Boolean(localPart) && localPart.length <= 64;
  }, 'Email deve ter no maximo 64 caracteres antes do @.')
  .refine((email) => EMAIL_REGEX.test(email), 'Email invalido.')
  .transform((email) => email.toLowerCase());
