import { prisma } from '../../databases/prisma.js';

const usuarioSafeSelect = {
  id: true,
  firebaseUid: true,
  nome: true,
  email: true,
  cpf: true,
  tipo: true,
  possuiCurriculo: true,
  dataCheck: true,
  horaCheck: true,
  createdAt: true,
  updatedAt: true,
};

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
      select: {
        ...usuarioSafeSelect,
        curriculos: true,
      },
    });
  }

  count(where) {
    return prisma.usuario.count({ where });
  }

  findById(id) {
    return prisma.usuario.findUnique({
      where: { id },
      select: {
        ...usuarioSafeSelect,
        curriculos: true,
        candidaturas: { include: { vaga: true } },
        novidades: { include: { vaga: true } },
      },
    });
  }

  findByEmailWithPassword(email) {
    return prisma.usuario.findUnique({ where: { email } });
  }

  findRecoveryCandidateByEmail(email) {
    return prisma.usuario.findUnique({
      where: { email },
      include: {
        curriculos: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  create(data) {
    return prisma.usuario.create({
      data: normalizeUsuario(data),
      select: usuarioSafeSelect,
    });
  }

  update(id, data) {
    return prisma.usuario.update({
      where: { id },
      data: normalizeUsuario(data),
      select: usuarioSafeSelect,
    });
  }

  updatePassword(id, passHash) {
    return prisma.usuario.update({
      where: { id },
      data: { passHash },
      select: usuarioSafeSelect,
    });
  }

  delete(id) {
    return prisma.usuario.delete({ where: { id } });
  }
}
