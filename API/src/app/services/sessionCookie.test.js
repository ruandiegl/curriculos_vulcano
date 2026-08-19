import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SESSION_COOKIE_NAME,
  clearSessionCookie,
  getRequestCookie,
  getSessionToken,
  setSessionCookie,
} from './sessionCookie.js';

function createResponse() {
  return {
    headers: new Map(),
    setHeader(name, value) {
      this.headers.set(name, value);
    },
  };
}

test('session cookie is HttpOnly and is parsed from requests', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'test';

  try {
    const response = createResponse();
    setSessionCookie(response, 'jwt-value');
    const cookie = response.headers.get('Set-Cookie');

    assert.match(cookie, new RegExp(`^${SESSION_COOKIE_NAME}=jwt-value`));
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Lax/);
    assert.doesNotMatch(cookie, /Secure/);

    const request = { headers: { cookie } };
    assert.equal(getRequestCookie(request, SESSION_COOKIE_NAME), 'jwt-value');
    assert.deepEqual(getSessionToken(request), { token: 'jwt-value', source: 'cookie' });
  } finally {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }
  }
});

test('session cookie is Secure in production and can be cleared', () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  try {
    const response = createResponse();
    setSessionCookie(response, 'jwt-value');
    assert.match(response.headers.get('Set-Cookie'), /Secure/);

    clearSessionCookie(response);
    assert.match(response.headers.get('Set-Cookie'), /Max-Age=0/);
  } finally {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }
  }
});
