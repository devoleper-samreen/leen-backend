import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

export async function listBanners(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listBanners not implemented yet');
}
export async function upsertBanner(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'upsertBanner not implemented yet');
}
export async function generateReport(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'generateReport not implemented yet');
}
export async function listReports(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listReports not implemented yet');
}
export async function getDashboardOverview(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'getDashboardOverview not implemented yet');
}
