import mongoose from 'mongoose';

export async function connectMongo(uri: string, serviceName: string): Promise<void> {
  mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.log(`[${serviceName}] MongoDB connected`);
  });
  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error(`[${serviceName}] MongoDB connection error`, err);
  });

  await mongoose.connect(uri);
}
