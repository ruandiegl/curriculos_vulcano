import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../Repositories/UsuarioRepository.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../validators/authValidator.js';
import { sendPasswordResetEmail } from '../services/mailService.js';

const repository = new UsuarioRepository();
const fakeHash = '$2b$10$C8h7Kx6dL0U0uD3bY4QbCu0K4IVhSR2UQWhZbb7FZQ4y6UwX0EJ1S';
const forgotPasswordMessage = 'Se o email existir, enviaremos instrucoes para redefinir a senha.';

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
    const passwordHash = user?.passHash ?? fakeHash;
    const passwordMatch = await bcrypt.compare(password, passwordHash);

    if (!user || !passwordMatch) {
      return res.status(401).json({ message: 'Email ou senha incorretos.' });
    }

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

    return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  }
}
