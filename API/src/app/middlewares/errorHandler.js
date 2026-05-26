import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export function errorHandler(error, req, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Dados invalidos.',
      issues: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (error.name === 'MulterError') {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'O arquivo deve ter no maximo 10 MB.', code: error.code });
    }

    return res.status(400).json({ message: 'Arquivo invalido.', code: error.code });
  }

  if (
    error.message === 'Apenas arquivos PDF sao permitidos.' ||
    error.message === 'Apenas arquivos PDF sÃ£o permitidos.' ||
    error.message === 'O arquivo enviado nao e um PDF valido.'
  ) {
    return res.status(400).json({ message: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        message: 'Registro duplicado.',
        target: error.meta?.target,
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Registro nao encontrado.' });
    }
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}
