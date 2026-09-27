import { Role, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  role: Role;
  title: string;
  body: string;
  type: string;
  readAt?: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  role: { type: String, enum: Object.values(Role), required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, required: true },
  readAt: { type: Date },
});

notificationSchema.plugin(basePlugin);

export const Notification = model<INotification>('Notification', notificationSchema);
