import { prisma } from '../../databases/prisma.js';
import { buildVagaWhere } from '../DTO/vagaSearch.js';

export class VagaRepository {
  list({ query, skip, take }) {
    return prisma.vaga.findMany({
      where: buildVagaWhere(query),
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { candidaturas: true },
    });
  }

  count(query) {
    return prisma.vaga.count({ where: buildVagaWhere(query) });
  }

  findById(id) {
    return prisma.vaga.findUnique({
      where: { id },
      include: {
        candidaturas: {
          include: {
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
        },
      },
    });
  }

  create(data) {
    return prisma.vaga.create({ data });
  }

  update(id, data) {
    return prisma.vaga.update({ where: { id }, data });
  }

  delete(id) {
    return prisma.vaga.delete({ where: { id } });
  }
}
