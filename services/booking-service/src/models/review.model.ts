import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  bookingId: Types.ObjectId;
  raterRole: 'customer' | 'partner' | 'staff';
  rateeId: Types.ObjectId;
  stars: number;
  tags: string[];
  text?: string;
}

const reviewSchema = new Schema<IReview>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  raterRole: { type: String, enum: ['customer', 'partner', 'staff'], required: true },
  rateeId: { type: Schema.Types.ObjectId, required: true, index: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  tags: { type: [String], default: [] },
  text: { type: String },
});

reviewSchema.plugin(basePlugin);

export const Review = model<IReview>('Review', reviewSchema);
