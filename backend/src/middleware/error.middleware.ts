import { NextFunction, Request, Response } from 'express';
import { AppError } from '../types';
import { logger } from '../utils/logger.util';

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: 'Not found' });
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (typeof err === 'object' && err !== null && (err as any).name === 'MulterError') {
    const multerCode = (err as any).code;
    if (multerCode === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ message: 'PDF too large. Max file size is 100MB.' });
      return;
    }
    res.status(400).json({ message: 'Invalid file upload request' });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ message: 'Internal server error' });
};
