import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../types/api-response';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // Step 1: if this is one of our own known errors, use its status/code/message
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  // Step 2: otherwise treat it as an unexpected error
  let message = 'Internal Server Error';
  if (err instanceof Error) {
    message = err.message;
  }

  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message },
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  const message = `Route ${req.method} ${req.originalUrl} not found`;
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message },
  });
}
