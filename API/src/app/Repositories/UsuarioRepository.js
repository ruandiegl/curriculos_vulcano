import { prisma } from '../../databases/prisma.js';

function normalizeUsuario(data) {
  return {
    ...data,
    horaCheck: data.horaCheck ? new Date(`1970-01-01T${data.horaCheck}`) : data.horaCheck,
  };
}

export class UsuarioRepository {
  list({ where, skip, take }) {
    return prisma.usuario.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { curriculos: true },
    });
  }

  count(where) {
    return prisma.usuario.count({ where });
  }

  findById(id) {
    return prisma.usuario.findUnique({
      where: { id },
      include: {
        curriculos: true,
        candidaturas: { include: { vaga: true } },
        novidades: { include: { vaga: true } },
      },
    });
  }

  create(data) {
    return prisma.usuario.create({ data: normalizeUsuario(data) });
  }

  update(id, data) {
    return prisma.usuario.update({
      where: { id },
      data: normalizeUsuario(data),
    });
  }

  delete(id) {
    return prisma.usuario.delete({ where: { id } });
  }
}
