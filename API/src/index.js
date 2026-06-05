import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { router } from './routes.js';
import { errorHandler } from './app/middlewares/errorHandler.js';
import { swaggerDocument } from './swagger.js';

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const configuredOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
]
  .filter(Boolean)
  .flatMap((origins) => origins.split(','))
  .map((origin) => origin.trim())
  .filter(Boolean);
const developmentOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
const allowedOrigins = configuredOrigins?.length ? configuredOrigins : developmentOrigins;
const docsEnabled = !isProduction || process.env.ENABLE_API_DOCS === 'true';

function isAllowedDevelopmentOrigin(origin) {
  if (isProduction) {
    return false;
  }

  return /^http:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):(3000|5173|5174)$/.test(origin);
}

if (isProduction && !configuredOrigins.length) {
  throw new Error('Configure CORS_ORIGIN ou FRONTEND_URL em producao com o dominio permitido do frontend.');
}

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || isAllowedDevelopmentOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origem nao permitida pelo CORS.'));
  },
}));
app.use(express.json({ limit: '2mb' }));

if (docsEnabled) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/api/docs.json', (req, res) => {
    res.json(swaggerDocument);
  });
}

app.use('/api', router);
app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port http://0.0.0.0:${port}`);
});
