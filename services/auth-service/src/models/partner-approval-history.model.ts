import { PartnerApprovalAction, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export type PartnerApprovalTrigger = 'onboarding' | 'service_change' | 'coverage_change';

/**
 * Whole-partner (KYB/onboarding) approval history - distinct from
 * PartnerServiceApprovalHistory, which tracks approval per individual
 * service the partner offers. PartnerProfile.approvalStatus stays as the
 * fast-access current value.
 */
export interface IPartnerApprovalHistory extends Document {
  partnerId: Types.ObjectId;
  action: PartnerApprovalAction;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  reason?: string;
  resubmissionCount: number;
  triggeredBy: PartnerApprovalTrigger;
}

const partnerApprovalHistorySchema = new Schema<IPartnerApprovalHistory>({
  partnerId: { type: Schema.Types.ObjectId, required: true, index: true },
  action: { type: String, enum: Object.values(PartnerApprovalAction), required: true },
  reviewedBy: { type: Schema.Types.ObjectId },
  reviewedAt: { type: Date },
  reason: { type: String },
  resubmissionCount: { type: Number, default: 0 },
  triggeredBy: {
    type: String,
    enum: ['onboarding', 'service_change', 'coverage_change'],
    required: true,
  },
});

partnerApprovalHistorySchema.plugin(basePlugin);

export const PartnerApprovalHistory = model<IPartnerApprovalHistory>(
  'PartnerApprovalHistory',
  partnerApprovalHistorySchema,
);
