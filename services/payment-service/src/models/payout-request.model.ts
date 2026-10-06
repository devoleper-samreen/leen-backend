import { PayoutStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * status/txnId stay as the current-outcome summary for quick access; the
 * full multi-try history (retries, provider, failure reasons) lives on
 * PayoutAttempt.
 */
export interface IPayoutRequest extends Document {
  partnerId: Types.ObjectId;
  amount: number;
  periodStart: Date;
  periodEnd: Date;
  status: PayoutStatus;
  provider?: string;
  txnId?: string;
  heldForDispute: boolean;
}

const payoutRequestSchema = new Schema<IPayoutRequest>({
  partnerId: { type: Schema.Types.ObjectId, required: true, index: true },
  amount: { type: Number, required: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  status: { type: String, enum: Object.values(PayoutStatus), default: PayoutStatus.Pending },
  provider: { type: String },
  txnId: { type: String },
  heldForDispute: { type: Boolean, default: false },
});

payoutRequestSchema.plugin(basePlugin);

export const PayoutRequest = model<IPayoutRequest>('PayoutRequest', payoutRequestSchema);
