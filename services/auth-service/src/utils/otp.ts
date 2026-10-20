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
  const min = 100000;
  const max = 900000;
  const randomNumber = Math.floor(min + Math.random() * max);
  return randomNumber.toString();
}

export async function issueOtp(phone: string, purpose: OtpPurpose): Promise<void> {
  // Step 1: generate a new code and work out when it should expire
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  // Step 2: save it to the database
  await OtpCode.create({ phone, code, purpose, expiresAt });

  // Step 3: send it to the user
  await activeSender.send(phone, code, purpose);
}

export async function consumeOtp(phone: string, code: string, purpose: OtpPurpose): Promise<void> {
  // Step 1: find the most recent matching code that hasn't been used yet
  const otp = await OtpCode.findOne({ phone, code, purpose, consumedAt: { $exists: false } }).sort({
    createdAt: -1,
  });

  // Step 2: if none found, throw an error
  if (!otp) {
    throw new ApiError(400, 'INVALID_OTP', 'OTP is invalid or has expired');
  }

  // Step 3: if it has expired, throw an error
  const now = new Date();
  if (otp.expiresAt < now) {
    throw new ApiError(400, 'INVALID_OTP', 'OTP is invalid or has expired');
  }

  // Step 4: mark it as used so it can't be used again
  otp.consumedAt = now;
  await otp.save();
}
