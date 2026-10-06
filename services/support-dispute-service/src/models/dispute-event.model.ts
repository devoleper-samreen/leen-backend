import { DisputeEventType, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Full dispute timeline - messages, evidence submissions, status changes and
 * admin actions all in one append-only log, so it's always possible to
 * determine who did what and when. Dispute.evidence[] stays as a
 * quick-access list.
 */
export interface IDisputeEvent extends Document {
  disputeId: Types.ObjectId;
  eventType: DisputeEventType;
  actorRole: 'customer' | 'partner' | 'admin';
  actorId?: Types.ObjectId;
  occurredAt: Date;
  payload?: Record<string, unknown>;
}

const disputeEventSchema = new Schema<IDisputeEvent>({
  disputeId: { type: Schema.Types.ObjectId, ref: 'Dispute', required: true, index: true },
  eventType: { type: String, enum: Object.values(DisputeEventType), required: true },
  actorRole: { type: String, enum: ['customer', 'partner', 'admin'], required: true },
  actorId: { type: Schema.Types.ObjectId },
  occurredAt: { type: Date, default: Date.now },
  payload: { type: Schema.Types.Mixed },
});

disputeEventSchema.plugin(basePlugin);

export const DisputeEvent = model<IDisputeEvent>('DisputeEvent', disputeEventSchema);
