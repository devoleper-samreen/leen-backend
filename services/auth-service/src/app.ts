import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler, requestLogger } from '@leen/shared';
import { authRouter } from './routes/auth.routes';
import { profilesRouter } from './routes/profiles.routes';
import { rolesRouter } from './routes/roles.routes';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { service: 'auth-service', status: 'ok' } });
  });

  // Mounted at root: the gateway proxies /api/auth, /api/profiles and
  // /api/roles here separately, stripping its own prefix before forwarding,
  // so this service's internal paths must not repeat those segments.
  app.use('/', authRouter);
  app.use('/', profilesRouter);
  app.use('/', rolesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
