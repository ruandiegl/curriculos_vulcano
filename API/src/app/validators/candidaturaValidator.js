import { z } from 'zod';

export const candidaturaSchema = z.object({
  usuarioId: z.string().uuid(),
  vagaId: z.string().uuid(),
});
