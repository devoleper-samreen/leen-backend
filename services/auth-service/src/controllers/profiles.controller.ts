import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

export async function getMyProfile(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'getMyProfile not implemented yet');
}

export async function updateMyProfile(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'updateMyProfile not implemented yet');
}

export async function submitPartnerKyb(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'submitPartnerKyb not implemented yet');
}

export async function listPartnerStaff(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listPartnerStaff not implemented yet');
}

export async function addPartnerStaff(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'addPartnerStaff not implemented yet');
}
