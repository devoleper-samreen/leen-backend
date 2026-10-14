import rateLimit, { Options } from 'express-rate-limit';
import { Request, Response } from 'express';

export function createRateLimiter(windowMs: number, max: number, overrides?: Partial<Options>) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later' },
      });
    },
    ...overrides,
  });
}
