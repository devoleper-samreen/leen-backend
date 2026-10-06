import { PartnerServiceStatus, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * Authoritative record of which catalog services a partner is approved to
 * provide. PartnerProfile keeps a quick-access categories[] list, but this
 * collection (plus PartnerServiceApprovalHistory) is the source of truth -
 * per-service status, coverage and re-approval state don't fit on the profile.
 */
export interface IPartnerService extends Document {
  partnerId: Types.ObjectId;
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  serviceId: Types.ObjectId;
  status: PartnerServiceStatus;
  coverageCityIds: Types.ObjectId[];
  coverageRadiusKm?: number;
  requiresReapproval: boolean;
  addedAt: Date;
  removedAt?: Date;
}

const partnerServiceSchema = new Schema<IPartnerService>({
  partnerId: { type: Schema.Types.ObjectId, required: true, index: true },
  categoryId: { type: Schema.Types.ObjectId, required: true },
  subCategoryId: { type: Schema.Types.ObjectId, required: true },
  serviceId: { type: Schema.Types.ObjectId, required: true },
  status: {
    type: String,
    enum: Object.values(PartnerServiceStatus),
    default: PartnerServiceStatus.PendingApproval,
  },
  coverageCityIds: [{ type: Schema.Types.ObjectId }],
  coverageRadiusKm: { type: Number },
  requiresReapproval: { type: Boolean, default: false },
  addedAt: { type: Date, default: Date.now },
  removedAt: { type: Date },
});

partnerServiceSchema.plugin(basePlugin);

export const PartnerService = model<IPartnerService>('PartnerService', partnerServiceSchema);
