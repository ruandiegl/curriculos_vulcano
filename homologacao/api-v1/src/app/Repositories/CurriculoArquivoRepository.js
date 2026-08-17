import { prisma } from '../../databases/prisma.js';

export class CurriculoArquivoRepository {
  findCurriculoById(curriculoId) {
    return prisma.curriculo.findUnique({
      where: { id: curriculoId },
      select: { id: true, usuarioId: true },
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

  replaceForCurriculo(curriculoId, data) {
    return prisma.$transaction(async (tx) => {
      await tx.curriculoArquivo.deleteMany({ where: { curriculoId } });
      return tx.curriculoArquivo.create({ data });
    });
  }

  delete(id) {
    return prisma.curriculoArquivo.delete({ where: { id } });
  }

  deleteByCurriculo(curriculoId) {
    return prisma.curriculoArquivo.deleteMany({ where: { curriculoId } });
  }
}
