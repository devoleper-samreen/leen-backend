import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Only predefined-template messages are supported (per product spec: no
 * free-text, no audio, no video, no contact-info sharing between Customer
 * and Staff) - hence no free-text `body` field, only a templateId ref.
 */
export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderRole: 'customer' | 'staff';
  templateId: Types.ObjectId;
  sentAt: Date;
  readAt?: Date;
}

const messageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, required: true, index: true },
  senderRole: { type: String, enum: ['customer', 'staff'], required: true },
  templateId: { type: Schema.Types.ObjectId, ref: 'PredefinedMessageTemplate', required: true },
  sentAt: { type: Date, default: Date.now },
  readAt: { type: Date },
});

messageSchema.plugin(basePlugin);

export const Message = model<IMessage>('Message', messageSchema);
