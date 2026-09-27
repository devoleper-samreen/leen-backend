import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IDeviceToken extends Document {
  userId: Types.ObjectId;
  platform: 'ios' | 'android';
  token: string;
}

const deviceTokenSchema = new Schema<IDeviceToken>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  platform: { type: String, enum: ['ios', 'android'], required: true },
  token: { type: String, required: true, unique: true },
});

deviceTokenSchema.plugin(basePlugin);

export const DeviceToken = model<IDeviceToken>('DeviceToken', deviceTokenSchema);
