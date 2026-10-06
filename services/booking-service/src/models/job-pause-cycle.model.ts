import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Dedicated collection (rather than derived from JobEvent pairs) so pause
 * duration is reliably stored for actual-working-time calculations.
 */
export interface IJobPauseCycle extends Document {
  bookingId: Types.ObjectId;
  pausedAt: Date;
  resumedAt?: Date;
  durationSeconds?: number;
  restartOtpVerified: boolean;
  reason?: string;
}

const jobPauseCycleSchema = new Schema<IJobPauseCycle>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  pausedAt: { type: Date, required: true },
  resumedAt: { type: Date },
  durationSeconds: { type: Number },
  restartOtpVerified: { type: Boolean, default: false },
  reason: { type: String },
});

jobPauseCycleSchema.plugin(basePlugin);

export const JobPauseCycle = model<IJobPauseCycle>('JobPauseCycle', jobPauseCycleSchema);
