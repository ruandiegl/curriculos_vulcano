import express from 'express';
import { AuthController } from './app/controllers/AuthController.js';
import { CandidaturaController } from './app/controllers/CandidaturaController.js';
import { CurriculoController } from './app/controllers/CurriculoController.js';
import { UsuarioController } from './app/controllers/UsuarioController.js';
import { VagaController } from './app/controllers/VagaController.js';
import { privateRoutes } from './app/middlewares/Auth.js';
import { asyncHandler } from './app/middlewares/asyncHandler.js';

export const router = express.Router();

const auth = new AuthController();
const usuarios = new UsuarioController();
const curriculos = new CurriculoController();
const vagas = new VagaController();
const candidaturas = new CandidaturaController();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/login', asyncHandler(auth.login));
router.post('/login/register', asyncHandler(auth.register));

router.use(privateRoutes);

router.get('/usuarios', asyncHandler(usuarios.index));
router.post('/usuarios', asyncHandler(usuarios.store));
router.get('/usuarios/:id', asyncHandler(usuarios.show));
router.put('/usuarios/:id', asyncHandler(usuarios.update));
router.delete('/usuarios/:id', asyncHandler(usuarios.delete));

router.get('/curriculos', asyncHandler(curriculos.index));
router.post('/curriculos', asyncHandler(curriculos.store));
router.get('/curriculos/:id', asyncHandler(curriculos.show));
router.put('/curriculos/:id', asyncHandler(curriculos.update));
router.delete('/curriculos/:id', asyncHandler(curriculos.delete));

router.get('/vagas', asyncHandler(vagas.index));
router.post('/vagas', asyncHandler(vagas.store));
router.get('/vagas/:id', asyncHandler(vagas.show));
router.put('/vagas/:id', asyncHandler(vagas.update));
router.delete('/vagas/:id', asyncHandler(vagas.delete));

router.get('/candidaturas', asyncHandler(candidaturas.index));
router.post('/candidaturas', asyncHandler(candidaturas.store));
router.delete('/candidaturas/:id', asyncHandler(candidaturas.delete));
