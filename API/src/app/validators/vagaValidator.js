import { z } from 'zod';

export const vagaSchema = z.object({
  titulo: z.string().min(2),
  descricao: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  estado: z.string().optional().nullable(),
  ativa: z.boolean().optional(),
});

export const vagaUpdateSchema = vagaSchema.partial();
