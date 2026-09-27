import { NextFunction, Request, Response } from 'express';

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const start = Date.now();
  _res.on('finish', () => {
    // eslint-disable-next-line no-console
    console.log(`${req.method} ${req.originalUrl} ${_res.statusCode} ${Date.now() - start}ms`);
  });
  next();
}
