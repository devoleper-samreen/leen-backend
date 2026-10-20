import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../types/api-response';
import { Role } from '../types/enums';

export interface AuthenticatedUser {
  id: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Verifies the bearer JWT issued by auth-service. Only the shape/contract is
 * wired here; secret rotation, revocation and refresh-token flows are not
 * implemented yet.
 */
export function verifyJwt(secret: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Step 1: check the Authorization header is present and well-formed
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Missing bearer token');
    }

    // Step 2: verify the token and attach the user to the request
    const token = header.slice('Bearer '.length);
    try {
      const payload = jwt.verify(token, secret) as AuthenticatedUser;
      req.user = { id: payload.id, role: payload.role };
    } catch {
      throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired token');
    }

    // Step 3: continue to the next handler
    next();
  };
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Step 1: make sure the user is logged in and has one of the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'FORBIDDEN', 'Insufficient permissions');
    }

    // Step 2: continue to the next handler
    next();
  };
}
