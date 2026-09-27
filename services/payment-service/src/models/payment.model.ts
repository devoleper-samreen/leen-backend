import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  bookingId: Types.ObjectId;
  customerId: Types.ObjectId;
  amount: number;
  currency: string;
  method: 'card' | 'wallet' | 'cash';
  status: 'pending' | 'success' | 'failed';
  txnId?: string;
}

const paymentSchema = new Schema<IPayment>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  customerId: { type: Schema.Types.ObjectId, required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'OMR' },
  method: { type: String, enum: ['card', 'wallet', 'cash'], required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  txnId: { type: String },
});

paymentSchema.plugin(basePlugin);

export const Payment = model<IPayment>('Payment', paymentSchema);
