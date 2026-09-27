import { basePlugin } from '@leen/shared';
import { Schema, model, Document } from 'mongoose';

export interface IOtpCode extends Document {
  phone: string;
  code: string;
  purpose: 'login' | 'signup' | 'reset_password';
  expiresAt: Date;
  consumedAt?: Date;
}

const otpCodeSchema = new Schema<IOtpCode>({
  phone: { type: String, required: true, index: true },
  code: { type: String, required: true },
  purpose: {
    type: String,
    enum: ['login', 'signup', 'reset_password'],
    required: true,
  },
  expiresAt: { type: Date, required: true },
  consumedAt: { type: Date },
});

otpCodeSchema.plugin(basePlugin);

export const OtpCode = model<IOtpCode>('OtpCode', otpCodeSchema);
