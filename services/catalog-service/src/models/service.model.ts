import { LocalizedText, PublishStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';
import { localizedTextSchema } from './common/localized-text.schema';

export interface IService extends Document {
  subCategoryId: Types.ObjectId;
  name: LocalizedText;
  tier?: string;
  description?: LocalizedText;
  status: PublishStatus;
}

const serviceSchema = new Schema<IService>({
  subCategoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true, index: true },
  name: { type: localizedTextSchema, required: true },
  tier: { type: String },
  description: { type: localizedTextSchema },
  status: { type: String, enum: Object.values(PublishStatus), default: PublishStatus.Draft },
});

serviceSchema.plugin(basePlugin);

export const Service = model<IService>('Service', serviceSchema);
