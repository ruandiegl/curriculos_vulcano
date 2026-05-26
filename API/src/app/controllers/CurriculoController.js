import { CurriculoRepository } from '../Repositories/CurriculoRepository.js';
import { getPagination, paginatedResponse } from '../DTO/pagination.js';
import {
  atuacaoSchema,
  curriculoSchema,
  curriculoUpdateSchema,
  cursoSchema,
  escolaridadeSchema,
  experienciaSchema,
} from '../validators/curriculoValidator.js';

const repository = new CurriculoRepository();

function canAccessCurriculo(req, curriculo) {
  return req.userTipo === 'admin' || curriculo.usuarioId === req.userId;
}

async function findCurrentUserCurriculo(req, res) {
  const curriculo = await repository.findByUsuarioId(req.userId);

  if (!curriculo) {
    res.status(404).json({ message: 'Crie seu curriculo antes de cadastrar este item.' });
    return null;
  }

  return curriculo;
}

export class CurriculoController {
  async index(req, res) {
    const { page, limit, skip, take } = getPagination(req.query);
    const [data, total] = await Promise.all([
      repository.list({ query: req.query, skip, take }),
      repository.count(req.query),
    ]);

    return res.json(paginatedResponse({ data, total, page, limit }));
  }

  async show(req, res) {
    const curriculo = await repository.findById(req.params.id);

    if (!curriculo) {
      return res.status(404).json({ message: 'Currículo não encontrado.' });
    }

    if (!canAccessCurriculo(req, curriculo)) {
      return res.status(403).json({ message: 'Acesso permitido apenas ao dono do curriculo.' });
    }

    return res.json(curriculo);
  }

  async me(req, res) {
    const curriculo = await repository.findByUsuarioId(req.userId);

    if (!curriculo) {
      return res.status(404).json({ message: 'Curriculo nao encontrado para este usuario.' });
    }

    return res.json(curriculo);
  }

  async store(req, res) {
    const payload = curriculoSchema.parse({
      ...req.body,
      usuarioId: req.userTipo === 'admin' ? req.body.usuarioId : req.userId,
    });
    const curriculo = await repository.create(payload);
    return res.status(201).json(curriculo);
  }

  async update(req, res) {
    const current = await repository.findById(req.params.id);

    if (!current) {
      return res.status(404).json({ message: 'Curriculo nao encontrado.' });
    }

    if (!canAccessCurriculo(req, current)) {
      return res.status(403).json({ message: 'Acesso permitido apenas ao dono do curriculo.' });
    }

    const payload = curriculoUpdateSchema.parse(req.body);
    const curriculo = await repository.update(req.params.id, payload);
    return res.json(curriculo);
  }

  async storeCurso(req, res) {
    const curriculo = await findCurrentUserCurriculo(req, res);
    if (!curriculo) return undefined;

    const payload = cursoSchema.parse(req.body);
    const updated = await repository.appendRelation(curriculo.id, 'cursos', payload);
    return res.status(201).json(updated);
  }

  async storeExperiencia(req, res) {
    const curriculo = await findCurrentUserCurriculo(req, res);
    if (!curriculo) return undefined;

    const payload = experienciaSchema.parse(req.body);
    const updated = await repository.appendRelation(curriculo.id, 'experiencias', payload);
    return res.status(201).json(updated);
  }

  async storeEscolaridade(req, res) {
    const curriculo = await findCurrentUserCurriculo(req, res);
    if (!curriculo) return undefined;

    const payload = escolaridadeSchema.parse(req.body);
    const updated = await repository.appendRelation(curriculo.id, 'escolaridades', payload);
    return res.status(201).json(updated);
  }

  async storeAtuacao(req, res) {
    const curriculo = await findCurrentUserCurriculo(req, res);
    if (!curriculo) return undefined;

    const payload = atuacaoSchema.parse(req.body);
    const updated = await repository.appendRelation(curriculo.id, 'atuacoes', payload);
    return res.status(201).json(updated);
  }

  async delete(req, res) {
    await repository.delete(req.params.id);
    return res.status(204).send();
  }

}
