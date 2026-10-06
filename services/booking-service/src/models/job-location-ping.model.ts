import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * High-volume GPS trail for live tracking (customer sees tasker movement +
 * ETA). TTL-indexed on recordedAt - retention doesn't need to be permanent,
 * only the live-tracking window does.
 */
export interface IJobLocationPing extends Document {
  bookingId: Types.ObjectId;
  staffId: Types.ObjectId;
  lat: number;
  lng: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  recordedAt: Date;
}

const jobLocationPingSchema = new Schema<IJobLocationPing>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  staffId: { type: Schema.Types.ObjectId, required: true, index: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  accuracy: { type: Number },
  speed: { type: Number },
  heading: { type: Number },
  recordedAt: { type: Date, default: Date.now, expires: '48h' },
});

jobLocationPingSchema.plugin(basePlugin);

export const JobLocationPing = model<IJobLocationPing>('JobLocationPing', jobLocationPingSchema);
