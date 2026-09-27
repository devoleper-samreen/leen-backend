import { connectMongo } from '@leen/shared';

export function connectDb(): Promise<void> {
  const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/leen_booking';
  return connectMongo(uri, 'booking-service');
}
