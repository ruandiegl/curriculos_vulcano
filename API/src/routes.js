import express from 'express';
import { AuthController } from './app/controllers/AuthController.js';
import { CurriculoArquivoController } from './app/controllers/CurriculoArquivoController.js';
import { CandidaturaController } from './app/controllers/CandidaturaController.js';
import { CurriculoController } from './app/controllers/CurriculoController.js';
import { UsuarioController } from './app/controllers/UsuarioController.js';
import { VagaController } from './app/controllers/VagaController.js';
import { adminCreationRoutes, adminRoutes, privateRoutes } from './app/middlewares/Auth.js';
import { asyncHandler } from './app/middlewares/asyncHandler.js';
import { authRateLimitKey, rateLimiter } from './app/middlewares/rateLimiter.js';
import { uploadCurriculoPdf } from './app/middlewares/uploadCurriculoPdf.js';

export const router = express.Router();

const auth = new AuthController();
const usuarios = new UsuarioController();
const curriculos = new CurriculoController();
const curriculoArquivos = new CurriculoArquivoController();
const vagas = new VagaController();
const candidaturas = new CandidaturaController();
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyGenerator: authRateLimitKey,
});
const passwordResetLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: authRateLimitKey,
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/login', authLimiter, asyncHandler(auth.login));
router.post('/login/register', authLimiter, asyncHandler(auth.register));
router.post('/login/forgot-password', passwordResetLimiter, asyncHandler(auth.forgotPassword));
router.post('/login/reset-password', passwordResetLimiter, asyncHandler(auth.resetPassword));
router.post('/login/register-admin', authLimiter, adminCreationRoutes, asyncHandler(auth.registerAdmin));

router.use(privateRoutes);

router.get('/usuarios', adminRoutes, asyncHandler(usuarios.index));
router.post('/usuarios', adminRoutes, asyncHandler(usuarios.store));
router.get('/usuarios/:id', adminRoutes, asyncHandler(usuarios.show));
router.put('/usuarios/:id', adminRoutes, asyncHandler(usuarios.update));
router.delete('/usuarios/:id', adminRoutes, asyncHandler(usuarios.delete));

router.get('/curriculos', adminRoutes, asyncHandler(curriculos.index));
router.post('/curriculos', asyncHandler(curriculos.store));
router.get('/curriculos/me', asyncHandler(curriculos.me));
router.post('/curriculos/me/cursos', asyncHandler(curriculos.storeCurso));
router.post('/curriculos/me/experiencias', asyncHandler(curriculos.storeExperiencia));
router.post('/curriculos/me/escolaridades', asyncHandler(curriculos.storeEscolaridade));
router.post('/curriculos/me/atuacoes', asyncHandler(curriculos.storeAtuacao));
router.get('/curriculos/:id/pdf', asyncHandler(curriculoArquivos.index));
router.post(
  '/curriculos/:id/pdf',
  uploadCurriculoPdf.single('arquivo'),
  asyncHandler(curriculoArquivos.store),
);
router.get('/curriculos/:id/pdf/:arquivoId/download', asyncHandler(curriculoArquivos.download));
router.delete('/curriculos/:id/pdf/:arquivoId', asyncHandler(curriculoArquivos.delete));
router.get('/curriculos/:id', asyncHandler(curriculos.show));
router.put('/curriculos/:id', asyncHandler(curriculos.update));
router.delete('/curriculos/:id', adminRoutes, asyncHandler(curriculos.delete));

router.get('/vagas', asyncHandler(vagas.index));
router.post('/vagas', adminRoutes, asyncHandler(vagas.store));
router.get('/vagas/:id', asyncHandler(vagas.show));
router.put('/vagas/:id', adminRoutes, asyncHandler(vagas.update));
router.delete('/vagas/:id', adminRoutes, asyncHandler(vagas.delete));

router.get('/candidaturas', asyncHandler(candidaturas.index));
router.post('/candidaturas', asyncHandler(candidaturas.store));
router.delete('/candidaturas/:id', asyncHandler(candidaturas.delete));
