import { Response } from 'express';
import { authService } from '../services/auth.service';
import { signToken } from '../utils/jwt.util';
import { AuthenticatedRequest } from '../types';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const authController = {
  async register(req: AuthenticatedRequest, res: Response) {
    const { email, password, name } = req.body;
    const user = await authService.register(email, password, name);
    const token = signToken({ id: user.id, email: user.email });

    res.cookie('token', token, cookieOptions);
    res.status(201).json({ user, token });
  },

  async login(req: AuthenticatedRequest, res: Response) {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    const token = signToken({ id: user.id, email: user.email });

    res.cookie('token', token, cookieOptions);
    res.json({ user, token });
  },

  async logout(_req: AuthenticatedRequest, res: Response) {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  },

  async me(req: AuthenticatedRequest, res: Response) {
    const user = await authService.me(req.user!.id);
    res.json({ user });
  }
};
