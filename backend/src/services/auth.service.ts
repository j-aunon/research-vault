import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.util';
import { AppError } from '../types';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

export const authService = {
  async register(email: string, password: string, name?: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Email already in use', 409);
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
      select: { id: true, email: true, name: true, createdAt: true }
    });

    return user;
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    return { id: user.id, email: user.email, name: user.name };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
};
