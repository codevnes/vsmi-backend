import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import * as authService from '../services/auth.service';
import { validate } from '../middlewares/validation.middleware';
import { BadRequestError } from '../utils/error';
import { successResponse } from '../utils/response';

/**
 * Login validation rules
 */
export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isString().notEmpty().withMessage('Password is required'),
];

/**
 * Register validation rules
 */
export const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
  body('fullName').isString().notEmpty().withMessage('Full name is required'),
  body('phone')
    .optional()
    .isString()
    .matches(/^\+?[0-9\s()-]{8,20}$/)
    .withMessage('Phone number format is invalid'),
];

/**
 * Login a user
 * @route POST /api/v1/auth/login
 */
export const login = [
  validate(loginValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      return successResponse(res, result, 'Login successful', 200);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 */
export const register = [
  validate(registerValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if passwords match
      const { confirmPassword, ...userData } = req.body;
      if (userData.password !== confirmPassword) {
        throw new BadRequestError('Passwords do not match');
      }

      const user = await authService.register(userData);
      return successResponse(res, user, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Validate JWT token
 * @route POST /api/v1/auth/validate-token
 */
export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Try to get token from Authorization header first
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else {
      // If not in header, try to get from request body
      token = req.body.token;
    }

    if (!token) {
      throw new BadRequestError('Token is required');
    }

    const decoded = authService.validateToken(token);
    return successResponse(res, decoded, 'Token is valid', 200);
  } catch (error) {
    next(error);
  }
};
