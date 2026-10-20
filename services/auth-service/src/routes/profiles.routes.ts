import { Router } from 'express';
import { asyncHandler, validateBody, verifyJwt } from '@leen/shared';
import {
  addPartnerStaff,
  getMyProfile,
  listPartnerStaff,
  submitPartnerKyb,
  updateMyProfile,
} from '../controllers/profiles.controller';
import { updateProfileSchema } from '../validators/profiles.validators';

const JWT_SECRET = process.env.JWT_SECRET ?? 'change-me';

export const profilesRouter = Router();

const requireAuth = verifyJwt(JWT_SECRET);

profilesRouter.get('/me', requireAuth, asyncHandler(getMyProfile));
profilesRouter.patch('/me', requireAuth, validateBody(updateProfileSchema), asyncHandler(updateMyProfile));
profilesRouter.post('/partners/kyb', requireAuth, asyncHandler(submitPartnerKyb));
profilesRouter.get('/partners/:partnerId/staff', requireAuth, asyncHandler(listPartnerStaff));
profilesRouter.post('/partners/:partnerId/staff', requireAuth, asyncHandler(addPartnerStaff));
