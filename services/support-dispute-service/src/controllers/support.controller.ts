import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

export async function createTicket(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'createTicket not implemented yet');
}
export async function listTickets(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listTickets not implemented yet');
}
export async function replyToTicket(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'replyToTicket not implemented yet');
}
export async function resolveTicket(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'resolveTicket not implemented yet');
}
