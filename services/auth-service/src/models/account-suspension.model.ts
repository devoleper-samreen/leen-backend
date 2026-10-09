import { Role, SuspensionStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Role-agnostic so both customer and partner suspensions (reason + duration
 * per the flow doc) live in one collection. User.status stays as the
 * fast-access current value; this is the full history/detail layer.
 */
export interface IAccountSuspension extends Document {
  userId: Types.ObjectId;
  role: Role;
  reason: string;
  durationDays?: number;
  startsAt: Date;
  expiresAt?: Date;
  suspendedBy: Types.ObjectId;
  status: SuspensionStatus;
  liftedAt?: Date;
  liftedBy?: Types.ObjectId;
  note?: string;
}

const accountSuspensionSchema = new Schema<IAccountSuspension>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  role: { type: String, enum: Object.values(Role), required: true },
  reason: { type: String, required: true },
  durationDays: { type: Number },
  startsAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  suspendedBy: { type: Schema.Types.ObjectId, required: true },
  status: { type: String, enum: Object.values(SuspensionStatus), default: SuspensionStatus.Active },
  liftedAt: { type: Date },
  liftedBy: { type: Schema.Types.ObjectId },
  note: { type: String },
});

accountSuspensionSchema.plugin(basePlugin);

export const AccountSuspension = model<IAccountSuspension>(
  'AccountSuspension',
  accountSuspensionSchema,
);
