import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import authRoutes from './routes/auth.routes';
import projectsRoutes from './routes/projects.routes';
import foldersRoutes from './routes/folders.routes';
import resourcesRoutes from './routes/resources.routes';
import tagsRoutes from './routes/tags.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './utils/logger.util';

const app = express();

const configuredOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([...configuredOrigins, 'http://127.0.0.1:5173']));

app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS origin not allowed'));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/folders', foldersRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/tags', tagsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  logger.info(`Backend listening on port ${port}`);
});
