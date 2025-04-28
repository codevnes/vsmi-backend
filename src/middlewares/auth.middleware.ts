import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config';
import { TokenPayload, Role } from '../types/auth.types';
import { UnauthorizedError, ForbiddenError } from '../utils/error';

/**
 * Middleware to authenticate user using JWT
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required. No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token - bypassing type checks for jsonwebtoken
    // @ts-ignore - Known issue with jsonwebtoken types
    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new UnauthorizedError('Token expired');
        }
        throw new UnauthorizedError('Invalid token');
      }
      
      // Set user in request
      req.user = decoded as TokenPayload;
      next();
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authorize user based on roles
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      
      const hasRole = allowedRoles.includes(req.user.role);
      if (!hasRole) {
        throw new ForbiddenError('You do not have permission to perform this action');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};
