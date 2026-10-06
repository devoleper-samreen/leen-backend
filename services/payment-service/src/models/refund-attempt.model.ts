import { TransferAttemptStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IRefundAttempt extends Document {
  refundId: Types.ObjectId;
  attemptNumber: number;
  status: TransferAttemptStatus;
  providerReference?: string;
  failureReason?: string;
  attemptedAt: Date;
}

const refundAttemptSchema = new Schema<IRefundAttempt>({
  refundId: { type: Schema.Types.ObjectId, ref: 'Refund', required: true, index: true },
  attemptNumber: { type: Number, required: true },
  status: { type: String, enum: Object.values(TransferAttemptStatus), default: TransferAttemptStatus.Pending },
  providerReference: { type: String },
  failureReason: { type: String },
  attemptedAt: { type: Date, default: Date.now },
});

refundAttemptSchema.plugin(basePlugin);

export const RefundAttempt = model<IRefundAttempt>('RefundAttempt', refundAttemptSchema);
