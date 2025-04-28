/**
 * Utility functions for request validation
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { sendError } from './response.util';

/**
 * Middleware to validate request and return standardized error response
 * 
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Use any type for validation errors to avoid TypeScript issues
    const formattedErrors = errors.array().map((error: any) => ({
      field: error.path || error.param || 'unknown',
      message: error.msg || 'Invalid value'
    }));
    
    return sendError(res, 'Validation failed', formattedErrors, 400);
  }
  
  next();
};

/**
 * Creates a validation middleware with custom validators
 * 
 * @param validations Array of validation chains
 * @returns Express middleware
 */
export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations concurrently
    await Promise.all(validations.map(validation => validation.run(req)));
    
    // Check if any errors occurred
    validate(req, res, next);
  };
};

/**
 * Common validation message for required fields
 * 
 * @param field Field name
 * @returns Formatted error message
 */
export const requiredMessage = (field: string): string => {
  return `${field} is required`;
};

/**
 * Common validation message for invalid format
 * 
 * @param field Field name
 * @returns Formatted error message
 */
export const invalidFormatMessage = (field: string): string => {
  return `${field} format is invalid`;
}; 