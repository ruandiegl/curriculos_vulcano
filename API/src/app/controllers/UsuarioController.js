import bcrypt from 'bcrypt';
import { UsuarioRepository } from '../Repositories/UsuarioRepository.js';
import { getPagination, paginatedResponse } from '../DTO/pagination.js';
import { usuarioAdminSchema, usuarioAdminUpdateSchema } from '../validators/usuarioValidator.js';
import { auditLog } from '../services/auditLogger.js';

const repository = new UsuarioRepository();
const administrativeTypes = new Set(['admin', 'superAdmin']);

function buildUsuarioWhere(req) {
  const search = req.query.search?.trim();
  const scope = req.query.scope?.trim() || 'createdByMe';
  const and = [];

  if (scope === 'createdByMe') {
    and.push({ createdById: req.userId });
  }

  if (scope === 'admins') {
    and.push({ tipo: 'admin' });
  }

  if (scope === 'usuarios') {
    and.push({ tipo: 'usuario' });
  }

  if (search) {
    and.push({
      OR: [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search, mode: 'insensitive' } },
        { firebaseUid: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  return and.length ? { AND: and } : {};
}

function canManageUsuario(req, usuario) {
  if (!usuario) {
    return false;
  }

  if (usuario.id === req.userId) {
    return true;
  }

  return usuario.createdById === req.userId || usuario.tipo === 'admin' || usuario.tipo === 'usuario';
}

async function prepareUsuarioPayload(payload, options = {}) {
  const data = { ...payload };
  const password = data.password?.trim();
  delete data.password;

  if (!data.firebaseUid && data.email) {
    data.firebaseUid = `local:${data.email}`;
  }

  if (administrativeTypes.has(data.tipo) && !password && options.requireAdministrativePassword) {
    const error = new Error('Informe uma senha para usuarios administrativos.');
    error.statusCode = 400;
    throw error;
  }

  if (password) {
    data.passHash = await bcrypt.hash(password, 10);
  }

  return data;
}

export class UsuarioController {
  async index(req, res) {
    const { page, limit, skip, take } = getPagination(req.query);
    const where = buildUsuarioWhere(req);

    const [data, total] = await Promise.all([
      repository.list({ where, skip, take }),
      repository.count(where),
    ]);

    return res.json(paginatedResponse({ data, total, page, limit }));
  }

  async show(req, res) {
    const usuario = await repository.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario nao encontrado.' });
    }

    if (!canManageUsuario(req, usuario)) {
      return res.status(403).json({ message: 'Acesso permitido apenas para usuarios gerenciaveis.' });
    }

    return res.json(usuario);
  }

  async store(req, res) {
    const payload = usuarioAdminSchema.parse(req.body);
    const data = await prepareUsuarioPayload({
      ...payload,
      createdById: req.userId,
    }, { requireAdministrativePassword: true });

    const usuario = await repository.create(data);
    auditLog(req, 'usuario.create', {
      targetUserId: usuario.id,
      targetUserTipo: usuario.tipo,
    });
    return res.status(201).json(usuario);
  }

  async update(req, res) {
    const payload = usuarioAdminUpdateSchema.parse(req.body);
    const current = await repository.findById(req.params.id);

    if (!current) {
      return res.status(404).json({ message: 'Usuario nao encontrado.' });
    }

    if (!canManageUsuario(req, current)) {
      return res.status(403).json({ message: 'Acesso permitido apenas para usuarios gerenciaveis.' });
    }

    if (current.id === req.userId && payload.tipo && payload.tipo !== 'superAdmin') {
      return res.status(400).json({ message: 'Nao e possivel remover o proprio perfil superAdmin.' });
    }

    const data = await prepareUsuarioPayload(payload);
    const usuario = await repository.update(req.params.id, data);
    auditLog(req, 'usuario.update', {
      targetUserId: usuario.id,
      targetUserTipo: usuario.tipo,
      fields: Object.keys(payload),
    });
    return res.json(usuario);
  }

  async delete(req, res) {
    const current = await repository.findById(req.params.id);

    if (!current) {
      return res.status(404).json({ message: 'Usuario nao encontrado.' });
    }

    if (current.id === req.userId) {
      return res.status(400).json({ message: 'Nao e possivel apagar o proprio usuario.' });
    }

    if (!canManageUsuario(req, current)) {
      return res.status(403).json({ message: 'Acesso permitido apenas para usuarios gerenciaveis.' });
    }

    await repository.delete(req.params.id);
    auditLog(req, 'usuario.delete', { targetUserId: req.params.id });
    return res.status(204).send();
  }
}
