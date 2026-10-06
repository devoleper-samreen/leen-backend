import { RefundStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export type RefundReason =
  | 'customer_cancellation'
  | 'partner_no_show'
  | 'service_issue'
  | 'dispute_resolution'
  | 'admin_goodwill'
  | 'other';

/**
 * requestedAmount vs refundedAmount distinguishes full vs partial refunds;
 * each provider try lives on RefundAttempt (status/txnId here stay as the
 * current-outcome summary).
 */
export interface IRefund extends Document {
  bookingId: Types.ObjectId;
  paymentId: Types.ObjectId;
  customerId: Types.ObjectId;
  requestedAmount: number;
  refundedAmount?: number;
  reason: RefundReason;
  status: RefundStatus;
  disputeId?: Types.ObjectId;
  txnId?: string;
  penaltyOnPartnerAmount?: number;
}

const refundSchema = new Schema<IRefund>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, index: true },
  customerId: { type: Schema.Types.ObjectId, required: true, index: true },
  requestedAmount: { type: Number, required: true },
  refundedAmount: { type: Number },
  reason: {
    type: String,
    enum: ['customer_cancellation', 'partner_no_show', 'service_issue', 'dispute_resolution', 'admin_goodwill', 'other'],
    required: true,
  },
  status: { type: String, enum: Object.values(RefundStatus), default: RefundStatus.Pending },
  disputeId: { type: Schema.Types.ObjectId },
  txnId: { type: String },
  penaltyOnPartnerAmount: { type: Number },
});

refundSchema.plugin(basePlugin);

export const Refund = model<IRefund>('Refund', refundSchema);
