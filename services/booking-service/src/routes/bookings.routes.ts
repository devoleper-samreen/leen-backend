import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import {
  acceptBooking,
  assignStaff,
  cancelBooking,
  createBooking,
  getBooking,
  listMyBookings,
  submitReview,
  updateBookingStatus,
  uploadJobPhoto,
  verifyBookingOtp,
} from '../controllers/bookings.controller';

export const bookingsRouter = Router();

bookingsRouter.post('/', asyncHandler(createBooking));
bookingsRouter.get('/', asyncHandler(listMyBookings));
bookingsRouter.get('/:id', asyncHandler(getBooking));
bookingsRouter.patch('/:id/status', asyncHandler(updateBookingStatus));
bookingsRouter.post('/:id/accept', asyncHandler(acceptBooking));
bookingsRouter.post('/:id/assign-staff', asyncHandler(assignStaff));
bookingsRouter.post('/:id/otp/verify', asyncHandler(verifyBookingOtp));
bookingsRouter.post('/:id/photos', asyncHandler(uploadJobPhoto));
bookingsRouter.post('/:id/cancel', asyncHandler(cancelBooking));
bookingsRouter.post('/:id/reviews', asyncHandler(submitReview));
