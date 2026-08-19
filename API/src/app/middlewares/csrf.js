import { hasSessionCookie } from '../services/sessionCookie.js';

const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);

function getConfiguredOrigins() {
  return [
    process.env.CORS_ORIGIN,
    process.env.FRONTEND_URL,
    process.env.PUBLIC_WEB_URL,
  ]
    .filter(Boolean)
    .flatMap((origins) => origins.split(','))
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function csrfProtection(req, res, next) {
  if (safeMethods.has(req.method) || !hasSessionCookie(req)) {
    return next();
  }

  const requestOrigin = req.headers.origin;
  const allowedOrigins = getConfiguredOrigins();

  if (!requestOrigin || !allowedOrigins.includes(requestOrigin)) {
    return res.status(403).json({ message: 'Origem da sessão não permitida.' });
  }

  return next();
}
