import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../Repositories/UsuarioRepository.js';
import {
  forgotPasswordSchema,
  loginSchema,
  recoveryMatchSchema,
  registerSchema,
  resetPasswordSchema,
  setupPasswordSchema,
} from '../validators/authValidator.js';
import { auditLog } from '../services/auditLogger.js';
import {
  resolvePublicWebUrl,
  sendPasswordActivationEmail,
  sendPasswordResetEmail,
} from '../services/mailService.js';
import {
  consumePasswordToken,
  InvalidPasswordTokenError,
  issuePasswordToken,
  markPasswordTokenDelivery,
  PASSWORD_TOKEN_PURPOSES,
  PASSWORD_TOKEN_DELIVERY_STATUSES,
  revokePasswordToken,
} from '../services/passwordTokenService.js';

const repository = new UsuarioRepository();
const fakeHash = '$2b$10$C8h7Kx6dL0U0uD3bY4QbCu0K4IVhSR2UQWhZbb7FZQ4y6UwX0EJ1S';
const forgotPasswordMessage = 'Se o email existir, enviaremos instrucoes para atualizar o acesso.';
const passwordSetupRequiredCode = 'PASSWORD_SETUP_REQUIRED';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET não configurado.');
    error.statusCode = 500;
    throw error;
  }

  return process.env.JWT_SECRET;
}

function getFrontendUrl() {
  return resolvePublicWebUrl();
}

function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function recoveryDataMatches(payload, user) {
  const curriculo = user.curriculos?.[0];
  const payloadCpf = onlyDigits(payload.cpf);
  const savedCpf = onlyDigits(user.cpf) || onlyDigits(curriculo?.cpf);

  return payloadCpf.length === 11 && payloadCpf === savedCpf;
}

function sanitizeUser(user) {
  const { passHash, ...safeUser } = user;
  return safeUser;
}

async function completeLegacyActivation(req, res) {
  const { token, password } = setupPasswordSchema.parse(req.body);
  let targetUserId;

  try {
    targetUserId = await consumePasswordToken({
      token,
      purpose: PASSWORD_TOKEN_PURPOSES.ACTIVATION,
      consume: async (transaction, user) => {
        if (user.passHash) {
          throw new InvalidPasswordTokenError();
        }

        const passHash = await bcrypt.hash(password, 10);
        await transaction.usuario.update({
          where: { id: user.id },
          data: { passHash },
        });

        return user.id;
      },
    });
  } catch (error) {
    if (error instanceof InvalidPasswordTokenError) {
      return res.status(400).json({ message: 'Link de ativacao invalido ou expirado.' });
    }

    throw error;
  }

  auditLog(req, 'auth.password_activation_completed', {
    targetUserId,
  });

  return res.status(200).json({ message: 'Senha criada com sucesso.' });
}

export class AuthController {
  async register(req, res) {
    const payload = registerSchema.parse(req.body);
    const existingUser = await repository.findByEmailWithPassword(payload.email);

    if (existingUser) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }

    const passHash = await bcrypt.hash(payload.password, 10);
    const user = await repository.create({
      firebaseUid: payload.firebaseUid ?? `local:${payload.email}`,
      nome: payload.nome,
      email: payload.email,
      cpf: payload.cpf,
      tipo: 'usuario',
      passHash,
    });

    auditLog(req, 'auth.register_user', {
      targetUserId: user.id,
      targetUserTipo: user.tipo,
    });

