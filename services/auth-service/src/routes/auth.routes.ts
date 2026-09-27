import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import { login, refreshToken, resetPassword, signup, verifyOtp } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/signup', asyncHandler(signup));
authRouter.post('/login', asyncHandler(login));
authRouter.post('/otp/verify', asyncHandler(verifyOtp));
authRouter.post('/token/refresh', asyncHandler(refreshToken));
authRouter.post('/password/reset', asyncHandler(resetPassword));
