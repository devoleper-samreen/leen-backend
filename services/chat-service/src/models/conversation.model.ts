import { ConversationStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  bookingId: Types.ObjectId;
  customerId: Types.ObjectId;
  staffId: Types.ObjectId;
  lastMessageAt?: Date;
  status: ConversationStatus;
  closedAt?: Date;
}

const conversationSchema = new Schema<IConversation>({
  bookingId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
  customerId: { type: Schema.Types.ObjectId, required: true, index: true },
  staffId: { type: Schema.Types.ObjectId, required: true, index: true },
  lastMessageAt: { type: Date },
  status: { type: String, enum: Object.values(ConversationStatus), default: ConversationStatus.Active },
  closedAt: { type: Date },
});

conversationSchema.plugin(basePlugin);

export const Conversation = model<IConversation>('Conversation', conversationSchema);
