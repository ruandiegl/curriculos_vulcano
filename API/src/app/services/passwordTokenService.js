import crypto from 'node:crypto';
import { prisma } from '../../databases/prisma.js';

export const PASSWORD_TOKEN_PURPOSES = {
  RESET: 'password-reset',
  ACTIVATION: 'password-activation',
};

export const PASSWORD_TOKEN_DELIVERY_STATUSES = {
  PENDING: 'pending',
  SENT: 'sent',
  MOCKED: 'mocked',
  FAILED: 'failed',
};

const defaultExpiresInMs = 15 * 60 * 1000;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function createRawToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function getExpiresInMs(purpose) {
  const configuredMinutes = Number(
    purpose === PASSWORD_TOKEN_PURPOSES.RESET
      ? process.env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES ?? 60
      : process.env.PASSWORD_ACTIVATION_TOKEN_EXPIRES_MINUTES ?? 15,
  );

  if (!Number.isFinite(configuredMinutes) || configuredMinutes < 5 || configuredMinutes > 120) {
    return defaultExpiresInMs;
  }

  return configuredMinutes * 60 * 1000;
}

export async function issuePasswordToken({ usuarioId, purpose }) {
  const rawToken = createRawToken();
  const tokenId = crypto.randomUUID();
  const idempotencyKey = `curriculos/${purpose}/${tokenId}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + getExpiresInMs(purpose));

  await prisma.$transaction([
    prisma.passwordToken.updateMany({
      where: {
        usuarioId,
        purpose,
        usedAt: null,
        revokedAt: null,
      },
      data: { usedAt: now, revokedAt: now },
    }),
    prisma.passwordToken.create({
      data: {
        id: tokenId,
        usuarioId,
        purpose,
        tokenHash: hashToken(rawToken),
        expiresAt,
        idempotencyKey,
      },
    }),
  ]);

  return { token: rawToken, tokenId, idempotencyKey };
}

export async function markPasswordTokenDelivery({ tokenId, status, providerMessageId = null }) {
  return prisma.passwordToken.update({
    where: { id: tokenId },
    data: {
      deliveryStatus: status,
      providerMessageId,
    },
  });
}

export async function revokePasswordToken({ tokenId }) {
  return prisma.passwordToken.updateMany({
    where: {
      id: tokenId,
      usedAt: null,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
      deliveryStatus: PASSWORD_TOKEN_DELIVERY_STATUSES.FAILED,
    },
  });
}

export class InvalidPasswordTokenError extends Error {
  constructor() {
    super('Token de senha invalido ou expirado.');
    this.name = 'InvalidPasswordTokenError';
  }
}

export async function consumePasswordToken({ token, purpose, consume }) {
  const tokenHash = hashToken(token);
  const now = new Date();

  return prisma.$transaction(async (transaction) => {
    const passwordToken = await transaction.passwordToken.findUnique({
      where: { tokenHash },
    });

    if (
      !passwordToken ||
      passwordToken.purpose !== purpose ||
      passwordToken.usedAt ||
      passwordToken.revokedAt ||
      passwordToken.expiresAt <= now
    ) {
      throw new InvalidPasswordTokenError();
    }

    const user = await transaction.usuario.findUnique({
      where: { id: passwordToken.usuarioId },
    });

    if (!user) {
      throw new InvalidPasswordTokenError();
    }

    const claimed = await transaction.passwordToken.updateMany({
      where: {
        id: passwordToken.id,
        usedAt: null,
        expiresAt: { gt: now },
      },
      data: { usedAt: now },
    });

    if (claimed.count !== 1) {
      throw new InvalidPasswordTokenError();
    }

    return consume(transaction, user);
  });
}

export function tokenHashForTestOnly(token) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Disponivel apenas fora de producao.');
  }

  return hashToken(token);
}
