import jwt from 'jsonwebtoken';
import { clearSessionCookie, getSessionToken } from '../services/sessionCookie.js';

export function isAdminUser(tipo) {
  return tipo === 'admin' || tipo === 'superAdmin';
}

export function isSuperAdminUser(tipo) {
  return tipo === 'superAdmin';
}

const publicRoutes = new Set([
  '/login',
  '/login/register',
  '/login/forgot-password',
  '/login/reset-password',
  '/login/activate-account',
  '/login/recovery-match',
  '/login/setup-password',
]);

export function privateRoutes(req, res, next) {
  if (publicRoutes.has(req.path)) {
    return next();
  }

  const session = getSessionToken(req);

  if (!session) {
    return res.status(401).json({ message: 'Token não enviado.' });
  }

  try {
    const decoded = jwt.verify(session.token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userTipo = decoded.tipo;
    req.authSource = session.source;
    return next();
  } catch (error) {
    if (session.source === 'cookie') {
      clearSessionCookie(res);
    }
    return res.status(401).json({ message: 'Token inválido.' });
  }
}

export function adminRoutes(req, res, next) {
  if (!isAdminUser(req.userTipo)) {
    return res.status(403).json({ message: 'Acesso permitido apenas para administradores.' });
  }

  return next();
}

export function superAdminRoutes(req, res, next) {
  if (!isSuperAdminUser(req.userTipo)) {
    return res.status(403).json({ message: 'Acesso permitido apenas para super administradores.' });
  }

  return next();
}

export function adminCreationRoutes(req, res, next) {
  const adminSecret = req.headers['x-admin-secret'];

  if (process.env.ADMIN_CREATE_SECRET && adminSecret === process.env.ADMIN_CREATE_SECRET) {
    return next();
  }

  const session = getSessionToken(req);

  if (!session) {
    return res.status(403).json({
      message: 'Informe um token admin ou a chave x-admin-secret para criar administradores.',
    });
  }

  try {
    const decoded = jwt.verify(session.token, process.env.JWT_SECRET);

    if (!isAdminUser(decoded.tipo)) {
      return res.status(403).json({ message: 'Acesso permitido apenas para administradores.' });
    }

    req.userId = decoded.id;
    req.userTipo = decoded.tipo;
    req.authSource = session.source;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalido.' });
  }
}

export function sessionRoutes(req, res, next) {
  const session = getSessionToken(req);

  if (!session) {
    return res.status(401).json({ message: 'Sessão não encontrada.' });
  }

  try {
    const decoded = jwt.verify(session.token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userTipo = decoded.tipo;
    req.authSource = session.source;
    return next();
  } catch (error) {
    if (session.source === 'cookie') {
      clearSessionCookie(res);
    }
    return res.status(401).json({ message: 'Sessão inválida.' });
  }
}
