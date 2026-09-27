import { Role, UserStatus } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';
import { basePlugin } from '@leen/shared';

export interface IUser extends Document {
  _id: Types.ObjectId;
  phone: string;
  email?: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  language: 'en' | 'ar';
}

const userSchema = new Schema<IUser>({
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: Object.values(Role), required: true },
  status: { type: String, enum: Object.values(UserStatus), default: UserStatus.Active },
  language: { type: String, enum: ['en', 'ar'], default: 'en' },
});

userSchema.plugin(basePlugin);

export const User = model<IUser>('User', userSchema);
