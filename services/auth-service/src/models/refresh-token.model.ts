import { basePlugin } from '@leen/shared';
import { Schema, model, Document, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: { type: Schema.Types.ObjectId, required: true, index: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date },
});

refreshTokenSchema.plugin(basePlugin);

export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);
