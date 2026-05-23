import jwt from 'jsonwebtoken';

const publicRoutes = new Set([
  '/login',
  '/login/register',
  '/login/forgot-password',
  '/login/reset-password',
]);

export function privateRoutes(req, res, next) {
  if (publicRoutes.has(req.path)) {
    return next();
  }

  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: 'Token não enviado.' });
  }

  const [scheme, token] = authToken.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userTipo = decoded.tipo;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}

export function adminRoutes(req, res, next) {
  if (req.userTipo !== 'admin') {
    return res.status(403).json({ message: 'Acesso permitido apenas para administradores.' });
  }

  return next();
}

export function adminCreationRoutes(req, res, next) {
  const adminSecret = req.headers['x-admin-secret'];

  if (process.env.ADMIN_CREATE_SECRET && adminSecret === process.env.ADMIN_CREATE_SECRET) {
    return next();
  }

  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(403).json({
      message: 'Informe um token admin ou a chave x-admin-secret para criar administradores.',
    });
  }

  const [scheme, token] = authToken.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Formato de token invalido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso permitido apenas para administradores.' });
    }

    req.userId = decoded.id;
    req.userTipo = decoded.tipo;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalido.' });
  }
}
