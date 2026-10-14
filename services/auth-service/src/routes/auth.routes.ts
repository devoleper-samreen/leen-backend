import { Router } from 'express';
import { asyncHandler, createRateLimiter, validateBody } from '@leen/shared';
import { login, logout, refreshToken, resetPassword, sendOtp, signup, verifyOtp } from '../controllers/auth.controller';
import {
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  sendOtpSchema,
  signupSchema,
  verifyOtpSchema,
} from '../validators/auth.validators';

export const authRouter = Router();

// Brute-force guard on the endpoints an attacker would actually hammer
// (credential/OTP guessing); signup and token refresh don't need it.
const authAttemptLimiter = createRateLimiter(15 * 60 * 1000, 5);
// Tighter limit on OTP dispatch specifically, since each send costs money
// once a real SMS provider is wired in.
const otpSendLimiter = createRateLimiter(10 * 60 * 1000, 3);

authRouter.post('/signup', validateBody(signupSchema), asyncHandler(signup));
authRouter.post('/login', authAttemptLimiter, validateBody(loginSchema), asyncHandler(login));
authRouter.post('/otp/send', otpSendLimiter, validateBody(sendOtpSchema), asyncHandler(sendOtp));
authRouter.post('/otp/verify', authAttemptLimiter, validateBody(verifyOtpSchema), asyncHandler(verifyOtp));
authRouter.post('/token/refresh', validateBody(refreshTokenSchema), asyncHandler(refreshToken));
authRouter.post('/logout', validateBody(refreshTokenSchema), asyncHandler(logout));
authRouter.post(
  '/password/reset',
  authAttemptLimiter,
  validateBody(resetPasswordSchema),
  asyncHandler(resetPassword),
);
