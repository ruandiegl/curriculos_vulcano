import { z } from 'zod';
import { emailSchema } from './emailValidator.js';

const passwordSchema = z.string()
  .min(8, 'A senha deve ter no minimo 8 caracteres.')
  .regex(/[A-Za-z]/, 'A senha deve conter pelo menos uma letra.')
  .regex(/\d/, 'A senha deve conter pelo menos um numero.');

export const registerSchema = z.object({
  nome: z.string().min(2),
  email: emailSchema,
  password: passwordSchema,
  firebaseUid: z.string().min(1).optional(),
  cpf: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const recoveryMatchSchema = z.object({
  email: emailSchema,
  nome: z.string().trim().min(2, 'Informe seu nome.'),
  cpf: z.string().trim().min(11, 'Informe seu CPF.'),
  nascimento: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe a data no formato AAAA-MM-DD.'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const setupPasswordSchema = resetPasswordSchema;
