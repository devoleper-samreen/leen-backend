import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

export async function raiseDispute(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'raiseDispute not implemented yet');
}
export async function listDisputes(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listDisputes not implemented yet');
}
export async function getDispute(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'getDispute not implemented yet');
}
export async function addDisputeEvidence(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'addDisputeEvidence not implemented yet');
}
export async function resolveDispute(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'resolveDispute not implemented yet');
}
