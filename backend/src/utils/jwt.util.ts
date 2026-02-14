import jwt from 'jsonwebtoken';
import { AuthUser } from '../types';

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  return secret;
};

export const signToken = (user: AuthUser): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign(user, getSecret(), { expiresIn });
};

export const verifyToken = (token: string): AuthUser => {
  return jwt.verify(token, getSecret()) as AuthUser;
};
