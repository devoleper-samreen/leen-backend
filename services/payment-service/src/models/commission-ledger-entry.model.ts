import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface ICommissionLedgerEntry extends Document {
  bookingId: Types.ObjectId;
  partnerId: Types.ObjectId;
  jobAmount: number;
  commissionRatePct: number;
  commissionAmount: number;
}

const commissionLedgerEntrySchema = new Schema<ICommissionLedgerEntry>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  partnerId: { type: Schema.Types.ObjectId, required: true, index: true },
  jobAmount: { type: Number, required: true },
  commissionRatePct: { type: Number, required: true },
  commissionAmount: { type: Number, required: true },
});

commissionLedgerEntrySchema.plugin(basePlugin);

export const CommissionLedgerEntry = model<ICommissionLedgerEntry>(
  'CommissionLedgerEntry',
  commissionLedgerEntrySchema,
);
