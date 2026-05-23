import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../Repositories/UsuarioRepository.js';
import { loginSchema, registerSchema } from '../validators/authValidator.js';

const repository = new UsuarioRepository();
const fakeHash = '$2b$10$C8h7Kx6dL0U0uD3bY4QbCu0K4IVhSR2UQWhZbb7FZQ4y6UwX0EJ1S';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET não configurado.');
    error.statusCode = 500;
    throw error;
  }

  return process.env.JWT_SECRET;
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
        { expiresIn: '5d' },
      ),
    });
  }
}
