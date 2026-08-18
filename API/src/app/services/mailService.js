import nodemailer from 'nodemailer';

const developmentMailbox = [];
const DEFAULT_RESEND_API_BASE_URL = 'https://api.resend.com';
const DEFAULT_EMAIL_TIMEOUT_MS = 5000;

export class MailDeliveryError extends Error {
  constructor(message, { category = 'unknown', providerStatus = null, retryable = false, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = 'MailDeliveryError';
    this.category = category;
    this.providerStatus = providerStatus;
    this.retryable = retryable;
    this.statusCode = 503;
  }
}

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST);
}

export function getEmailProvider() {
  const configuredProvider = process.env.EMAIL_PROVIDER?.trim().toLowerCase();

  if (configuredProvider) {
    return configuredProvider;
  }

  if (process.env.MAIL_DELIVERY_MODE === 'memory') {
    return 'mock';
  }

  if (hasSmtpConfig()) {
    return 'smtp';
  }

  return 'none';
}

export function resolvePublicWebUrl({ fallback = 'http://localhost:5181' } = {}) {
  const configuredUrl = process.env.PUBLIC_WEB_URL?.trim()
    || process.env.FRONTEND_URL?.trim()
    || process.env.RAILWAY_PUBLIC_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();

  if (railwayDomain) {
    return `https://${railwayDomain.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
  }

  return fallback;
}

function isDevelopmentMailboxEnabled() {
  return process.env.NODE_ENV !== 'production' && getEmailProvider() === 'mock';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createTransporter() {
  const port = Number(process.env.SMTP_PORT ?? 587);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
}

function getRequiredEnvironmentVariable(name, message) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new MailDeliveryError(message, { category: 'configuration' });
  }

  return value;
}

function getEmailTimeoutMs() {
  const configuredTimeout = Number(process.env.EMAIL_REQUEST_TIMEOUT_MS ?? DEFAULT_EMAIL_TIMEOUT_MS);

  if (!Number.isFinite(configuredTimeout) || configuredTimeout < 1000 || configuredTimeout > 30000) {
    return DEFAULT_EMAIL_TIMEOUT_MS;
  }

  return configuredTimeout;
}

function buildIdempotencyKey({ purpose, tokenId }) {
  if (!tokenId) {
    throw new MailDeliveryError(
      'Não foi possível preparar o envio de e-mail.',
      { category: 'configuration' },
    );
  }

  return `curriculos/${purpose}/${tokenId}`;
}

function buildEmailContent({ to, nome, actionUrl, actionLabel, subject }) {
  const displayName = nome ? ` ${nome}` : '';
  const safeDisplayName = escapeHtml(displayName);
  const safeActionUrl = escapeHtml(actionUrl);
  const safeActionLabel = escapeHtml(actionLabel);

  return {
    to,
    subject,
    text: [
      `Ola${displayName},`,
      '',
      'Recebemos uma solicitacao para atualizar o acesso da sua conta.',
      `Acesse o link abaixo para ${actionLabel.toLowerCase()}:`,
      actionUrl,
      '',
      'Se voce nao solicitou essa alteracao, ignore este email.',
      'Metalurgica Vulcano',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; color: #30384a; line-height: 1.5;">
        <h2 style="margin: 0 0 16px;">Atualizacao de acesso</h2>
        <p>Ola${safeDisplayName},</p>
        <p>Recebemos uma solicitacao para atualizar o acesso da sua conta.</p>
        <p>
          <a href="${safeActionUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 7px; background: #ff8424; color: #ffffff; font-weight: 700; text-decoration: none;">
            ${safeActionLabel}
          </a>
        </p>
        <p>Se voce nao solicitou essa alteracao, ignore este email.</p>
        <p style="color: #697586;">Metalurgica Vulcano</p>
      </div>
    `,
  };
}

async function sendWithSmtp({ email, nome }) {
  if (!hasSmtpConfig()) {
    throw new MailDeliveryError('Serviço de e-mail não configurado.', { category: 'configuration' });
  }

  const transporter = createTransporter();
  const from = process.env.MAIL_FROM ?? process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    ...email,
  });

  return { provider: 'smtp', messageId: null, nome };
}

