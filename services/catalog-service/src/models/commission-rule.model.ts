import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Configurable commission rate, versioned by effective date. Bookings
 * snapshot the rate they were charged under (Booking.appliedRules) so
 * historical transactions don't change when Admin edits this later.
 */
export interface ICommissionRule extends Document {
  categoryId?: Types.ObjectId;
  cityId?: Types.ObjectId;
  ratePct: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  version: number;
  status: 'active' | 'superseded';
}

const commissionRuleSchema = new Schema<ICommissionRule>({
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  cityId: { type: Schema.Types.ObjectId, ref: 'City' },
  ratePct: { type: Number, required: true },
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date },
  version: { type: Number, required: true, default: 1 },
  status: { type: String, enum: ['active', 'superseded'], default: 'active' },
});

commissionRuleSchema.plugin(basePlugin);

export const CommissionRule = model<ICommissionRule>('CommissionRule', commissionRuleSchema);
