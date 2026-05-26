import { open, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { CurriculoArquivoRepository } from '../Repositories/CurriculoArquivoRepository.js';
import { auditLog } from '../services/auditLogger.js';

const repository = new CurriculoArquivoRepository();

function canManageCurriculoArquivo(req, curriculo) {
  return req.userTipo === 'admin' || curriculo.usuarioId === req.userId;
}

async function removeUploadedFile(filePath) {
  if (!filePath) {
    return;
  }

  await unlink(filePath).catch(() => {});
}

async function isPdfFile(filePath) {
  const file = await open(filePath, 'r');

  try {
    const buffer = Buffer.alloc(5);
    const { bytesRead } = await file.read(buffer, 0, buffer.length, 0);
    return bytesRead === 5 && buffer.toString('ascii') === '%PDF-';
  } finally {
    await file.close();
  }
}

export class CurriculoArquivoController {
  async index(req, res) {
    const curriculo = await repository.findCurriculoById(req.params.id);

    if (!curriculo) {
      return res.status(404).json({ message: 'Currículo não encontrado.' });
    }

    if (!canManageCurriculoArquivo(req, curriculo)) {
      return res.status(403).json({ message: 'Acesso permitido apenas ao dono do curriculo.' });
    }

    const arquivos = await repository.listByCurriculo(req.params.id);
    return res.json(arquivos);
  }

  async store(req, res) {
    const curriculo = await repository.findCurriculoById(req.params.id);

    if (!curriculo) {
      await removeUploadedFile(req.file?.path);
      return res.status(404).json({ message: 'Currículo não encontrado.' });
    }

    if (!canManageCurriculoArquivo(req, curriculo)) {
      await removeUploadedFile(req.file?.path);
      return res.status(403).json({ message: 'Acesso permitido apenas ao dono do curriculo.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Envie um arquivo PDF no campo "arquivo".' });
    }

    if (!(await isPdfFile(req.file.path))) {
      await removeUploadedFile(req.file.path);
      return res.status(400).json({ message: 'O arquivo enviado nao e um PDF valido.' });
    }

    const arquivosAntigos = await repository.listByCurriculo(req.params.id);
    const arquivo = await repository.replaceForCurriculo(req.params.id, {
      curriculoId: req.params.id,
      nomeOriginal: req.file.originalname,
      nomeArquivo: req.file.filename,
      caminho: req.file.path,
      mimeType: req.file.mimetype,
      tamanho: req.file.size,
    });

    await Promise.all(arquivosAntigos.map((item) => removeUploadedFile(item.caminho)));

    auditLog(req, arquivosAntigos.length ? 'curriculo_pdf.replace' : 'curriculo_pdf.upload', {
      curriculoId: req.params.id,
      arquivoId: arquivo.id,
      previousFileCount: arquivosAntigos.length,
      size: arquivo.tamanho,
    });

    return res.status(201).json(arquivo);
  }

  async download(req, res) {
    const arquivo = await repository.findById(req.params.arquivoId);

    if (!arquivo || arquivo.curriculoId !== req.params.id) {
      return res.status(404).json({ message: 'Arquivo não encontrado.' });
    }

    const curriculo = await repository.findCurriculoById(req.params.id);
    if (!curriculo || !canManageCurriculoArquivo(req, curriculo)) {
      return res.status(403).json({ message: 'Acesso permitido apenas ao dono do curriculo.' });
    }

    await stat(arquivo.caminho);
    res.set({
      'Content-Type': 'application/pdf',
      'X-Content-Type-Options': 'nosniff',
    });
    return res.download(path.resolve(arquivo.caminho), arquivo.nomeOriginal);
  }

  async delete(req, res) {
    const arquivo = await repository.findById(req.params.arquivoId);

    if (!arquivo || arquivo.curriculoId !== req.params.id) {
      return res.status(404).json({ message: 'Arquivo não encontrado.' });
    }

    const curriculo = await repository.findCurriculoById(req.params.id);
    if (!curriculo || !canManageCurriculoArquivo(req, curriculo)) {
      return res.status(403).json({ message: 'Acesso permitido apenas ao dono do curriculo.' });
    }

    const arquivos = await repository.listByCurriculo(req.params.id);
    await repository.deleteByCurriculo(req.params.id);
    await Promise.all(arquivos.map((item) => removeUploadedFile(item.caminho)));

    auditLog(req, 'curriculo_pdf.delete', {
      curriculoId: req.params.id,
      arquivoId: req.params.arquivoId,
      deletedFileCount: arquivos.length,
    });

    return res.status(204).send();
  }
}
