import { Router } from 'express';
import { asyncHandler } from '@leen/shared';
import { createRole, inviteSubAdmin, listRoles } from '../controllers/roles.controller';

export const rolesRouter = Router();

rolesRouter.get('/', asyncHandler(listRoles));
rolesRouter.post('/', asyncHandler(createRole));
rolesRouter.post('/invite', asyncHandler(inviteSubAdmin));
