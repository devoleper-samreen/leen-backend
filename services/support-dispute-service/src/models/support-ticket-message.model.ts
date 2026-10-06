import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Full conversation thread for a ticket - SupportTicket.resolutionNote alone
 * only captured the final note, not the back-and-forth that led to it.
 */
export interface ISupportTicketMessage extends Document {
  ticketId: Types.ObjectId;
  senderRole: 'customer' | 'partner' | 'admin';
  senderId: Types.ObjectId;
  message: string;
  attachments: string[];
  isInternalNote: boolean;
  sentAt: Date;
}

const supportTicketMessageSchema = new Schema<ISupportTicketMessage>({
  ticketId: { type: Schema.Types.ObjectId, ref: 'SupportTicket', required: true, index: true },
  senderRole: { type: String, enum: ['customer', 'partner', 'admin'], required: true },
  senderId: { type: Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  attachments: { type: [String], default: [] },
  isInternalNote: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now },
});

supportTicketMessageSchema.plugin(basePlugin);

export const SupportTicketMessage = model<ISupportTicketMessage>(
  'SupportTicketMessage',
  supportTicketMessageSchema,
);
