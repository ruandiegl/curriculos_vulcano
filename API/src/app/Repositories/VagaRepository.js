import { prisma } from '../../databases/prisma.js';
import { buildVagaWhere, filterVagasByText, hasVagaTextFilters } from '../DTO/vagaSearch.js';

export class VagaRepository {
  async list({ query, skip, take }) {
    if (hasVagaTextFilters(query)) {
      const data = await prisma.vaga.findMany({
        where: buildVagaWhere(query, { includeTextFilters: false }),
        orderBy: { createdAt: 'desc' },
        include: { candidaturas: true },
      });

      return filterVagasByText(query, data).slice(skip, skip + take);
    }

    return prisma.vaga.findMany({
      where: buildVagaWhere(query),
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { candidaturas: true },
    });
  }

  async count(query) {
    if (hasVagaTextFilters(query)) {
      const data = await prisma.vaga.findMany({
        where: buildVagaWhere(query, { includeTextFilters: false }),
        orderBy: { createdAt: 'desc' },
        include: { candidaturas: true },
      });

      return filterVagasByText(query, data).length;
    }

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
