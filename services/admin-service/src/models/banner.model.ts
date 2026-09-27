import { PublishStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IBanner extends Document {
  categoryId?: Types.ObjectId;
  imageUrl: string;
  status: PublishStatus;
}

const bannerSchema = new Schema<IBanner>({
  categoryId: { type: Schema.Types.ObjectId },
  imageUrl: { type: String, required: true },
  status: { type: String, enum: Object.values(PublishStatus), default: PublishStatus.Draft },
});

bannerSchema.plugin(basePlugin);

export const Banner = model<IBanner>('Banner', bannerSchema);
