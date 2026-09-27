import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IReport extends Document {
  type: string;
  filters: Record<string, unknown>;
  generatedFileUrl?: string;
  requestedBy: Types.ObjectId;
  status: 'pending' | 'ready' | 'failed';
}

const reportSchema = new Schema<IReport>({
  type: { type: String, required: true },
  filters: { type: Schema.Types.Mixed, default: {} },
  generatedFileUrl: { type: String },
  requestedBy: { type: Schema.Types.ObjectId, required: true, index: true },
  status: { type: String, enum: ['pending', 'ready', 'failed'], default: 'pending' },
});

reportSchema.plugin(basePlugin);

export const Report = model<IReport>('Report', reportSchema);
