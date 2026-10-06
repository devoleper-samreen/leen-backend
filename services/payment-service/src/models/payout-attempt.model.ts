import { TransferAttemptStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Every transfer try for a payout - PayoutRequest.status/txnId alone can't
 * show retries, which provider was used, or why earlier attempts failed.
 */
export interface IPayoutAttempt extends Document {
  payoutRequestId: Types.ObjectId;
  attemptNumber: number;
  provider: string;
  providerReference?: string;
  status: TransferAttemptStatus;
  failureReason?: string;
  attemptedAt: Date;
}

const payoutAttemptSchema = new Schema<IPayoutAttempt>({
  payoutRequestId: { type: Schema.Types.ObjectId, ref: 'PayoutRequest', required: true, index: true },
  attemptNumber: { type: Number, required: true },
  provider: { type: String, required: true },
  providerReference: { type: String },
  status: { type: String, enum: Object.values(TransferAttemptStatus), default: TransferAttemptStatus.Pending },
  failureReason: { type: String },
  attemptedAt: { type: Date, default: Date.now },
});

payoutAttemptSchema.plugin(basePlugin);

export const PayoutAttempt = model<IPayoutAttempt>('PayoutAttempt', payoutAttemptSchema);
