import { z } from 'zod';

const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number');

const otpCodeSchema = z.string().trim().length(6, 'OTP must be 6 digits');

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

const otpPurposeSchema = z.enum(['login', 'signup', 'reset_password']);

export const signupSchema = z.object({
  phone: phoneSchema,
  email: z.string().trim().email().optional(),
  password: passwordSchema,
  fullName: z.string().trim().min(2, 'Full name is required'),
  language: z.enum(['en', 'ar']).default('en'),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Phone or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const sendOtpSchema = z.object({
  phone: phoneSchema,
  purpose: otpPurposeSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: otpCodeSchema,
  purpose: otpPurposeSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required'),
});

export const resetPasswordSchema = z.object({
  phone: phoneSchema,
  code: otpCodeSchema,
  newPassword: passwordSchema,
});
