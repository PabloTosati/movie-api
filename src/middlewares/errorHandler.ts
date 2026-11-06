import { Request, Response, NextFunction } from 'express';

interface AppError {
  status?: number;
  message?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // Express only treats a middleware as an error handler when it has 4 parameters.
  _next: NextFunction
): void {
  console.error('[ErrorHandler] Unhandled error:', err);

  const status = err.status ?? 500;

  // Unexpected errors (database, bugs) are logged above but never exposed to the client.
  const message = status >= 500 ? 'Internal server error' : err.message ?? 'Request error';

  res.status(status).json({ error: message });
}
