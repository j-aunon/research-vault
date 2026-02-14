import { NextFunction, Response } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { AppError, AuthenticatedRequest } from '../types';

export const authMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const bearer = req.headers.authorization;
  const tokenFromHeader = bearer?.startsWith('Bearer ') ? bearer.split(' ')[1] : undefined;
  const token = req.cookies?.token || tokenFromHeader;

  if (!token) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = verifyToken(token);
  req.user = { id: payload.id, email: payload.email };
  next();
};
