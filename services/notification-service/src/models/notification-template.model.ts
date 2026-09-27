import { LocalizedText, basePlugin } from '@leen/shared';
import { Schema, model, Document } from 'mongoose';

export interface INotificationTemplate extends Document {
  key: string;
  text: LocalizedText;
  channel: 'push' | 'sms' | 'email' | 'in_app';
}

const notificationTemplateSchema = new Schema<INotificationTemplate>({
  key: { type: String, required: true, unique: true },
  text: {
    type: new Schema({ en: { type: String, required: true }, ar: { type: String, required: true } }, { _id: false }),
    required: true,
  },
  channel: { type: String, enum: ['push', 'sms', 'email', 'in_app'], required: true },
});

notificationTemplateSchema.plugin(basePlugin);

export const NotificationTemplate = model<INotificationTemplate>(
  'NotificationTemplate',
  notificationTemplateSchema,
);
