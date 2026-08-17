import { z } from 'zod';

export const candidaturaSchema = z.object({
  usuarioId: z.string().uuid().optional(),
  vagaId: z.string().uuid(),
});
