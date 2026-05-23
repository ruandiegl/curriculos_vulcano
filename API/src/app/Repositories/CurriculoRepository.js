import { prisma } from '../../databases/prisma.js';
import { buildCurriculoWhere, curriculoInclude } from '../DTO/curriculoSearch.js';

const relationKeys = ['enderecos', 'atuacoes', 'cursos', 'experiencias', 'escolaridades'];
const relationDelegate = {
  enderecos: 'endereco',
  atuacoes: 'atuacao',
  cursos: 'curso',
  experiencias: 'experiencia',
  escolaridades: 'escolaridade',
};

function splitCurriculoPayload(payload) {
  const data = { ...payload };
  const relations = {};

  for (const key of relationKeys) {
    if (key in data) {
      relations[key] = data[key] ?? [];
      delete data[key];
    }
  }

  return { data, relations };
}

function relationCreate(relations, key) {
  if (!(key in relations)) {
    return undefined;
  }

  return { create: relations[key] };
}

export class CurriculoRepository {
  list({ query, skip, take }) {
    return prisma.curriculo.findMany({
      where: buildCurriculoWhere(query),
      skip,
      take,
      orderBy: [{ createdAt: 'desc' }],
      include: curriculoInclude,
    });
  }

  count(query) {
    return prisma.curriculo.count({ where: buildCurriculoWhere(query) });
  }

  findById(id) {
    return prisma.curriculo.findUnique({
      where: { id },
      include: curriculoInclude,
    });
  }

  findByUsuarioId(usuarioId) {
    return prisma.curriculo.findFirst({
      where: { usuarioId },
      orderBy: [{ createdAt: 'desc' }],
      include: curriculoInclude,
    });
  }

  async create(payload) {
    const { data, relations } = splitCurriculoPayload(payload);

    return prisma.$transaction(async (tx) => {
      const curriculo = await tx.curriculo.create({
        data: {
          ...data,
          enderecos: relationCreate(relations, 'enderecos'),
          atuacoes: relationCreate(relations, 'atuacoes'),
          cursos: relationCreate(relations, 'cursos'),
          experiencias: relationCreate(relations, 'experiencias'),
          escolaridades: relationCreate(relations, 'escolaridades'),
        },
        include: curriculoInclude,
      });

      if (data.usuarioId) {
        await tx.usuario.update({
          where: { id: data.usuarioId },
          data: { possuiCurriculo: true },
        });
      }

      return curriculo;
    });
  }

  async update(id, payload) {
    const { data, relations } = splitCurriculoPayload(payload);

    return prisma.$transaction(async (tx) => {
      for (const key of relationKeys) {
        if (key in relations) {
          await tx[relationDelegate[key]].deleteMany({ where: { curriculoId: id } });
        }
      }

      return tx.curriculo.update({
        where: { id },
        data: {
          ...data,
          ...(relations.enderecos ? { enderecos: { create: relations.enderecos } } : {}),
          ...(relations.atuacoes ? { atuacoes: { create: relations.atuacoes } } : {}),
          ...(relations.cursos ? { cursos: { create: relations.cursos } } : {}),
          ...(relations.experiencias ? { experiencias: { create: relations.experiencias } } : {}),
          ...(relations.escolaridades ? { escolaridades: { create: relations.escolaridades } } : {}),
        },
        include: curriculoInclude,
      });
    });
  }

  async appendRelation(id, key, payload) {
    return prisma.$transaction(async (tx) => {
      await tx[relationDelegate[key]].create({
        data: {
          ...payload,
          curriculoId: id,
        },
      });

      return tx.curriculo.findUnique({
        where: { id },
        include: curriculoInclude,
      });
    });
  }

  async delete(id) {
    return prisma.$transaction(async (tx) => {
      const curriculo = await tx.curriculo.findUnique({ where: { id } });
      const deleted = await tx.curriculo.delete({ where: { id } });

      if (curriculo?.usuarioId) {
        const remaining = await tx.curriculo.count({ where: { usuarioId: curriculo.usuarioId } });
        await tx.usuario.update({
          where: { id: curriculo.usuarioId },
          data: { possuiCurriculo: remaining > 0 },
        });
      }

      return deleted;
    });
  }
}
