import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import {
  listMyNotifications,
  markNotificationRead,
  registerDeviceToken,
} from '../controllers/notifications.controller';

export const notificationsRouter = Router();

notificationsRouter.get('/', asyncHandler(listMyNotifications));
notificationsRouter.post('/:id/read', asyncHandler(markNotificationRead));
notificationsRouter.post('/device-tokens', asyncHandler(registerDeviceToken));
