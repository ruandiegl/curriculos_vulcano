export const SESSION_COOKIE_NAME = 'curriculos_session';

function getSessionMaxAgeSeconds() {
  const configured = process.env.JWT_EXPIRES_IN ?? '1d';
  const match = configured.match(/^(\d+)([smhd])$/i);

  if (!match) {
    return 24 * 60 * 60;
  }

  const multipliers = { s: 1, m: 60, h: 60 * 60, d: 24 * 60 * 60 };
  return Number(match[1]) * multipliers[match[2].toLowerCase()];
}

function serializeCookie(name, value, attributes) {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  for (const [attribute, attributeValue] of Object.entries(attributes)) {
    if (attributeValue === false || attributeValue === undefined || attributeValue === null) {
      continue;
    }

    if (attributeValue === true) {
      parts.push(attribute);
      continue;
    }

    parts.push(`${attribute}=${attributeValue}`);
  }

  return parts.join('; ');
}

function getCookieAttributes({ maxAge }) {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = (process.env.SESSION_COOKIE_SAMESITE ?? 'Lax').trim();

  return {
    Path: '/',
    'Max-Age': maxAge,
    HttpOnly: true,
    Secure: isProduction,
    SameSite: sameSite,
  };
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', serializeCookie(
    SESSION_COOKIE_NAME,
    token,
    getCookieAttributes({ maxAge: getSessionMaxAgeSeconds() }),
  ));
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', serializeCookie(
    SESSION_COOKIE_NAME,
    '',
    getCookieAttributes({ maxAge: 0 }),
  ));
}

export function getRequestCookie(req, name) {
  const rawCookies = req.headers.cookie ?? '';

  for (const part of rawCookies.split(';')) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex < 0) {
      continue;
    }

    const cookieName = part.slice(0, separatorIndex).trim();
    if (cookieName !== name) {
      continue;
    }

    const cookieValue = part.slice(separatorIndex + 1).trim();
    try {
      return decodeURIComponent(cookieValue);
    } catch {
      return null;
    }
  }

  return null;
}

export function getSessionToken(req) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const [scheme, token] = authHeader.split(' ');
    if (scheme === 'Bearer' && token) {
      return { token, source: 'bearer' };
    }
  }

  const cookieToken = getRequestCookie(req, SESSION_COOKIE_NAME);
  return cookieToken ? { token: cookieToken, source: 'cookie' } : null;
}

export function hasSessionCookie(req) {
  return Boolean(getRequestCookie(req, SESSION_COOKIE_NAME));
}
