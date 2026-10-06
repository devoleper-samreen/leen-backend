import { PartnerApprovalAction, PartnerServiceStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IPartnerServiceApprovalHistory extends Document {
  partnerServiceId: Types.ObjectId;
  partnerId: Types.ObjectId;
  action: PartnerApprovalAction;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  reason?: string;
  previousStatus?: PartnerServiceStatus;
  newStatus: PartnerServiceStatus;
}

const partnerServiceApprovalHistorySchema = new Schema<IPartnerServiceApprovalHistory>({
  partnerServiceId: { type: Schema.Types.ObjectId, required: true, index: true },
  partnerId: { type: Schema.Types.ObjectId, required: true, index: true },
  action: { type: String, enum: Object.values(PartnerApprovalAction), required: true },
  reviewedBy: { type: Schema.Types.ObjectId },
  reviewedAt: { type: Date },
  reason: { type: String },
  previousStatus: { type: String, enum: Object.values(PartnerServiceStatus) },
  newStatus: { type: String, enum: Object.values(PartnerServiceStatus), required: true },
});

partnerServiceApprovalHistorySchema.plugin(basePlugin);

export const PartnerServiceApprovalHistory = model<IPartnerServiceApprovalHistory>(
  'PartnerServiceApprovalHistory',
  partnerServiceApprovalHistorySchema,
);
