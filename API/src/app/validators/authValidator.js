import { z } from 'zod';
import { emailSchema } from './emailValidator.js';

export const registerSchema = z.object({
  nome: z.string().min(2),
  email: emailSchema,
  password: z.string().min(6),
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

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});
