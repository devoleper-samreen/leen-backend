import { JobEventType, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Generalizes the previous booking-status-only history log into the full
 * job execution timeline (on-the-way, arrived, OTPs, photos, extra time,
 * remarks, completion...), so the job can be fully reconstructed after the
 * fact. `payload` holds event-specific data (e.g. {fromStatus,toStatus} for
 * status_changed, {photoUrl} for photo events, {text} for remarks) - one
 * append-only collection instead of several narrow ones per event kind.
 */
export interface IJobEvent extends Document {
  bookingId: Types.ObjectId;
  eventType: JobEventType;
  actorRole: 'customer' | 'partner' | 'staff' | 'admin' | 'system';
  actorId?: Types.ObjectId;
  occurredAt: Date;
  payload?: Record<string, unknown>;
}

const jobEventSchema = new Schema<IJobEvent>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  eventType: { type: String, enum: Object.values(JobEventType), required: true },
  actorRole: {
    type: String,
    enum: ['customer', 'partner', 'staff', 'admin', 'system'],
    required: true,
  },
  actorId: { type: Schema.Types.ObjectId },
  occurredAt: { type: Date, default: Date.now },
  payload: { type: Schema.Types.Mixed },
});

jobEventSchema.plugin(basePlugin);

export const JobEvent = model<IJobEvent>('JobEvent', jobEventSchema);
