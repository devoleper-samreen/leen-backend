import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

// Milestone 1: contract-only stubs for the full catalog CRUD + publish pipeline.

export async function listCities(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listCities not implemented yet');
}
export async function upsertCity(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'upsertCity not implemented yet');
}
export async function listCategories(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listCategories not implemented yet');
}
export async function upsertCategory(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'upsertCategory not implemented yet');
}
export async function listSubCategories(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listSubCategories not implemented yet');
}
export async function upsertSubCategory(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'upsertSubCategory not implemented yet');
}
export async function listServices(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listServices not implemented yet');
}
export async function getServiceDetail(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'getServiceDetail not implemented yet');
}
export async function getPricingTiers(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'getPricingTiers not implemented yet');
}
export async function upsertPricingTier(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'upsertPricingTier not implemented yet');
}
export async function listJobTemplates(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listJobTemplates not implemented yet');
}
export async function upsertJobTemplate(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'upsertJobTemplate not implemented yet');
}
export async function publishJobTemplate(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'publishJobTemplate not implemented yet');
}
export async function listPromoCodes(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listPromoCodes not implemented yet');
}
export async function upsertPromoCode(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'upsertPromoCode not implemented yet');
}
