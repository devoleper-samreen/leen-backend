import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';
import { CustomerProfile } from '../models/customer-profile.model';

export async function getMyProfile(req: Request, res: Response): Promise<void> {
  // Step 1: get the logged-in user's id from the token (set by verifyJwt middleware)
  const userId = req.user!.id;

  // Step 2: find that user's profile
  const profile = await CustomerProfile.findOne({ userId: userId });

  // Step 3: if no profile found, throw an error
  if (!profile) {
    throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Customer profile not found');
  }

  // Step 4: return the profile
  res.json({ success: true, data: profile });
}

export async function updateMyProfile(req: Request, res: Response): Promise<void> {
  // 1. Extract fields from the request body
  const { fullName, addresses } = req.body;

  // 2. Find the profile first
  const profile = await CustomerProfile.findOne({ userId: req.user!.id });

  // 3. If no profile found, throw an error
  if (!profile) {
    throw new ApiError(404, 'PROFILE_NOT_FOUND', 'Customer profile not found');
  }

  // 4. Update whichever fields the client sent
  if (fullName) {
    profile.fullName = fullName;
  }

  if (addresses) {
    profile.addresses = addresses;
  }

  // 5. Save the changes to the database
  await profile.save();

  // 6. Return the updated profile
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
