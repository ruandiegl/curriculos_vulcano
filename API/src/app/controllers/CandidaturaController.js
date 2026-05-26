import { CandidaturaRepository } from '../Repositories/CandidaturaRepository.js';
import { getPagination, paginatedResponse } from '../DTO/pagination.js';
import { candidaturaSchema } from '../validators/candidaturaValidator.js';
import { auditLog } from '../services/auditLogger.js';

const repository = new CandidaturaRepository();

export class CandidaturaController {
  async index(req, res) {
    const { page, limit, skip, take } = getPagination(req.query);
    const filters = {
      usuarioId: req.userTipo === 'admin' ? req.query.usuarioId : req.userId,
      vagaId: req.query.vagaId,
    };

    const [data, total] = await Promise.all([
      repository.list({ ...filters, skip, take }),
      repository.count(filters),
    ]);

    return res.json(paginatedResponse({ data, total, page, limit }));
  }

  async store(req, res) {
    const payload = candidaturaSchema.parse(req.body);
    const usuarioId = req.userTipo === 'admin' ? payload.usuarioId : req.userId;

    if (!usuarioId) {
      return res.status(400).json({ message: 'Informe o usuario da candidatura.' });
    }

    const candidatura = await repository.create({
      ...payload,
      usuarioId,
    });
    auditLog(req, 'candidatura.create', {
      candidaturaId: candidatura.id,
      targetUserId: candidatura.usuarioId,
      vagaId: candidatura.vagaId,
    });
    return res.status(201).json(candidatura);
  }

  async delete(req, res) {
    const candidatura = await repository.findById(req.params.id);

    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura nao encontrada.' });
    }

    if (req.userTipo !== 'admin' && candidatura.usuarioId !== req.userId) {
      return res.status(403).json({ message: 'Acesso permitido apenas ao dono da candidatura.' });
    }

    await repository.delete(req.params.id);
    auditLog(req, 'candidatura.delete', {
      candidaturaId: req.params.id,
      targetUserId: candidatura.usuarioId,
      vagaId: candidatura.vagaId,
    });
    return res.status(204).send();
  }
}
