import { PaymentStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Represents a payment "intent" for a booking - which method/provider was
 * actually used, and each try against it, lives on PaymentAttempt so a
 * failed attempt can be retried without redesigning this model.
 */
export interface IPayment extends Document {
  bookingId: Types.ObjectId;
  customerId: Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  idempotencyKey: string;
}

const paymentSchema = new Schema<IPayment>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  customerId: { type: Schema.Types.ObjectId, required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'OMR' },
  status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.Pending },
  idempotencyKey: { type: String, required: true, unique: true },
});

paymentSchema.plugin(basePlugin);

export const Payment = model<IPayment>('Payment', paymentSchema);
