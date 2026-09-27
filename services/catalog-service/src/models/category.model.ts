import { LocalizedText, PublishStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';
import { localizedTextSchema } from './common/localized-text.schema';

export interface ICategory extends Document {
  name: LocalizedText;
  icon?: string;
  status: PublishStatus;
}

const categorySchema = new Schema<ICategory>({
  name: { type: localizedTextSchema, required: true },
  icon: { type: String },
  status: { type: String, enum: Object.values(PublishStatus), default: PublishStatus.Draft },
});

categorySchema.plugin(basePlugin);

export const Category = model<ICategory>('Category', categorySchema);

export interface ISubCategory extends Document {
  name: LocalizedText;
  icon?: string;
  parentCategoryId: Types.ObjectId;
  coverageCityIds: Types.ObjectId[];
  status: PublishStatus;
}

const subCategorySchema = new Schema<ISubCategory>({
  name: { type: localizedTextSchema, required: true },
  icon: { type: String },
  parentCategoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  coverageCityIds: [{ type: Schema.Types.ObjectId, ref: 'City' }],
  status: { type: String, enum: Object.values(PublishStatus), default: PublishStatus.Draft },
});

subCategorySchema.plugin(basePlugin);

export const SubCategory = model<ISubCategory>('SubCategory', subCategorySchema);
