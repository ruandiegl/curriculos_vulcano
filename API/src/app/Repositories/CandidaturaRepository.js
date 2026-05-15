import { prisma } from '../../databases/prisma.js';

export class CandidaturaRepository {
  list({ skip, take, usuarioId, vagaId }) {
    return prisma.candidatura.findMany({
      where: {
        ...(usuarioId ? { usuarioId } : {}),
        ...(vagaId ? { vagaId } : {}),
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        vaga: true,
        usuario: {
          include: {
            curriculos: {
              include: {
                enderecos: true,
                atuacoes: true,
                cursos: true,
                experiencias: true,
                escolaridades: true,
              },
            },
          },
        },
      },
    });
  }

  count({ usuarioId, vagaId }) {
    return prisma.candidatura.count({
      where: {
        ...(usuarioId ? { usuarioId } : {}),
        ...(vagaId ? { vagaId } : {}),
      },
    });
  }

  create(data) {
    return prisma.candidatura.create({
      data,
      include: { vaga: true, usuario: true },
    });
  }

  delete(id) {
    return prisma.candidatura.delete({ where: { id } });
  }
}
