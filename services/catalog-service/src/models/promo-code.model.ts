import { PublishStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IPromoCode extends Document {
  code: string;
  categoryIds: Types.ObjectId[];
  subCategoryIds: Types.ObjectId[];
  discountPct: number;
  expiresAt: Date;
  maxUses: number;
  usedCount: number;
  leenAbsorbs: boolean;
  status: PublishStatus;
}

const promoCodeSchema = new Schema<IPromoCode>({
  code: { type: String, required: true, unique: true, uppercase: true },
  categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  subCategoryIds: [{ type: Schema.Types.ObjectId, ref: 'SubCategory' }],
  discountPct: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
  maxUses: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
  leenAbsorbs: { type: Boolean, default: false },
  status: { type: String, enum: Object.values(PublishStatus), default: PublishStatus.Draft },
});

promoCodeSchema.plugin(basePlugin);

export const PromoCode = model<IPromoCode>('PromoCode', promoCodeSchema);
