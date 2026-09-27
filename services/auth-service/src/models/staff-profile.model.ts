import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IStaffProfile extends Document {
  userId: Types.ObjectId;
  partnerId: Types.ObjectId;
  fullName: string;
  probationEndsAt?: Date;
  isOnProbation: boolean;
}

const staffProfileSchema = new Schema<IStaffProfile>({
  userId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
  partnerId: { type: Schema.Types.ObjectId, required: true, index: true },
  fullName: { type: String, required: true },
  probationEndsAt: { type: Date },
  isOnProbation: { type: Boolean, default: true },
});

staffProfileSchema.plugin(basePlugin);

export const StaffProfile = model<IStaffProfile>('StaffProfile', staffProfileSchema);
