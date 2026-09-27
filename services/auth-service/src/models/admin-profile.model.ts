import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IAdminProfile extends Document {
  userId: Types.ObjectId;
  fullName: string;
  roleId?: Types.ObjectId;
  isSuperAdmin: boolean;
}

const adminProfileSchema = new Schema<IAdminProfile>({
  userId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
  isSuperAdmin: { type: Boolean, default: false },
});

adminProfileSchema.plugin(basePlugin);

export const AdminProfile = model<IAdminProfile>('AdminProfile', adminProfileSchema);
