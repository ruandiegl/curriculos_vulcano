import assert from 'node:assert/strict';
import test from 'node:test';
import {
  authRateLimitKey,
  createRateLimiterStore,
  rateLimiter,
} from './rateLimiter.js';

function createResponse() {
  const headers = new Map();

  return {
    headers,
    statusCode: 200,
    body: null,
    set(name, value) {
      headers.set(name, value);
    },
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

test('rate limiter blocks after the configured number of attempts and exposes Retry-After', () => {
  let now = 0;
  const store = createRateLimiterStore({ nowProvider: () => now });
  const limiter = rateLimiter({
    name: 'test-recovery',
    windowMs: 60_000,
    max: 2,
    store,
    keyGenerator: authRateLimitKey,
    nowProvider: () => now,
  });
  const request = { ip: '198.51.100.10', body: { email: 'User@Example.com' } };

  const firstResponse = createResponse();
  let nextCalls = 0;
  limiter(request, firstResponse, () => { nextCalls += 1; });
  limiter(request, createResponse(), () => { nextCalls += 1; });

  const blockedResponse = createResponse();
  limiter(request, blockedResponse, () => { nextCalls += 1; });

  assert.equal(nextCalls, 2);
  assert.equal(firstResponse.headers.get('RateLimit-Limit'), '2');
  assert.equal(firstResponse.headers.has('Retry-After'), false);
  assert.equal(blockedResponse.statusCode, 429);
  assert.equal(blockedResponse.headers.get('Retry-After'), '60');
  assert.deepEqual(blockedResponse.body, {
    message: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  });

  now = 60_000;
  const afterWindowResponse = createResponse();
  limiter(request, afterWindowResponse, () => { nextCalls += 1; });
  assert.equal(afterWindowResponse.statusCode, 200);
  assert.equal(nextCalls, 3);
});

test('rate limiter combines IP, email and IP-email buckets', () => {
  const keys = authRateLimitKey({
    ip: '198.51.100.10',
    body: { email: ' User@Example.com ' },
  });

  assert.deepEqual(keys, [
    'ip:198.51.100.10',
    'email:user@example.com',
    'ip-email:198.51.100.10:user@example.com',
  ]);
});

test('rate limiter groups do not share buckets', () => {
  const store = createRateLimiterStore({ nowProvider: () => 0 });
  const first = store.check({ name: 'auth', keys: ['same'], windowMs: 60_000, max: 1, now: 0 });
  const second = store.check({ name: 'password-recovery', keys: ['same'], windowMs: 60_000, max: 1, now: 0 });
  const blocked = store.check({ name: 'auth', keys: ['same'], windowMs: 60_000, max: 1, now: 0 });

  assert.equal(first.blocked, false);
  assert.equal(second.blocked, false);
  assert.equal(blocked.blocked, true);
});

test('rate limiter store does not retain raw keys', () => {
  const store = createRateLimiterStore();

  store.check({
    name: 'password-recovery',
    keys: ['email:person@example.com'],
    windowMs: 60_000,
    max: 1,
  });

  assert.equal(store.size(), 1);
});
