import { TicketStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export type SupportTicketCategory =
  // Customer
  | 'booking_issue'
  | 'payment_issue'
  | 'technical_issue'
  | 'account_issue'
  | 'offer_coupon_issue'
  | 'general_query'
  | 'booking_information'
  // Partner
  | 'account_kyc_issue'
  | 'payout_query'
  | 'profile_issue'
  | 'other_issue'
  | 'other';

export interface ISupportTicket extends Document {
  raisedByRole: 'customer' | 'partner' | 'admin';
  userId: Types.ObjectId;
  category: SupportTicketCategory;
  details: string;
  attachments: string[];
  status: TicketStatus;
  resolutionNote?: string;
}

const supportTicketSchema = new Schema<ISupportTicket>({
  raisedByRole: { type: String, enum: ['customer', 'partner', 'admin'], required: true },
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  category: {
    type: String,
    enum: [
      'booking_issue',
      'payment_issue',
      'technical_issue',
      'account_issue',
      'offer_coupon_issue',
      'general_query',
      'booking_information',
      'account_kyc_issue',
      'payout_query',
      'profile_issue',
      'other_issue',
      'other',
    ],
    required: true,
  },
  details: { type: String, required: true },
  attachments: { type: [String], default: [] },
  status: { type: String, enum: Object.values(TicketStatus), default: TicketStatus.Open },
  resolutionNote: { type: String },
});

supportTicketSchema.plugin(basePlugin);

export const SupportTicket = model<ISupportTicket>('SupportTicket', supportTicketSchema);
