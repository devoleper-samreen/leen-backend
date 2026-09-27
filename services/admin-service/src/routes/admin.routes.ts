import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import {
  generateReport,
  getDashboardOverview,
  listBanners,
  listReports,
  upsertBanner,
} from '../controllers/admin.controller';

export const adminRouter = Router();

adminRouter.get('/dashboard', asyncHandler(getDashboardOverview));
adminRouter.get('/banners', asyncHandler(listBanners));
adminRouter.post('/banners', asyncHandler(upsertBanner));
adminRouter.get('/reports', asyncHandler(listReports));
adminRouter.post('/reports', asyncHandler(generateReport));
