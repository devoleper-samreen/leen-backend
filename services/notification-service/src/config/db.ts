import { connectMongo } from '@leen/shared';

export function connectDb(): Promise<void> {
  const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/leen_notification';
  return connectMongo(uri, 'notification-service');
}
