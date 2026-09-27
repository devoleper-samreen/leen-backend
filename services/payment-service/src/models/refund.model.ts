import { RefundStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IRefund extends Document {
  bookingId: Types.ObjectId;
  customerId: Types.ObjectId;
  amount: number;
  status: RefundStatus;
  disputeId?: Types.ObjectId;
  txnId?: string;
  penaltyOnPartnerAmount?: number;
}

const refundSchema = new Schema<IRefund>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  customerId: { type: Schema.Types.ObjectId, required: true, index: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: Object.values(RefundStatus), default: RefundStatus.Pending },
  disputeId: { type: Schema.Types.ObjectId },
  txnId: { type: String },
  penaltyOnPartnerAmount: { type: Number },
});

refundSchema.plugin(basePlugin);

export const Refund = model<IRefund>('Refund', refundSchema);
