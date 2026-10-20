import rateLimit, { Options } from 'express-rate-limit';
import { Request, Response } from 'express';

export function createRateLimiter(windowMs: number, max: number, overrides?: Partial<Options>) {
  // Step 1: what to send back when someone goes over the limit
  function handleTooManyRequests(_req: Request, res: Response): void {
    res.status(429).json({
      success: false,
      error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later' },
    });
  }

  // Step 2: build the rate limiter with these settings
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: handleTooManyRequests,
    ...overrides,
  });
}
