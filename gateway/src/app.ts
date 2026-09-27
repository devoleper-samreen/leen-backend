import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler, requestLogger } from '@leen/shared';
import { mountApiDocs } from './routes/docs';
import { mountServiceProxies } from './routes/proxy';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { service: 'gateway', status: 'ok' } });
  });

  mountApiDocs(app);
  mountServiceProxies(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
