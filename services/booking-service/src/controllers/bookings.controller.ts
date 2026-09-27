import { Request, Response } from 'express';
import { ApiError } from '@leen/shared';

export async function createBooking(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'createBooking not implemented yet');
}
export async function getBooking(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'getBooking not implemented yet');
}
export async function listMyBookings(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'listMyBookings not implemented yet');
}
export async function updateBookingStatus(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'updateBookingStatus not implemented yet');
}
export async function acceptBooking(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'acceptBooking not implemented yet');
}
export async function assignStaff(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'assignStaff not implemented yet');
}
export async function verifyBookingOtp(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'verifyBookingOtp not implemented yet');
}
export async function uploadJobPhoto(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'uploadJobPhoto not implemented yet');
}
export async function cancelBooking(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'cancelBooking not implemented yet');
}
export async function submitReview(_req: Request, _res: Response): Promise<void> {
  throw new ApiError(501, 'NOT_IMPLEMENTED', 'submitReview not implemented yet');
}
