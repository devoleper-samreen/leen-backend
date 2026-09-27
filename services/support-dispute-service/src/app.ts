import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler, requestLogger } from '@leen/shared';
import { disputesRouter } from './routes/disputes.routes';
import { supportRouter } from './routes/support.routes';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { service: 'support-dispute-service', status: 'ok' } });
  });

  // Mounted at root: the gateway proxies /api/support and /api/disputes here
  // separately, stripping its own prefix before forwarding, so this
  // service's internal paths must not repeat those segments.
  app.use('/', supportRouter);
  app.use('/', disputesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
