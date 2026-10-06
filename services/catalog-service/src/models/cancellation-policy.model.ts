import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface ICancellationPolicy extends Document {
  categoryId?: Types.ObjectId;
  cityId?: Types.ObjectId;
  freeWindowMinutes: number;
  feeType: 'flat' | 'percentage';
  feeValue: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  version: number;
}

const cancellationPolicySchema = new Schema<ICancellationPolicy>({
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  cityId: { type: Schema.Types.ObjectId, ref: 'City' },
  freeWindowMinutes: { type: Number, required: true },
  feeType: { type: String, enum: ['flat', 'percentage'], required: true },
  feeValue: { type: Number, required: true },
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date },
  version: { type: Number, required: true, default: 1 },
});

cancellationPolicySchema.plugin(basePlugin);

export const CancellationPolicy = model<ICancellationPolicy>(
  'CancellationPolicy',
  cancellationPolicySchema,
);
