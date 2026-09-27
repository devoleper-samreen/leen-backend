import { PublishStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

interface IJobTemplateField {
  key: string;
  label: string;
  type: 'price' | 'duration' | 'modifier';
  value?: string;
}

export interface IJobTemplate extends Document {
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  fields: IJobTemplateField[];
  status: PublishStatus;
}

const jobTemplateFieldSchema = new Schema<IJobTemplateField>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['price', 'duration', 'modifier'], required: true },
    value: { type: String },
  },
  { _id: false },
);

const jobTemplateSchema = new Schema<IJobTemplate>({
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  subCategoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true, index: true },
  fields: { type: [jobTemplateFieldSchema], default: [] },
  status: { type: String, enum: Object.values(PublishStatus), default: PublishStatus.Draft },
});

jobTemplateSchema.plugin(basePlugin);

export const JobTemplate = model<IJobTemplate>('JobTemplate', jobTemplateSchema);
