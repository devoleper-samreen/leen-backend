import { LocalizedText, PublishStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document } from 'mongoose';
import { localizedTextSchema } from './common/localized-text.schema';

export interface ICity extends Document {
  name: LocalizedText;
  status: PublishStatus;
}

const citySchema = new Schema<ICity>({
  name: { type: localizedTextSchema, required: true },
  status: { type: String, enum: Object.values(PublishStatus), default: PublishStatus.Draft },
});

citySchema.plugin(basePlugin);

export const City = model<ICity>('City', citySchema);
