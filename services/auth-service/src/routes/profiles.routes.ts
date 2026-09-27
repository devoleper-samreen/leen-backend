import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import {
  addPartnerStaff,
  getMyProfile,
  listPartnerStaff,
  submitPartnerKyb,
  updateMyProfile,
} from '../controllers/profiles.controller';

export const profilesRouter = Router();

profilesRouter.get('/me', asyncHandler(getMyProfile));
profilesRouter.patch('/me', asyncHandler(updateMyProfile));
profilesRouter.post('/partners/kyb', asyncHandler(submitPartnerKyb));
profilesRouter.get('/partners/:partnerId/staff', asyncHandler(listPartnerStaff));
profilesRouter.post('/partners/:partnerId/staff', asyncHandler(addPartnerStaff));
