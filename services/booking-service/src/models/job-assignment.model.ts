import { JobAssignmentStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Full staff-assignment history - Booking.staffId only holds the current
 * assignee, which can't answer "who was assigned before, and why were they
 * reassigned."
 */
export interface IJobAssignment extends Document {
  bookingId: Types.ObjectId;
  staffId: Types.ObjectId;
  partnerId: Types.ObjectId;
  assignedBy: Types.ObjectId;
  assignedAt: Date;
  status: JobAssignmentStatus;
  unassignedAt?: Date;
  reason?: string;
}

const jobAssignmentSchema = new Schema<IJobAssignment>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  staffId: { type: Schema.Types.ObjectId, required: true, index: true },
  partnerId: { type: Schema.Types.ObjectId, required: true },
  assignedBy: { type: Schema.Types.ObjectId, required: true },
  assignedAt: { type: Date, default: Date.now },
  status: { type: String, enum: Object.values(JobAssignmentStatus), default: JobAssignmentStatus.Active },
  unassignedAt: { type: Date },
  reason: { type: String },
});

jobAssignmentSchema.plugin(basePlugin);

export const JobAssignment = model<IJobAssignment>('JobAssignment', jobAssignmentSchema);
