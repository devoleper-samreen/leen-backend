import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler, requestLogger } from '@leen/shared';
import { bookingsRouter } from './routes/bookings.routes';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { service: 'booking-service', status: 'ok' } });
  });

  // Mounted at root: the gateway strips its `/api/bookings` prefix before
  // proxying, so this service's own paths must not repeat that segment.
  app.use('/', bookingsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
