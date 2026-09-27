import {
  DisputeFault,
  DisputeOutcome,
  DisputePriority,
  DisputeStatus,
  basePlugin,
} from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export type DisputeCategory =
  | 'service_issue'
  | 'poor_quality'
  | 'service_incomplete'
  | 'damage'
  | 'refund_request'
  | 'other';

interface IEvidence {
  submittedByRole: 'customer' | 'partner' | 'admin';
  url: string;
  note?: string;
  submittedAt: Date;
}

export interface IDispute extends Document {
  bookingId: Types.ObjectId;
  raisedByRole: 'customer' | 'partner';
  raisedById: Types.ObjectId;
  category: DisputeCategory;
  evidence: IEvidence[];
  priority: DisputePriority;
  slaDeadline?: Date;
  faultDecision?: DisputeFault;
  outcome?: DisputeOutcome;
  status: DisputeStatus;
}

const evidenceSchema = new Schema<IEvidence>(
  {
    submittedByRole: { type: String, enum: ['customer', 'partner', 'admin'], required: true },
    url: { type: String, required: true },
    note: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const disputeSchema = new Schema<IDispute>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  raisedByRole: { type: String, enum: ['customer', 'partner'], required: true },
  raisedById: { type: Schema.Types.ObjectId, required: true },
  category: {
    type: String,
    enum: ['service_issue', 'poor_quality', 'service_incomplete', 'damage', 'refund_request', 'other'],
    required: true,
  },
  evidence: { type: [evidenceSchema], default: [] },
  priority: { type: String, enum: Object.values(DisputePriority), default: DisputePriority.Medium },
  slaDeadline: { type: Date },
  faultDecision: { type: String, enum: Object.values(DisputeFault) },
  outcome: { type: String, enum: Object.values(DisputeOutcome) },
  status: { type: String, enum: Object.values(DisputeStatus), default: DisputeStatus.Open },
});

disputeSchema.plugin(basePlugin);

export const Dispute = model<IDispute>('Dispute', disputeSchema);
