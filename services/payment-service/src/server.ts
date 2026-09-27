import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectDb } from './config/db';

const PORT = process.env.PORT ?? 4004;

async function bootstrap(): Promise<void> {
  await connectDb();
  const app = createApp();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[payment-service] listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[payment-service] failed to start', err);
  process.exit(1);
});
