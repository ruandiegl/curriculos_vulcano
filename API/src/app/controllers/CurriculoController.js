import { CurriculoRepository } from '../Repositories/CurriculoRepository.js';
import { getPagination, paginatedResponse } from '../DTO/pagination.js';
import { curriculoSchema, curriculoUpdateSchema } from '../validators/curriculoValidator.js';

const repository = new CurriculoRepository();

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

    return res.json(curriculo);
  }

  async store(req, res) {
    const payload = curriculoSchema.parse(req.body);
    const curriculo = await repository.create(payload);
    return res.status(201).json(curriculo);
  }

  async update(req, res) {
    const payload = curriculoUpdateSchema.parse(req.body);
    const curriculo = await repository.update(req.params.id, payload);
    return res.json(curriculo);
  }

  async delete(req, res) {
    await repository.delete(req.params.id);
    return res.status(204).send();
  }
}