async function sendWithResend({ email, purpose, tokenId }) {
  const apiKey = getRequiredEnvironmentVariable(
    'RESEND_API_KEY',
    'RESEND_API_KEY não configurada.',
  );
  const from = getRequiredEnvironmentVariable(
    'RESEND_FROM_EMAIL',
    'RESEND_FROM_EMAIL não configurado.',
  );
  const apiBaseUrl = (process.env.RESEND_API_BASE_URL ?? DEFAULT_RESEND_API_BASE_URL).replace(/\/$/, '');
  const idempotencyKey = buildIdempotencyKey({ purpose, tokenId });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getEmailTimeoutMs());

  let response;

  try {
    if (typeof fetch !== 'function') {
      throw new MailDeliveryError(
        'O runtime não oferece suporte ao envio de e-mail.',
        { category: 'configuration' },
      );
    }

    response = await fetch(`${apiBaseUrl}/emails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        from,
        ...email,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof MailDeliveryError) {
      throw error;
    }

    throw new MailDeliveryError(
      'Não foi possível conectar ao provedor de e-mail.',
      {
        category: error?.name === 'AbortError' ? 'timeout' : 'network',
        retryable: true,
        cause: error,
      },
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errorCategory = response.status === 401 || response.status === 403
      ? 'configuration'
      : response.status === 409
        ? 'idempotency'
        : response.status === 429
          ? 'rate_limit'
          : response.status >= 500
            ? 'provider'
            : 'request';

    throw new MailDeliveryError(
      'O provedor de e-mail recusou o envio.',
      {
        category: errorCategory,
        providerStatus: response.status,
        retryable: response.status === 409 || response.status === 429 || response.status >= 500,
      },
    );
  }

  const payload = await response.json().catch(() => null);

  if (typeof payload?.id !== 'string' || !payload.id.trim()) {
    throw new MailDeliveryError(
      'O provedor de e-mail não confirmou o envio.',
      { category: 'provider', providerStatus: response.status, retryable: true },
    );
  }

  return { provider: 'resend', messageId: payload.id, idempotencyKey };
}

async function sendWithMock({ email, nome, actionUrl }) {
  if (process.env.NODE_ENV === 'production') {
    throw new MailDeliveryError(
      'O modo de e-mail simulado não pode ser usado em produção.',
      { category: 'configuration' },
    );
  }

  developmentMailbox.push({
    to: email.to,
    nome,
    subject: email.subject,
    actionUrl,
    createdAt: new Date().toISOString(),
  });

  return { provider: 'mock', messageId: null };
}

export function assertEmailProviderConfiguration({ production = process.env.NODE_ENV === 'production' } = {}) {
  const provider = getEmailProvider();

  if (!['mock', 'smtp', 'resend'].includes(provider)) {
    throw new Error('Configure EMAIL_PROVIDER como mock, smtp ou resend.');
  }

  if (production && provider === 'mock') {
    throw new Error('EMAIL_PROVIDER=mock não pode ser usado em produção.');
  }

  if (provider === 'resend') {
    getRequiredEnvironmentVariable('RESEND_API_KEY', 'Configure RESEND_API_KEY para usar o Resend.');
    getRequiredEnvironmentVariable('RESEND_FROM_EMAIL', 'Configure RESEND_FROM_EMAIL para usar o Resend.');

    if (production) {
      const publicWebUrl = resolvePublicWebUrl({ fallback: '' });

      if (!publicWebUrl) {
        throw new Error('Configure PUBLIC_WEB_URL ou RAILWAY_PUBLIC_DOMAIN para usar o Resend em produção.');
      }

      let parsedPublicWebUrl;
      try {
        parsedPublicWebUrl = new URL(publicWebUrl);
      } catch {
        throw new Error('PUBLIC_WEB_URL deve ser uma URL válida em produção.');
      }

      if (parsedPublicWebUrl.protocol !== 'https:') {
        throw new Error('PUBLIC_WEB_URL deve usar HTTPS em produção.');
      }
    }
  }

  if (production && provider === 'smtp' && !hasSmtpConfig()) {
    throw new Error('Configure SMTP_HOST para usar SMTP em produção.');
  }
}

export async function sendPasswordActionEmail({
  to,
  nome,
  actionUrl,
  actionLabel,
  subject,
  purpose,
  tokenId,
}) {
  const email = buildEmailContent({ to, nome, actionUrl, actionLabel, subject });
  const provider = getEmailProvider();

  if (provider === 'mock') {
    return sendWithMock({ email, nome, actionUrl });
  }

  if (provider === 'smtp') {
    return sendWithSmtp({ email, nome });
  }

  if (provider === 'resend') {
    return sendWithResend({ email, purpose, tokenId });
  }

  throw new MailDeliveryError('Serviço de e-mail não configurado.', { category: 'configuration' });
}

export const sendPasswordResetEmail = (params) => sendPasswordActionEmail({
  ...params,
  purpose: 'password-reset',
  actionUrl: params.resetUrl,
  actionLabel: 'Redefinir senha',
  subject: 'Redefinicao de senha - Metalurgica Vulcano',
});

export const sendPasswordActivationEmail = (params) => sendPasswordActionEmail({
  ...params,
  purpose: 'password-activation',
  actionUrl: params.activationUrl,
  actionLabel: 'Criar senha',
  subject: 'Ativacao de acesso - Metalurgica Vulcano',
});

export function getDevelopmentMailbox({ to } = {}) {
  if (!isDevelopmentMailboxEnabled()) {
    return [];
  }

  return developmentMailbox
    .filter((message) => !to || message.to === to)
    .slice(-10)
    .map((message) => ({ ...message }));
}

export function clearDevelopmentMailbox() {
  developmentMailbox.length = 0;
}
