import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import analyticsRoutes from './routes/analyticsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import queueRoutes from './routes/queueRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      const isLocalDev = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');
      if (!origin || origin === env.clientUrl || isLocalDev) return callback(null, true);
      return callback(null, false);
    },
    credentials: true
  }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'QueueLess API' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/queues', queueRoutes);
  app.use('/api/tokens', tokenRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
