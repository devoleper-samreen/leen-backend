import { DataDeletionStatus, Role, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * GDPR right-to-erasure audit trail - records when a deletion request came
 * in and when it was actually completed, not just a status flag on User.
 */
export interface IDataDeletionRequest extends Document {
  userId: Types.ObjectId;
  role: Role;
  requestedAt: Date;
  requestedBy: Types.ObjectId;
  status: DataDeletionStatus;
  completedAt?: Date;
  reason?: string;
  note?: string;
}

const dataDeletionRequestSchema = new Schema<IDataDeletionRequest>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  role: { type: String, enum: Object.values(Role), required: true },
  requestedAt: { type: Date, default: Date.now },
  requestedBy: { type: Schema.Types.ObjectId, required: true },
  status: { type: String, enum: Object.values(DataDeletionStatus), default: DataDeletionStatus.Pending },
  completedAt: { type: Date },
  reason: { type: String },
  note: { type: String },
});

dataDeletionRequestSchema.plugin(basePlugin);

export const DataDeletionRequest = model<IDataDeletionRequest>(
  'DataDeletionRequest',
  dataDeletionRequestSchema,
);
