import { z } from 'zod';
import { emailSchema } from './emailValidator.js';

export const usuarioTipoSchema = z.enum(['usuario', 'admin', 'superAdmin']);

const passwordSchema = z.string()
  .min(8, 'A senha deve ter no minimo 8 caracteres.')
  .regex(/[A-Za-z]/, 'A senha deve conter pelo menos uma letra.')
  .regex(/\d/, 'A senha deve conter pelo menos um numero.')
  .optional()
  .nullable();

export const usuarioAdminSchema = z.object({
  firebaseUid: z.string().min(1).optional(),
  nome: z.string().min(2),
  email: emailSchema,
  password: passwordSchema,
  cpf: z.string().optional().nullable(),
  tipo: usuarioTipoSchema.default('usuario'),
  possuiCurriculo: z.boolean().optional(),
  dataCheck: z.coerce.date().optional().nullable(),
  horaCheck: z.string().optional().nullable(),
});

export const usuarioAdminUpdateSchema = usuarioAdminSchema.partial();
export const usuarioUserUpdateSchema = usuarioAdminSchema.pick({
  nome: true,
  email: true,
  cpf: true,
}).partial();
export const usuarioSchema = usuarioAdminSchema;
export const usuarioUpdateSchema = usuarioAdminUpdateSchema;
