/**
 * Error utility functions for handling errors in a consistent way
 */

import { AppError, ValidationError } from './error';

/**
 * Handles validation errors from libraries like express-validator
 * and converts them to a ValidationError
 * 
 * @param errors Array of validation errors
 * @returns ValidationError instance
 */
export const handleValidationErrors = (errors: any[]): ValidationError => {
  const formattedErrors = errors.reduce((acc: Record<string, string>, error: any) => {
    acc[error.path] = error.msg;
    return acc;
  }, {});
  
  return new ValidationError('Validation failed', formattedErrors);
};

/**
 * Creates an error handler for async route handlers
 * This wraps the handler function and catches any errors, passing them to next()
 * 
 * @param fn Express route handler function
 * @returns Wrapped function with error handling
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Safely parses JSON, returning null on error
 * 
 * @param jsonString String to parse as JSON
 * @returns Parsed object or null on error
 */
export const safeJsonParse = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    return null;
  }
}; 