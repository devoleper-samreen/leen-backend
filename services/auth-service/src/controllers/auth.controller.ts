import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { ApiError, Role, UserStatus } from '@leen/shared';
import { User } from '../models/user.model';
import { CustomerProfile } from '../models/customer-profile.model';
import { issueOtp, consumeOtp } from '../utils/otp';
import { issueTokenPair, consumeRefreshToken, revokeRefreshToken } from '../utils/tokens';

const PASSWORD_SALT_ROUNDS = 10;

export async function signup(req: Request, res: Response): Promise<void> {
  const { phone, email, password, fullName, language } = req.body;

  const existing = await User.findOne(email ? { $or: [{ phone }, { email }] } : { phone });
  if (existing) {
    throw new ApiError(409, 'USER_EXISTS', 'An account with this phone or email already exists');
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  const user = await User.create({ phone, email, passwordHash, role: Role.Customer, language });
  await CustomerProfile.create({ userId: user._id, fullName, addresses: [] });

  await issueOtp(phone, 'signup');

  res.status(201).json({ success: true, data: { userId: user.id, phone: user.phone } });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { identifier, password } = req.body;

  const user = await User.findOne({ $or: [{ phone: identifier }, { email: identifier }] });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Phone/email or password is incorrect');
  }

  if (user.status !== UserStatus.Active) {
    throw new ApiError(403, 'ACCOUNT_NOT_ACTIVE', `Account is ${user.status}`);
  }

  const tokens = await issueTokenPair(user.id, user.role);
  res.json({ success: true, data: tokens });
}

export async function sendOtp(req: Request, res: Response): Promise<void> {
  const { phone, purpose } = req.body;
  await issueOtp(phone, purpose);
  res.json({ success: true, data: { phone, purpose } });
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
  const { phone, code, purpose } = req.body;
  await consumeOtp(phone, code, purpose);

  if (purpose === 'signup') {
    const user = await User.findOne({ phone });
    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'No account found for this phone number');
    }
    const tokens = await issueTokenPair(user.id, user.role);
    res.json({ success: true, data: tokens });
    return;
  }

  res.json({ success: true, data: { phone, purpose, verified: true } });
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const { refreshToken: token } = req.body;
  const { userId } = await consumeRefreshToken(token);

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  const tokens = await issueTokenPair(user.id, user.role);
  res.json({ success: true, data: tokens });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const { refreshToken: token } = req.body;
  await revokeRefreshToken(token);
  res.json({ success: true, data: { loggedOut: true } });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { phone, code, newPassword } = req.body;
  await consumeOtp(phone, code, 'reset_password');

  const user = await User.findOne({ phone });
  if (!user) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'No account found for this phone number');
  }

  user.passwordHash = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);
  await user.save();

  res.json({ success: true, data: { reset: true } });
}
