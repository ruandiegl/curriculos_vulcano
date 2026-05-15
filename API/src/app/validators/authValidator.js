import { z } from 'zod';

export const registerSchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  firebaseUid: z.string().min(1).optional(),
  cpf: z.string().optional().nullable(),
  tipo: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
