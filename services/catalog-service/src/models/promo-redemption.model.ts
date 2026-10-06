import { PromoRedemptionStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Per-redemption record so customer-level promo limits can be enforced and
 * abuse investigated - PromoCode.usedCount alone can't answer "did this
 * customer already use this code" or "which booking used it".
 */
export interface IPromoRedemption extends Document {
  promoCodeId: Types.ObjectId;
  customerId: Types.ObjectId;
  bookingId: Types.ObjectId;
  discountAmount: number;
  redeemedAt: Date;
  status: PromoRedemptionStatus;
  reversedAt?: Date;
  reversalReason?: string;
}

const promoRedemptionSchema = new Schema<IPromoRedemption>({
  promoCodeId: { type: Schema.Types.ObjectId, ref: 'PromoCode', required: true, index: true },
  customerId: { type: Schema.Types.ObjectId, required: true, index: true },
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  discountAmount: { type: Number, required: true },
  redeemedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: Object.values(PromoRedemptionStatus),
    default: PromoRedemptionStatus.Applied,
  },
  reversedAt: { type: Date },
  reversalReason: { type: String },
});

promoRedemptionSchema.plugin(basePlugin);

export const PromoRedemption = model<IPromoRedemption>('PromoRedemption', promoRedemptionSchema);
