import { AvailabilityStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

interface IWorkingHours {
  start: string;
  end: string;
}

interface IBreakPeriod {
  startTime: string;
  endTime: string;
  reason?: string;
}

/**
 * Backend-usable availability data for the job-matching engine, not just a
 * profile display field - workingDays/workingHours/breaks let matching
 * logic decide who is eligible for a broadcast right now.
 */
export interface IPartnerAvailability extends Document {
  partnerId: Types.ObjectId;
  workingDays: number[];
  workingHours: IWorkingHours;
  timezone: string;
  status: AvailabilityStatus;
  effectiveFrom: Date;
  effectiveTo?: Date;
  breaks: IBreakPeriod[];
}

const workingHoursSchema = new Schema<IWorkingHours>(
  { start: { type: String, required: true }, end: { type: String, required: true } },
  { _id: false },
);

const breakPeriodSchema = new Schema<IBreakPeriod>(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    reason: { type: String },
  },
  { _id: false },
);

const partnerAvailabilitySchema = new Schema<IPartnerAvailability>({
  partnerId: { type: Schema.Types.ObjectId, required: true, index: true },
  workingDays: { type: [Number], default: [] },
  workingHours: { type: workingHoursSchema, required: true },
  timezone: { type: String, required: true, default: 'Asia/Muscat' },
  status: {
    type: String,
    enum: Object.values(AvailabilityStatus),
    default: AvailabilityStatus.Available,
  },
  effectiveFrom: { type: Date, required: true, default: Date.now },
  effectiveTo: { type: Date },
  breaks: { type: [breakPeriodSchema], default: [] },
});

partnerAvailabilitySchema.plugin(basePlugin);

export const PartnerAvailability = model<IPartnerAvailability>(
  'PartnerAvailability',
  partnerAvailabilitySchema,
);
