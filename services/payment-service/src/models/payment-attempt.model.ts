import { PaymentStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Each concrete try against a provider/method for a Payment "intent" - lets
 * a failed card attempt be retried with a different method/provider without
 * losing the record of what was already tried.
 */
export interface IPaymentAttempt extends Document {
  paymentId: Types.ObjectId;
  provider: string;
  method: 'card' | 'wallet' | 'cash';
  status: PaymentStatus;
  providerReference?: string;
  failureCode?: string;
  failureMessage?: string;
  attemptedAt: Date;
}

const paymentAttemptSchema = new Schema<IPaymentAttempt>({
  paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, index: true },
  provider: { type: String, required: true },
  method: { type: String, enum: ['card', 'wallet', 'cash'], required: true },
  status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.Pending },
  providerReference: { type: String },
  failureCode: { type: String },
  failureMessage: { type: String },
  attemptedAt: { type: Date, default: Date.now },
});

paymentAttemptSchema.plugin(basePlugin);

export const PaymentAttempt = model<IPaymentAttempt>('PaymentAttempt', paymentAttemptSchema);
