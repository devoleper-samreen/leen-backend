import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

export async function listMyNotifications(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listMyNotifications not implemented yet');
}
export async function markNotificationRead(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'markNotificationRead not implemented yet');
}
export async function registerDeviceToken(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'registerDeviceToken not implemented yet');
}
