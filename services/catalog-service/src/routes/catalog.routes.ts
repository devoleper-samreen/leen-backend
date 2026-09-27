import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import {
  getPricingTiers,
  getServiceDetail,
  listCategories,
  listCities,
  listJobTemplates,
  listPromoCodes,
  listServices,
  listSubCategories,
  publishJobTemplate,
  upsertCategory,
  upsertCity,
  upsertJobTemplate,
  upsertPricingTier,
  upsertPromoCode,
  upsertSubCategory,
} from '../controllers/catalog.controller';

export const catalogRouter = Router();

catalogRouter.get('/cities', asyncHandler(listCities));
catalogRouter.post('/cities', asyncHandler(upsertCity));

catalogRouter.get('/categories', asyncHandler(listCategories));
catalogRouter.post('/categories', asyncHandler(upsertCategory));

catalogRouter.get('/sub-categories', asyncHandler(listSubCategories));
catalogRouter.post('/sub-categories', asyncHandler(upsertSubCategory));

catalogRouter.get('/services', asyncHandler(listServices));
catalogRouter.get('/services/:id', asyncHandler(getServiceDetail));

catalogRouter.get('/pricing-tiers', asyncHandler(getPricingTiers));
catalogRouter.post('/pricing-tiers', asyncHandler(upsertPricingTier));

catalogRouter.get('/job-templates', asyncHandler(listJobTemplates));
catalogRouter.post('/job-templates', asyncHandler(upsertJobTemplate));
catalogRouter.post('/job-templates/:id/publish', asyncHandler(publishJobTemplate));

catalogRouter.get('/promo-codes', asyncHandler(listPromoCodes));
catalogRouter.post('/promo-codes', asyncHandler(upsertPromoCode));
