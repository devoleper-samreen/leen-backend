import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

export async function listRoles(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listRoles not implemented yet');
}

export async function createRole(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'createRole not implemented yet');
}

export async function inviteSubAdmin(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'inviteSubAdmin not implemented yet');
}
