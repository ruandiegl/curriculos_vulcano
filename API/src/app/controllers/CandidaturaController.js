import { CandidaturaRepository } from '../Repositories/CandidaturaRepository.js';
import { getPagination, paginatedResponse } from '../DTO/pagination.js';
import { candidaturaSchema } from '../validators/candidaturaValidator.js';

const repository = new CandidaturaRepository();

export class CandidaturaController {
  async index(req, res) {
    const { page, limit, skip, take } = getPagination(req.query);
    const filters = {
      usuarioId: req.query.usuarioId,
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
    const candidatura = await repository.create(payload);
    return res.status(201).json(candidatura);
  }

  async delete(req, res) {
    await repository.delete(req.params.id);
    return res.status(204).send();
  }
}
