import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { ApiError, Role, UserStatus } from '@leen/shared';
import { User } from '../models/user.model';
import { CustomerProfile } from '../models/customer-profile.model';
import { issueOtp, consumeOtp } from '../utils/otp';
import { issueTokenPair, consumeRefreshToken, revokeAllRefreshTokensForUser, revokeRefreshToken } from '../utils/tokens';

const PASSWORD_SALT_ROUNDS = 10;

export async function signup(req: Request, res: Response): Promise<void> {
  // Step 1: get the fields from the request
  const { phone, email, password, fullName, language } = req.body;

  // Step 2: check if an account already exists for this phone or email
  let existingUser;
  if (email) {
    existingUser = await User.findOne({ $or: [{ phone }, { email }] });
  } else {
    existingUser = await User.findOne({ phone });
  }

  if (existingUser) {
    throw new ApiError(409, 'USER_EXISTS', 'An account with this phone or email already exists');
  }

  // Step 3: hash the password
  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  // Step 4: create the user
  const user = await User.create({ phone, email, passwordHash, role: Role.Customer, language });

  // Step 5: create the customer profile
  try {
    await CustomerProfile.create({ userId: user._id, fullName, addresses: [] });
  } catch (err) {
    // if the profile creation fails, delete the user so signup can be retried
    await User.deleteOne({ _id: user._id });
    throw err;
  }

  // Step 6: send the signup OTP
  let otpSent = true;
  try {
    await issueOtp(phone, 'signup');
  } catch (err) {
    otpSent = false;
    console.error('[auth-service] failed to send signup OTP', err);
  }

  // Step 7: send the response
  res.status(201).json({ success: true, data: { userId: user.id, phone: user.phone, otpSent } });
}

export async function login(req: Request, res: Response): Promise<void> {
  // Step 1: get the identifier (phone or email) and password
  const { identifier, password } = req.body;

  // Step 2: find the user by phone or email
  const user = await User.findOne({ $or: [{ phone: identifier }, { email: identifier }] });

  // Step 3: if no user found, throw an error
  if (!user) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Phone/email or password is incorrect');
  }

  // Step 4: check the password matches
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Phone/email or password is incorrect');
  }

  // Step 5: block suspended/deleted accounts
  if (user.status !== UserStatus.Active) {
    throw new ApiError(403, 'ACCOUNT_NOT_ACTIVE', `Account is ${user.status}`);
  }

  // Step 6: issue a new access + refresh token pair
  const tokens = await issueTokenPair(user.id, user.role);

  // Step 7: send the tokens back
  res.json({ success: true, data: tokens });
}

export async function sendOtp(req: Request, res: Response): Promise<void> {
  // Step 1: get the phone number and purpose from the request
  const { phone, purpose } = req.body;

  // Step 2: generate and send a new OTP code
  await issueOtp(phone, purpose);

  // Step 3: send the response
  res.json({ success: true, data: { phone, purpose } });
}

export async function verifyOtp(req: Request, res: Response): Promise<void> {
  // Step 1: get the phone, code and purpose from the request
  const { phone, code, purpose } = req.body;

  // Step 2: check the OTP is valid (throws an error if not)
  await consumeOtp(phone, code, purpose);

  // Step 3: if this OTP was for signup, find the user and log them in
  if (purpose === 'signup') {
    const user = await User.findOne({ phone });

    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'No account found for this phone number');
    }

    const tokens = await issueTokenPair(user.id, user.role);
    res.json({ success: true, data: tokens });
    return;
  }

  // Step 4: for other purposes, just confirm the code was valid
  res.json({ success: true, data: { phone, purpose, verified: true } });
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  // Step 1: get the refresh token from the request
  const refreshTokenValue = req.body.refreshToken;

  // Step 2: check it's valid and mark it as used
  const result = await consumeRefreshToken(refreshTokenValue);
  const userId = result.userId;

  // Step 3: find the user so we know their role
  const user = await User.findById(userId);

  // Step 4: if no user found, throw an error
  if (!user) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  // Step 5: issue a new access + refresh token pair
  const tokens = await issueTokenPair(user.id, user.role);

  // Step 6: send the new tokens back
  res.json({ success: true, data: tokens });
}

export async function logout(req: Request, res: Response): Promise<void> {
  // Step 1: get the refresh token from the request
  const refreshTokenValue = req.body.refreshToken;

  // Step 2: revoke it so it can't be used again
  await revokeRefreshToken(refreshTokenValue);

  // Step 3: send the success response
  res.json({ success: true, data: { loggedOut: true } });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  // Step 1: get the phone, OTP code and new password from the request
  const { phone, code, newPassword } = req.body;

  // Step 2: check the OTP is valid (throws an error if not)
  await consumeOtp(phone, code, 'reset_password');

  // Step 3: find the user with this phone number
  const user = await User.findOne({ phone });

  // Step 4: if no user found, throw an error
  if (!user) {
    throw new ApiError(404, 'USER_NOT_FOUND', 'No account found for this phone number');
  }

  // Step 5: hash the new password and save it
  const newPasswordHash = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);
  user.passwordHash = newPasswordHash;
  await user.save();

  // Step 6: log the user out from all other devices/sessions
  await revokeAllRefreshTokensForUser(user.id);

  // Step 7: send the success response
  res.json({ success: true, data: { reset: true } });
}
