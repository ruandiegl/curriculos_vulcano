import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { router } from './routes.js';
import { errorHandler } from './app/middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 3001;
const corsOrigin = process.env.CORS_ORIGIN?.split(',') ?? '*';

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '2mb' }));

app.use('/api', router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
