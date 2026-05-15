import { z } from 'zod';

export const usuarioSchema = z.object({
  firebaseUid: z.string().min(1),
  nome: z.string().min(2),
  email: z.string().email(),
  cpf: z.string().optional().nullable(),
  possuiCurriculo: z.boolean().optional(),
  dataCheck: z.coerce.date().optional().nullable(),
  horaCheck: z.string().optional().nullable(),
});

export const usuarioUpdateSchema = usuarioSchema.partial();
