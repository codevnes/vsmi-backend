/**
 * Utility functions for handling API responses
 */

import { Response } from 'express';

/**
 * Standard success response structure
 * 
 * @param res Express response object
 * @param data Response data
 * @param statusCode HTTP status code (default 200)
 */
export const sendSuccess = (res: Response, data: any = null, statusCode: number = 200): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * Standard error response structure
 * 
 * @param res Express response object
 * @param message Error message
 * @param errors Additional error details (optional)
 * @param statusCode HTTP status code (default 500)
 */
export const sendError = (
  res: Response,
  message: string,
  errors: any = null,
  statusCode: number = 500
): Response => {
  const response: any = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * 
 * @param res Express response object
 * @param data Items for current page
 * @param totalItems Total number of items
 * @param page Current page number
 * @param limit Items per page
 * @param statusCode HTTP status code (default 200)
 */
export const sendPaginated = (
  res: Response,
  data: any[],
  totalItems: number,
  page: number,
  limit: number,
  statusCode: number = 200
): Response => {
  const totalPages = Math.ceil(totalItems / limit);
  
  return res.status(statusCode).json({
    success: true,
    data,
    pagination: {
      total: totalItems,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
}; 