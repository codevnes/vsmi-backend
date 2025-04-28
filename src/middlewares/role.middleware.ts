import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/auth.types';
import { UnauthorizedError, ForbiddenError } from '../utils/error';

export const checkRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}; 