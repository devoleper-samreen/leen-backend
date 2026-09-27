import { connectMongo } from '@leen/shared';

export function connectDb(): Promise<void> {
  const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/leen_catalog';
  return connectMongo(uri, 'catalog-service');
}
