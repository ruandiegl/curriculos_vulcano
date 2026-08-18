import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clearDevelopmentMailbox,
  getDevelopmentMailbox,
  MailDeliveryError,
  sendPasswordResetEmail,
} from './mailService.js';

const environmentKeys = [
  'NODE_ENV',
  'EMAIL_PROVIDER',
  'MAIL_DELIVERY_MODE',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'RESEND_API_BASE_URL',
  'EMAIL_REQUEST_TIMEOUT_MS',
];

async function withEnvironment(values, callback) {
  const previous = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]));

  for (const key of environmentKeys) {
    delete process.env[key];
  }

  Object.assign(process.env, values);

  try {
    return await callback();
  } finally {
    for (const key of environmentKeys) {
      if (previous[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previous[key];
      }
    }
  }
}

test('provider mock guarda a mensagem somente na caixa local', async () => {
  await withEnvironment({ NODE_ENV: 'test', EMAIL_PROVIDER: 'mock' }, async () => {
    clearDevelopmentMailbox();

    const result = await sendPasswordResetEmail({
      to: 'teste@example.invalid',
      nome: 'Pessoa Teste',
      resetUrl: 'http://localhost:5181/reset-password?token=token-de-teste',
      tokenId: '00000000-0000-0000-0000-000000000001',
    });

    assert.equal(result.provider, 'mock');
    assert.equal(getDevelopmentMailbox({ to: 'teste@example.invalid' }).length, 1);
  });
});

test('provider resend envia JSON server-side com idempotência', async () => {
  const previousFetch = globalThis.fetch;
  let request;

  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify({ id: 'resend-message-test-123' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };

  try {
    await withEnvironment({
      NODE_ENV: 'test',
      EMAIL_PROVIDER: 'resend',
      RESEND_API_KEY: 're_test_key_only',
      RESEND_FROM_EMAIL: 'Metalurgica Vulcano <no-reply@example.com>',
      RESEND_API_BASE_URL: 'https://resend.test',
    }, async () => {
      const result = await sendPasswordResetEmail({
        to: 'teste@example.invalid',
        nome: 'Pessoa Teste',
        resetUrl: 'https://frontend.test/reset-password?token=token-de-teste',
        tokenId: '00000000-0000-0000-0000-000000000002',
      });

      assert.deepEqual(result, {
        provider: 'resend',
        messageId: 'resend-message-test-123',
        idempotencyKey: 'curriculos/password-reset/00000000-0000-0000-0000-000000000002',
      });
    });
  } finally {
    globalThis.fetch = previousFetch;
  }

  assert.equal(request.url, 'https://resend.test/emails');
  assert.equal(request.options.headers.Authorization, 'Bearer re_test_key_only');
  assert.equal(
    request.options.headers['Idempotency-Key'],
    'curriculos/password-reset/00000000-0000-0000-0000-000000000002',
  );

  const body = JSON.parse(request.options.body);
  assert.equal(body.from, 'Metalurgica Vulcano <no-reply@example.com>');
  assert.equal(body.to, 'teste@example.invalid');
  assert.match(body.html, /reset-password/);
  assert.equal(body.html.includes('<script>'), false);
});

test('falha do Resend é normalizada sem expor a mensagem do provedor', async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(
    JSON.stringify({ name: 'invalid_from', message: 'detalhe interno do provedor' }),
    { status: 403, headers: { 'content-type': 'application/json' } },
  );

  try {
    await withEnvironment({
      NODE_ENV: 'test',
      EMAIL_PROVIDER: 'resend',
      RESEND_API_KEY: 're_test_key_only',
      RESEND_FROM_EMAIL: 'Metalurgica Vulcano <no-reply@example.com>',
    }, async () => {
      await assert.rejects(
        sendPasswordResetEmail({
          to: 'teste@example.invalid',
          nome: 'Pessoa Teste',
          resetUrl: 'https://frontend.test/reset-password?token=token-de-teste',
          tokenId: '00000000-0000-0000-0000-000000000003',
        }),
        (error) => {
          assert.equal(error instanceof MailDeliveryError, true);
          assert.equal(error.category, 'configuration');
          assert.equal(error.providerStatus, 403);
          assert.equal(error.message.includes('detalhe interno'), false);
          return true;
        },
      );
    });
  } finally {
    globalThis.fetch = previousFetch;
  }
});
