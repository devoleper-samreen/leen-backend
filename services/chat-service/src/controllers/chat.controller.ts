import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

export async function getConversationForBooking(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'getConversationForBooking not implemented yet');
}
export async function listMessages(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listMessages not implemented yet');
}
export async function sendPredefinedMessage(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'sendPredefinedMessage not implemented yet');
}
export async function listMessageTemplates(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listMessageTemplates not implemented yet');
}
