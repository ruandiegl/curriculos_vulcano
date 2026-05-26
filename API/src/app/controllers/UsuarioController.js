import { UsuarioRepository } from '../Repositories/UsuarioRepository.js';
import { getPagination, paginatedResponse } from '../DTO/pagination.js';
import { usuarioAdminSchema, usuarioAdminUpdateSchema } from '../validators/usuarioValidator.js';
import { auditLog } from '../services/auditLogger.js';

const repository = new UsuarioRepository();

export class UsuarioController {
  async index(req, res) {
    const { page, limit, skip, take } = getPagination(req.query);
    const search = req.query.search?.trim();
    const where = search
      ? {
          OR: [
            { nome: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { cpf: { contains: search, mode: 'insensitive' } },
            { firebaseUid: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      repository.list({ where, skip, take }),
      repository.count(where),
    ]);

    return res.json(paginatedResponse({ data, total, page, limit }));
  }

  async show(req, res) {
    const usuario = await repository.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.json(usuario);
  }

  async store(req, res) {
    const payload = usuarioAdminSchema.parse(req.body);
    const usuario = await repository.create(payload);
    auditLog(req, 'usuario.create', {
      targetUserId: usuario.id,
      targetUserTipo: usuario.tipo,
    });
    return res.status(201).json(usuario);
  }

  async update(req, res) {
    const payload = usuarioAdminUpdateSchema.parse(req.body);
    const usuario = await repository.update(req.params.id, payload);
    auditLog(req, 'usuario.update', {
      targetUserId: usuario.id,
      targetUserTipo: usuario.tipo,
      fields: Object.keys(payload),
    });
    return res.json(usuario);
  }

  async delete(req, res) {
    await repository.delete(req.params.id);
    auditLog(req, 'usuario.delete', { targetUserId: req.params.id });
    return res.status(204).send();
  }
}
