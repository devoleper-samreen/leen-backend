import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import {
  approvePayout,
  chargePayment,
  getWallet,
  listPayoutRequests,
  listRefunds,
  processRefund,
  requestPayout,
} from '../controllers/payments.controller';

export const paymentsRouter = Router();

paymentsRouter.post('/charge', asyncHandler(chargePayment));
paymentsRouter.get('/wallet', asyncHandler(getWallet));
paymentsRouter.post('/payouts', asyncHandler(requestPayout));
paymentsRouter.get('/payouts', asyncHandler(listPayoutRequests));
paymentsRouter.post('/payouts/:id/approve', asyncHandler(approvePayout));
paymentsRouter.get('/refunds', asyncHandler(listRefunds));
paymentsRouter.post('/refunds/:id/process', asyncHandler(processRefund));
