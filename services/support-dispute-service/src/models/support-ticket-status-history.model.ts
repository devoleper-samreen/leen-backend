import { TicketStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface ISupportTicketStatusHistory extends Document {
  ticketId: Types.ObjectId;
  fromStatus?: TicketStatus;
  toStatus: TicketStatus;
  changedBy: Types.ObjectId;
  changedAt: Date;
  note?: string;
}

const supportTicketStatusHistorySchema = new Schema<ISupportTicketStatusHistory>({
  ticketId: { type: Schema.Types.ObjectId, ref: 'SupportTicket', required: true, index: true },
  fromStatus: { type: String, enum: Object.values(TicketStatus) },
  toStatus: { type: String, enum: Object.values(TicketStatus), required: true },
  changedBy: { type: Schema.Types.ObjectId, required: true },
  changedAt: { type: Date, default: Date.now },
  note: { type: String },
});

supportTicketStatusHistorySchema.plugin(basePlugin);

export const SupportTicketStatusHistory = model<ISupportTicketStatusHistory>(
  'SupportTicketStatusHistory',
  supportTicketStatusHistorySchema,
);
