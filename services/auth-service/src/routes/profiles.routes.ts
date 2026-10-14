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

profilesRouter.use(verifyJwt(JWT_SECRET));

profilesRouter.get('/me', asyncHandler(getMyProfile));
profilesRouter.patch('/me', validateBody(updateProfileSchema), asyncHandler(updateMyProfile));
profilesRouter.post('/partners/kyb', asyncHandler(submitPartnerKyb));
profilesRouter.get('/partners/:partnerId/staff', asyncHandler(listPartnerStaff));
profilesRouter.post('/partners/:partnerId/staff', asyncHandler(addPartnerStaff));
