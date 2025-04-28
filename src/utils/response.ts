import { Response } from 'express';

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    [key: string]: any;
  };
}

/**
 * Create a success response
 */
export const apiResponse = <T = any>(
  data: T, 
  message = 'Success',
  meta?: ApiResponse['meta']
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
};

/**
 * Send a success response
 */
export const successResponse = <T = any>(
  res: Response, 
  data: T, 
  message = 'Success',
  status = 200,
  meta?: ApiResponse['meta']
): Response => {
  return res.status(status).json(apiResponse(data, message, meta));
};

/**
 * Send a paginated response
 */
export const paginatedResponse = <T = any>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = 'Success',
  status = 200
): Response => {
  const pages = Math.ceil(total / limit);
  
  return res.status(status).json({
    success: true,
    message,
    data,
    meta: {
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    },
  });
};

/**
 * Send an error response
 */
export const errorResponse = (
  res: Response, 
  message = 'Error occurred',
  errors?: any,
  status = 400
): Response => {
  return res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

/**
 * Send a detailed validation error response
 * Formats validation errors in a more user-friendly way
 */
export const validationErrorResponse = (
  res: Response,
  errors: Record<string, string[]>,
  message = 'Validation failed',
  status = 422
): Response => {
  // Create user-friendly error messages
  const formattedErrors: Record<string, any> = {};
  
  // Format each field's errors
  Object.entries(errors).forEach(([field, messages]) => {
    formattedErrors[field] = {
      messages,
      field,
      // First message is most important for UI display
      firstMessage: messages[0]
    };
  });
  
  // Get a summary of all errors for easy display
  const errorSummary = Object.entries(formattedErrors).map(
    ([field, details]) => `${field}: ${(details as any).firstMessage}`
  );
  
  return res.status(status).json({
    success: false,
    message,
    errors: formattedErrors,
    errorSummary,
    validationFailed: true
  });
};
