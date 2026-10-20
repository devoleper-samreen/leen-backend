import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ApiError } from '../types/api-response';

function formatZodError(error: ZodError): Array<{ path: string; message: string }> {
  return error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
}

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Step 1: check the request body against the schema
    const result = schema.safeParse(req.body);

    // Step 2: if it doesn't match, respond with a validation error
    if (!result.success) {
      const errorDetails = formatZodError(result.error);
      next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request body', errorDetails));
      return;
    }

    // Step 3: replace the body with the validated/parsed data and continue
    req.body = result.data;
    next();
  };
}
