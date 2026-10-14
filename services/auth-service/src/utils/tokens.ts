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
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function issueTokenPair(userId: string, role: Role): Promise<TokenPair> {
  const accessToken = signAccessToken(userId, role);
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await RefreshToken.create({ userId, tokenHash: hashToken(refreshToken), expiresAt });

  return { accessToken, refreshToken };
}

// One-time use: the matching record is revoked immediately so a stolen
// refresh token can't be replayed after the legitimate client rotates it.
export async function consumeRefreshToken(token: string): Promise<{ userId: string }> {
  const tokenHash = hashToken(token);
  const existing = await RefreshToken.findOne({ tokenHash, revokedAt: { $exists: false } });

  if (!existing || existing.expiresAt < new Date()) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired refresh token');
  }

  existing.revokedAt = new Date();
  await existing.save();

  return { userId: existing.userId.toString() };
}

export async function revokeRefreshToken(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  await RefreshToken.updateOne({ tokenHash, revokedAt: { $exists: false } }, { revokedAt: new Date() });
}
