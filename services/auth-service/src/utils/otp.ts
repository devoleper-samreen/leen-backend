import { ApiError } from '@leen/shared';
import { OtpCode, IOtpCode } from '../models/otp-code.model';

type OtpPurpose = IOtpCode['purpose'];

const OTP_TTL_MINUTES = 5;

export interface OtpSender {
  send(phone: string, code: string, purpose: OtpPurpose): Promise<void>;
}

// Logs instead of dialing a real SMS provider until one is confirmed; swap
// this implementation out without touching any call site.
const consoleOtpSender: OtpSender = {
  async send(phone, code, purpose) {
    // eslint-disable-next-line no-console
    console.log(`[otp] ${purpose} code for ${phone}: ${code}`);
  },
};

let activeSender: OtpSender = consoleOtpSender;

export function setOtpSender(sender: OtpSender): void {
  activeSender = sender;
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function issueOtp(phone: string, purpose: OtpPurpose): Promise<void> {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await OtpCode.create({ phone, code, purpose, expiresAt });
  await activeSender.send(phone, code, purpose);
}

export async function consumeOtp(phone: string, code: string, purpose: OtpPurpose): Promise<void> {
  const otp = await OtpCode.findOne({ phone, code, purpose, consumedAt: { $exists: false } }).sort({
    createdAt: -1,
  });

  if (!otp || otp.expiresAt < new Date()) {
    throw new ApiError(400, 'INVALID_OTP', 'OTP is invalid or has expired');
  }

  otp.consumedAt = new Date();
  await otp.save();
}
