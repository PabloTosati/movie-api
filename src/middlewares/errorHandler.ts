import { Request, Response, NextFunction } from 'express';

interface AppError {
  status?: number;
  message?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('[ErrorHandler] Unhandled error:', err);

  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error';

  res.status(status).json({ error: message });
}
