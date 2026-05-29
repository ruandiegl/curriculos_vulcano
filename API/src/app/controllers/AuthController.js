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
import { sendPasswordResetEmail } from '../services/mailService.js';

const repository = new UsuarioRepository();
const fakeHash = '$2b$10$C8h7Kx6dL0U0uD3bY4QbCu0K4IVhSR2UQWhZbb7FZQ4y6UwX0EJ1S';
const forgotPasswordMessage = 'Se o email existir, enviaremos instrucoes para redefinir a senha.';
const passwordSetupRequiredCode = 'PASSWORD_SETUP_REQUIRED';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET não configurado.');
    error.statusCode = 500;
    throw error;
  }

  return process.env.JWT_SECRET;
}

function getPasswordResetSecret() {
  return process.env.PASSWORD_RESET_SECRET ?? getJwtSecret();
}

function getPasswordSetupSecret() {
  return process.env.PASSWORD_SETUP_SECRET ?? getPasswordResetSecret();
}

function getFrontendUrl() {
  return (process.env.FRONTEND_URL ?? 'http://localhost:5173').replace(/\/$/, '');
}

function createPasswordResetToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      purpose: 'password-reset',
      passHash: user.passHash,
    },
    getPasswordResetSecret(),
    { expiresIn: process.env.PASSWORD_RESET_EXPIRES_IN ?? '1h' },
  );
}

function createPasswordSetupToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      purpose: 'password-setup',
      passHash: user.passHash ?? null,
    },
    getPasswordSetupSecret(),
    { expiresIn: process.env.PASSWORD_SETUP_EXPIRES_IN ?? '15m' },
  );
}

function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function normalizeName(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function namesMatch(inputName, savedName) {
  const input = normalizeName(inputName);
  const saved = normalizeName(savedName);

  if (!input || !saved) {
    return false;
  }

  return saved === input || saved.startsWith(`${input} `) || saved.includes(` ${input} `);
}

function dateOnly(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

function recoveryDataMatches(payload, user) {
  const curriculo = user.curriculos?.[0];
  const payloadCpf = onlyDigits(payload.cpf);
  const savedCpf = onlyDigits(user.cpf) || onlyDigits(curriculo?.cpf);
  const savedBirthDate = dateOnly(curriculo?.nascimento);

  return (
    namesMatch(payload.nome, user.nome) ||
    namesMatch(payload.nome, curriculo?.nome)
  ) && payloadCpf === savedCpf && payload.nascimento === savedBirthDate;
}

function sanitizeUser(user) {
  const { passHash, ...safeUser } = user;
  return safeUser;
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
        email,
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
        email,
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

    if (user?.passHash) {
      const token = createPasswordResetToken(user);
      const resetUrl = `${getFrontendUrl()}/reset-password?token=${encodeURIComponent(token)}`;

      await sendPasswordResetEmail({
        to: user.email,
        nome: user.nome,
        resetUrl,
      });
    }

    auditLog(req, 'auth.password_reset_requested', {
      email,
      targetUserId: user?.id ?? null,
      emailExists: Boolean(user?.passHash),
    });

    return res.status(200).json({ message: forgotPasswordMessage });
  }

  async resetPassword(req, res) {
    const { token, password } = resetPasswordSchema.parse(req.body);
    let payload;

    try {
      payload = jwt.verify(token, getPasswordResetSecret());
    } catch {
      return res.status(400).json({ message: 'Link de redefinicao invalido ou expirado.' });
    }

    if (payload.purpose !== 'password-reset' || !payload.sub || !payload.email || !payload.passHash) {
      return res.status(400).json({ message: 'Link de redefinicao invalido ou expirado.' });
    }

    const user = await repository.findByEmailWithPassword(payload.email);

    if (!user || user.id !== payload.sub || user.passHash !== payload.passHash) {
      return res.status(400).json({ message: 'Link de redefinicao invalido ou expirado.' });
    }

    const passHash = await bcrypt.hash(password, 10);
    await repository.updatePassword(user.id, passHash);

    auditLog(req, 'auth.password_reset_completed', {
      targetUserId: user.id,
    });

    return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  }

  async recoveryMatch(req, res) {
    const payload = recoveryMatchSchema.parse(req.body);
    const user = await repository.findRecoveryCandidateByEmail(payload.email);

    if (!user || user.passHash || !recoveryDataMatches(payload, user)) {
      auditLog(req, 'auth.password_setup_match_failed', {
        email: payload.email,
        targetUserId: user?.id ?? null,
      });
      return res.status(400).json({ message: 'Nao foi possivel confirmar seus dados.' });
    }

    auditLog(req, 'auth.password_setup_match_success', {
      targetUserId: user.id,
    });

    return res.status(200).json({
      recoveryToken: createPasswordSetupToken(user),
    });
  }

  async setupPassword(req, res) {
    const { token, password } = setupPasswordSchema.parse(req.body);
    let payload;

    try {
      payload = jwt.verify(token, getPasswordSetupSecret());
    } catch {
      return res.status(400).json({ message: 'Validacao expirada. Confirme seus dados novamente.' });
    }

    if (payload.purpose !== 'password-setup' || !payload.sub || !payload.email) {
      return res.status(400).json({ message: 'Validacao expirada. Confirme seus dados novamente.' });
    }

    const user = await repository.findByEmailWithPassword(payload.email);

    if (!user || user.id !== payload.sub || user.passHash) {
      return res.status(400).json({ message: 'Nao foi possivel criar senha para este usuario.' });
    }

    const passHash = await bcrypt.hash(password, 10);
    await repository.updatePassword(user.id, passHash);

    auditLog(req, 'auth.password_setup_completed', {
      targetUserId: user.id,
    });

    return res.status(200).json({ message: 'Senha criada com sucesso.' });
  }
}
