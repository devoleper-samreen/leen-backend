import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface ITaxRule extends Document {
  categoryId?: Types.ObjectId;
  cityId?: Types.ObjectId;
  ratePct: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  version: number;
  status: 'active' | 'superseded';
}

const taxRuleSchema = new Schema<ITaxRule>({
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  cityId: { type: Schema.Types.ObjectId, ref: 'City' },
  ratePct: { type: Number, required: true },
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date },
  version: { type: Number, required: true, default: 1 },
  status: { type: String, enum: ['active', 'superseded'], default: 'active' },
});

taxRuleSchema.plugin(basePlugin);

export const TaxRule = model<ITaxRule>('TaxRule', taxRuleSchema);
