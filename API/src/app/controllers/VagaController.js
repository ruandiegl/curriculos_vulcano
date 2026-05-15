import { VagaRepository } from '../Repositories/VagaRepository.js';
import { getPagination, paginatedResponse } from '../DTO/pagination.js';
import { vagaSchema, vagaUpdateSchema } from '../validators/vagaValidator.js';

const repository = new VagaRepository();

export class VagaController {
  async index(req, res) {
    const { page, limit, skip, take } = getPagination(req.query);
    const [data, total] = await Promise.all([
      repository.list({ query: req.query, skip, take }),
      repository.count(req.query),
    ]);

    return res.json(paginatedResponse({ data, total, page, limit }));
  }

  async show(req, res) {
    const vaga = await repository.findById(req.params.id);

    if (!vaga) {
      return res.status(404).json({ message: 'Vaga não encontrada.' });
    }

    return res.json(vaga);
  }

  async store(req, res) {
    const payload = vagaSchema.parse(req.body);
    const vaga = await repository.create(payload);
    return res.status(201).json(vaga);
  }

  async update(req, res) {
    const payload = vagaUpdateSchema.parse(req.body);
    const vaga = await repository.update(req.params.id, payload);
    return res.json(vaga);
  }

  async delete(req, res) {
    await repository.delete(req.params.id);
    return res.status(204).send();
  }
}
