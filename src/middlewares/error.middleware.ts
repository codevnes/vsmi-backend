import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/error';
import { logger } from '../utils/logger';
import { errorResponse, validationErrorResponse } from '../utils/response';

/**
 * Global error handling middleware
 * Handles all errors thrown in the application
 */
export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Enhanced logging for validation errors
  if (err instanceof ValidationError) {
    logger.error(`Validation Error: ${err.message}`, {
      ...err.getDebugInfo(),
      path: req.path,
      method: req.method,
      body: process.env.NODE_ENV === 'development' ? req.body : undefined
    });
    
    return validationErrorResponse(
      res,
      err.errors,
      `Validation failed: ${Object.keys(err.errors).join(', ')}`,
      422
    );
  }
  
  // Log other errors
  logger.error(`${err.name || 'Error'}: ${err.message}`, { 
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Default values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetails = null;
  
  // Handle AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = (err as any).errors || null;
  } 
  // Handle Prisma known errors
  else if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database operation error';
  }
  // Handle non-instance validation errors (from other libraries)
  else if (err.name === 'ValidationError') {
    statusCode = 422;
    message = err.message;
  }
  
  // Send response
  return errorResponse(res, message, errorDetails, statusCode);
};
