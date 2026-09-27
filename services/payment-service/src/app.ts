import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler, requestLogger } from '@leen/shared';
import { paymentsRouter } from './routes/payments.routes';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { service: 'payment-service', status: 'ok' } });
  });

  app.use('/', paymentsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
