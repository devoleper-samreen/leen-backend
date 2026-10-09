import { FraudRecordStatus, Role, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Separate from AccountSuspension - fraud-listing is a distinct, more severe
 * flow per the spec ("reject + block -> add to fraud list -> delete account").
 */
export interface IFraudRecord extends Document {
  userId: Types.ObjectId;
  role: Role;
  reason: string;
  reportedBy: Types.ObjectId;
  reportedAt: Date;
  status: FraudRecordStatus;
  evidence: string[];
  clearedAt?: Date;
  clearedBy?: Types.ObjectId;
}

const fraudRecordSchema = new Schema<IFraudRecord>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  role: { type: String, enum: Object.values(Role), required: true },
  reason: { type: String, required: true },
  reportedBy: { type: Schema.Types.ObjectId, required: true },
  reportedAt: { type: Date, default: Date.now },
  status: { type: String, enum: Object.values(FraudRecordStatus), default: FraudRecordStatus.Flagged },
  evidence: { type: [String], default: [] },
  clearedAt: { type: Date },
  clearedBy: { type: Schema.Types.ObjectId },
});

fraudRecordSchema.plugin(basePlugin);

export const FraudRecord = model<IFraudRecord>('FraudRecord', fraudRecordSchema);
