import { z } from 'zod';
import { emailSchema } from './emailValidator.js';

export const usuarioSchema = z.object({
  firebaseUid: z.string().min(1),
  nome: z.string().min(2),
  email: emailSchema,
  cpf: z.string().optional().nullable(),
  possuiCurriculo: z.boolean().optional(),
  dataCheck: z.coerce.date().optional().nullable(),
  horaCheck: z.string().optional().nullable(),
});

export const usuarioUpdateSchema = usuarioSchema.partial();
