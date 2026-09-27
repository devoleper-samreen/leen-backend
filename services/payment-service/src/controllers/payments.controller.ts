import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

export async function chargePayment(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'chargePayment not implemented yet');
}
export async function getWallet(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'getWallet not implemented yet');
}
export async function requestPayout(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'requestPayout not implemented yet');
}
export async function listPayoutRequests(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listPayoutRequests not implemented yet');
}
export async function approvePayout(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'approvePayout not implemented yet');
}
export async function listRefunds(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listRefunds not implemented yet');
}
export async function processRefund(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'processRefund not implemented yet');
}
