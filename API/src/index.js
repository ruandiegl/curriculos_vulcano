import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { router } from './routes.js';
import { errorHandler } from './app/middlewares/errorHandler.js';
import { swaggerDocument } from './swagger.js';

const app = express();
const port = process.env.PORT || 3001;
const corsOrigin = process.env.CORS_ORIGIN?.split(',') ?? '*';

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '2mb' }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api/docs.json', (req, res) => {
  res.json(swaggerDocument);
});

app.use('/api', router);
app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port http://0.0.0.0:${port}`);
});
