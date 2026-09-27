import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export type PartnerApprovalStatus = 'under_review' | 'approved' | 'rejected';

export interface IPartnerProfile extends Document {
  userId: Types.ObjectId;
  fullName: string;
  photoUrl?: string;
  dob?: Date;
  idNumber: string;
  companyRegistrationNumber: string;
  commissionRatePct: number;
  slaAgreementSignedAt?: Date;
  categories: Types.ObjectId[];
  coverageRadiusKm?: number;
  coverageZones: string[];
  approvalStatus: PartnerApprovalStatus;
  rejectionReason?: string;
}

const partnerProfileSchema = new Schema<IPartnerProfile>({
  userId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  photoUrl: { type: String },
  dob: { type: Date },
  idNumber: { type: String, required: true },
  companyRegistrationNumber: { type: String, required: true },
  commissionRatePct: { type: Number, required: true, default: 0 },
  slaAgreementSignedAt: { type: Date },
  categories: [{ type: Schema.Types.ObjectId }],
  coverageRadiusKm: { type: Number },
  coverageZones: { type: [String], default: [] },
  approvalStatus: {
    type: String,
    enum: ['under_review', 'approved', 'rejected'],
    default: 'under_review',
  },
  rejectionReason: { type: String },
});

partnerProfileSchema.plugin(basePlugin);

export const PartnerProfile = model<IPartnerProfile>('PartnerProfile', partnerProfileSchema);
