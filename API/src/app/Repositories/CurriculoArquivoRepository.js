import { prisma } from '../../databases/prisma.js';

export class CurriculoArquivoRepository {
  findCurriculoById(curriculoId) {
    return prisma.curriculo.findUnique({
      where: { id: curriculoId },
      select: { id: true },
    });
  }

  listByCurriculo(curriculoId) {
    return prisma.curriculoArquivo.findMany({
      where: { curriculoId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id) {
    return prisma.curriculoArquivo.findUnique({ where: { id } });
  }

  create(data) {
    return prisma.curriculoArquivo.create({ data });
  }

  delete(id) {
    return prisma.curriculoArquivo.delete({ where: { id } });
  }
}
