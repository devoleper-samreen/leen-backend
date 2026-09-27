import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

interface ISurgeWindow {
  adjustmentPct: number;
  startDate: Date;
  endDate: Date;
  startHour: number;
  endHour: number;
}

export interface IPricingTier extends Document {
  categoryId: Types.ObjectId;
  tierName: string;
  basePriceOmr: number;
  surgeWindows: ISurgeWindow[];
}

const surgeWindowSchema = new Schema<ISurgeWindow>(
  {
    adjustmentPct: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startHour: { type: Number, min: 0, max: 23, required: true },
    endHour: { type: Number, min: 0, max: 23, required: true },
  },
  { _id: false },
);

const pricingTierSchema = new Schema<IPricingTier>({
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  tierName: { type: String, required: true },
  basePriceOmr: { type: Number, required: true },
  surgeWindows: { type: [surgeWindowSchema], default: [] },
});

pricingTierSchema.plugin(basePlugin);

export const PricingTier = model<IPricingTier>('PricingTier', pricingTierSchema);
