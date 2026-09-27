import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import {
  getConversationForBooking,
  listMessageTemplates,
  listMessages,
  sendPredefinedMessage,
} from '../controllers/chat.controller';

export const chatRouter = Router();

chatRouter.get('/templates', asyncHandler(listMessageTemplates));
chatRouter.get('/bookings/:bookingId/conversation', asyncHandler(getConversationForBooking));
chatRouter.get('/conversations/:id/messages', asyncHandler(listMessages));
chatRouter.post('/conversations/:id/messages', asyncHandler(sendPredefinedMessage));
