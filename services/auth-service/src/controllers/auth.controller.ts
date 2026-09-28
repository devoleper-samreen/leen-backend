import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

// Contract-only stubs. Real signup/login/OTP/JWT-issuing logic is not
// implemented yet.

export async function signup(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'signup not implemented yet');
}

export async function login(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'login not implemented yet');
}

export async function verifyOtp(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'verifyOtp not implemented yet');
}

export async function refreshToken(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'refreshToken not implemented yet');
}

export async function resetPassword(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'resetPassword not implemented yet');
}
