import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';
import { CustomerProfile } from '../models/customer-profile.model';

export async function getMyProfile(req: Request, res: Response): Promise<void> {
  const profile = await CustomerProfile.findOne({ userId: req.user!.id });
  if (!profile) {
    throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Customer profile not found');
  }
  res.json({ success: true, data: profile });
}

export async function updateMyProfile(req: Request, res: Response): Promise<void> {
  const profile = await CustomerProfile.findOneAndUpdate(
    { userId: req.user!.id },
    { $set: req.body },
    { new: true },
  );
  if (!profile) {
    throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Customer profile not found');
  }
  res.json({ success: true, data: profile });
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
