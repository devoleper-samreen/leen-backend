import { NextFunction, Request, Response } from 'express';

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function asyncHandler(fn: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Step 1: run the handler, and if it throws/rejects, pass the error to Express
    fn(req, res, next).catch(next);
  };
}
