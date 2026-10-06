import { JobOfferResponse, basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

/**
 * One document per partner per broadcast, so the system can answer "who
 * received this job, who accepted first, and when" - not just the winner.
 */
export interface IJobOffer extends Document {
  bookingId: Types.ObjectId;
  partnerId: Types.ObjectId;
  sentAt: Date;
  expiresAt: Date;
  response: JobOfferResponse;
  respondedAt?: Date;
  distanceKm?: number;
  estimatedEarning?: number;
  rank?: number;
  rejectionReason?: string;
}

const jobOfferSchema = new Schema<IJobOffer>({
  bookingId: { type: Schema.Types.ObjectId, required: true, index: true },
  partnerId: { type: Schema.Types.ObjectId, required: true, index: true },
  sentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  response: { type: String, enum: Object.values(JobOfferResponse), default: JobOfferResponse.Pending },
  respondedAt: { type: Date },
  distanceKm: { type: Number },
  estimatedEarning: { type: Number },
  rank: { type: Number },
  rejectionReason: { type: String },
});

jobOfferSchema.plugin(basePlugin);

export const JobOffer = model<IJobOffer>('JobOffer', jobOfferSchema);
