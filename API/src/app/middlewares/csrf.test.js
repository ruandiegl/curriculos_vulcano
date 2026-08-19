import assert from 'node:assert/strict';
import test from 'node:test';
import { csrfProtection } from './csrf.js';

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function withOrigins(origins, callback) {
  const previousCorsOrigin = process.env.CORS_ORIGIN;
  const previousFrontendUrl = process.env.FRONTEND_URL;
  const previousPublicWebUrl = process.env.PUBLIC_WEB_URL;

  process.env.CORS_ORIGIN = origins;
  delete process.env.FRONTEND_URL;
  delete process.env.PUBLIC_WEB_URL;

  try {
    callback();
  } finally {
    if (previousCorsOrigin === undefined) delete process.env.CORS_ORIGIN;
    else process.env.CORS_ORIGIN = previousCorsOrigin;
    if (previousFrontendUrl === undefined) delete process.env.FRONTEND_URL;
    else process.env.FRONTEND_URL = previousFrontendUrl;
    if (previousPublicWebUrl === undefined) delete process.env.PUBLIC_WEB_URL;
    else process.env.PUBLIC_WEB_URL = previousPublicWebUrl;
  }
}

test('CSRF middleware permits safe methods and requests without a session cookie', () => {
  let nextCalls = 0;

  csrfProtection({ method: 'GET', headers: {} }, createResponse(), () => { nextCalls += 1; });
  csrfProtection({ method: 'POST', headers: {} }, createResponse(), () => { nextCalls += 1; });

  assert.equal(nextCalls, 2);
});

test('CSRF middleware accepts a session cookie only from a configured origin', () => {
  withOrigins('https://frontend.test', () => {
    const allowedResponse = createResponse();
    let nextCalls = 0;
    csrfProtection(
      {
        method: 'POST',
        headers: {
          cookie: 'curriculos_session=jwt-value',
          origin: 'https://frontend.test',
        },
      },
      allowedResponse,
      () => { nextCalls += 1; },
    );

    const deniedResponse = createResponse();
    csrfProtection(
      {
        method: 'POST',
        headers: {
          cookie: 'curriculos_session=jwt-value',
          origin: 'https://attacker.test',
        },
      },
      deniedResponse,
      () => { nextCalls += 1; },
    );

    assert.equal(nextCalls, 1);
    assert.equal(allowedResponse.statusCode, 200);
    assert.equal(deniedResponse.statusCode, 403);
    assert.deepEqual(deniedResponse.body, { message: 'Origem da sessão não permitida.' });
  });
});
