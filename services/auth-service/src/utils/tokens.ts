import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ApiError, Role } from '@leen/shared';
import { RefreshToken } from '../models/refresh-token.model';

const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30);

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function signAccessToken(userId: string, role: Role): string {
  const payload = { id: userId, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function issueTokenPair(userId: string, role: Role): Promise<TokenPair> {
  // Step 1: create the access token
  const accessToken = signAccessToken(userId, role);

  // Step 2: create a random refresh token
  const refreshToken = crypto.randomBytes(40).toString('hex');

  // Step 3: work out when the refresh token should expire
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  // Step 4: save the hashed refresh token to the database (never store it in plain text)
  const refreshTokenHash = hashToken(refreshToken);
  await RefreshToken.create({ userId, tokenHash: refreshTokenHash, expiresAt });

  // Step 5: return both tokens
  return { accessToken, refreshToken };
}

// One-time use: the matching record is revoked immediately so a stolen
// refresh token can't be replayed after the legitimate client rotates it.
export async function consumeRefreshToken(token: string): Promise<{ userId: string }> {
  // Step 1: find the matching, not-yet-revoked refresh token record
  const tokenHash = hashToken(token);
  const existing = await RefreshToken.findOne({ tokenHash, revokedAt: { $exists: false } });

  // Step 2: if none found, throw an error
  if (!existing) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  // Step 3: if it has expired, throw an error
  const now = new Date();
  if (existing.expiresAt < now) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  // Step 4: revoke it so it can't be used again
  existing.revokedAt = now;
  await existing.save();

  // Step 5: return the user id it belonged to
  return { userId: existing.userId.toString() };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await RefreshToken.updateOne({ tokenHash, revokedAt: { $exists: false } }, { revokedAt: new Date() });
}

// Used after a password reset so every other device/session is forced to
// log in again with the new password instead of staying signed in.
export async function revokeAllRefreshTokensForUser(userId: string): Promise<void> {
  await RefreshToken.updateMany({ userId, revokedAt: { $exists: false } }, { revokedAt: new Date() });
}
