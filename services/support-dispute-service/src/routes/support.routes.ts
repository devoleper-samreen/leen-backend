import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import { createTicket, listTickets, replyToTicket, resolveTicket } from '../controllers/support.controller';

export const supportRouter = Router();

supportRouter.post('/tickets', asyncHandler(createTicket));
supportRouter.get('/tickets', asyncHandler(listTickets));
supportRouter.post('/tickets/:id/reply', asyncHandler(replyToTicket));
supportRouter.post('/tickets/:id/resolve', asyncHandler(resolveTicket));