    return res.status(201).json({
      usuario: {
        nome: user.nome,
        email: user.email,
      },
    });
  }

  async registerAdmin(req, res) {
    const payload = registerSchema.parse(req.body);
    const existingUser = await repository.findByEmailWithPassword(payload.email);

    if (existingUser) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }

    const passHash = await bcrypt.hash(payload.password, 10);
    const user = await repository.create({
      firebaseUid: payload.firebaseUid ?? `local:${payload.email}`,
      nome: payload.nome,
      email: payload.email,
      cpf: payload.cpf,
      tipo: 'admin',
      passHash,
    });

    auditLog(req, 'auth.register_admin', {
      targetUserId: user.id,
      targetUserTipo: user.tipo,
    });

    return res.status(201).json({
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  }

  async login(req, res) {
    const { email, password } = loginSchema.parse(req.body);
    const user = await repository.findByEmailWithPassword(email);

    if (user && !user.passHash) {
      auditLog(req, 'auth.password_setup_required', {
        targetUserId: user.id,
      });
      return res.status(403).json({
        code: passwordSetupRequiredCode,
        message: 'Voce precisa criar uma senha para acessar sua conta.',
      });
    }

    const passwordHash = user?.passHash ?? fakeHash;
    const passwordMatch = await bcrypt.compare(password, passwordHash);

    if (!user || !passwordMatch) {
      auditLog(req, 'auth.login_failed', {
        reason: user ? 'invalid_password' : 'unknown_user',
      });
      return res.status(401).json({ message: 'Email ou senha incorretos.' });
    }

    auditLog(req, 'auth.login_success', {
      targetUserId: user.id,
      targetUserTipo: user.tipo,
    });

    return res.status(200).json({
      message: 'Login bem sucedido.',
      user: sanitizeUser(user),
      token: jwt.sign(
        {
          id: user.id,
          tipo: user.tipo,
        },
        getJwtSecret(),
        { expiresIn: process.env.JWT_EXPIRES_IN ?? '1d' },
      ),
    });
  }

  async forgotPassword(req, res) {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await repository.findByEmailWithPassword(email);

    if (user) {
      const isLegacyUser = !user.passHash;
      const purpose = isLegacyUser
        ? PASSWORD_TOKEN_PURPOSES.ACTIVATION
        : PASSWORD_TOKEN_PURPOSES.RESET;
      const { token, tokenId } = await issuePasswordToken({
        usuarioId: user.id,
        purpose,
      });

      try {
        const delivery = isLegacyUser
          ? await sendPasswordActivationEmail({
              to: user.email,
              nome: user.nome,
              tokenId,
              activationUrl: `${getFrontendUrl()}/activate-account?token=${encodeURIComponent(token)}`,
            })
          : await sendPasswordResetEmail({
              to: user.email,
              nome: user.nome,
              tokenId,
              resetUrl: `${getFrontendUrl()}/reset-password?token=${encodeURIComponent(token)}`,
            });

        try {
          await markPasswordTokenDelivery({
            tokenId,
            status: delivery.provider === 'mock'
              ? PASSWORD_TOKEN_DELIVERY_STATUSES.MOCKED
              : PASSWORD_TOKEN_DELIVERY_STATUSES.SENT,
            providerMessageId: delivery.messageId,
          });
        } catch (statusError) {
          auditLog(req, 'auth.password_email_status_persist_failed', {
            targetUserId: user.id,
            purpose,
            requestId: req.requestId ?? null,
          });
        }
      } catch (deliveryError) {
        try {
          await revokePasswordToken({ tokenId });
        } catch (revokeError) {
          auditLog(req, 'auth.password_token_revoke_failed', {
            targetUserId: user.id,
            purpose,
            requestId: req.requestId ?? null,
          });
          throw revokeError;
        }

        auditLog(req, 'auth.password_email_failed', {
          targetUserId: user.id,
          purpose,
          category: deliveryError.category ?? 'unknown',
          providerStatus: deliveryError.providerStatus ?? null,
          requestId: req.requestId ?? null,
        });
      }
    }

    auditLog(req, 'auth.password_reset_requested', {
      targetUserId: user?.id ?? null,
      accountFound: Boolean(user),
      accountState: user ? (user.passHash ? 'activated' : 'legacy') : 'unknown',
    });

    return res.status(200).json({ message: forgotPasswordMessage });
  }

  async resetPassword(req, res) {
    const { token, password } = resetPasswordSchema.parse(req.body);
    let targetUserId;

    try {
      targetUserId = await consumePasswordToken({
        token,
        purpose: PASSWORD_TOKEN_PURPOSES.RESET,
        consume: async (transaction, user) => {
          if (!user.passHash) {
            throw new InvalidPasswordTokenError();
          }

          const passHash = await bcrypt.hash(password, 10);
          await transaction.usuario.update({
            where: { id: user.id },
            data: { passHash },
          });

          return user.id;
        },
      });
    } catch (error) {
      if (error instanceof InvalidPasswordTokenError) {
        return res.status(400).json({ message: 'Link de redefinicao invalido ou expirado.' });
      }

      throw error;
    }

    auditLog(req, 'auth.password_reset_completed', {
      targetUserId,
    });

    return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  }

  async recoveryMatch(req, res) {
    const payload = recoveryMatchSchema.parse(req.body);
    const user = await repository.findRecoveryCandidateByEmail(payload.email);

    if (
      process.env.ENABLE_LEGACY_CPF_RECOVERY !== 'true' ||
      !user ||
      user.passHash ||
      !recoveryDataMatches(payload, user)
    ) {
      auditLog(req, 'auth.password_setup_match_failed', {
        targetUserId: user?.id ?? null,
      });
      return res.status(400).json({ message: 'Nao foi possivel confirmar seus dados. Solicite um link por e-mail.' });
    }

    const { token: recoveryToken } = await issuePasswordToken({
      usuarioId: user.id,
      purpose: PASSWORD_TOKEN_PURPOSES.ACTIVATION,
    });

    auditLog(req, 'auth.password_setup_match_success', {
      targetUserId: user.id,
    });

    return res.status(200).json({
      recoveryToken,
    });
  }

  async setupPassword(req, res) {
    return completeLegacyActivation(req, res);
  }

  async activateAccount(req, res) {
    return completeLegacyActivation(req, res);
  }
}
