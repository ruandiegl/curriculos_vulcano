import { randomUUID } from 'node:crypto';
import path from 'node:path';
import multer from 'multer';

const uploadDir = path.resolve('uploads', 'curriculos');

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadDir);
  },
  filename(req, file, callback) {
    const safeExtension = path.extname(file.originalname).toLowerCase() || '.pdf';
    callback(null, `${randomUUID()}${safeExtension}`);
  },
});

function fileFilter(req, file, callback) {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExtension = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (!isPdfMime || !isPdfExtension) {
    return callback(new Error('Apenas arquivos PDF são permitidos.'));
  }

  return callback(null, true);
}

export const uploadCurriculoPdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
