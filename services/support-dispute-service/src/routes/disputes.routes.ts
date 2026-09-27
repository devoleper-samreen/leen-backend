import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import {
  addDisputeEvidence,
  getDispute,
  listDisputes,
  raiseDispute,
  resolveDispute,
} from '../controllers/disputes.controller';

export const disputesRouter = Router();

disputesRouter.post('/', asyncHandler(raiseDispute));
disputesRouter.get('/', asyncHandler(listDisputes));
disputesRouter.get('/:id', asyncHandler(getDispute));
disputesRouter.post('/:id/evidence', asyncHandler(addDisputeEvidence));
disputesRouter.post('/:id/resolve', asyncHandler(resolveDispute));
