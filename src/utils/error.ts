export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends AppError {
  errors: any;
  
  constructor(message: string, errors?: any) {
    super(message, 422);
    this.name = 'ValidationError';
    this.errors = errors;
  }
  
  /**
   * Get a debug representation of the validation error
   * Useful for logging and debugging validation issues
   */
  getDebugInfo(): object {
    // Create detailed debug information about the validation error
    const debugInfo = {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode,
      fields: Object.keys(this.errors || {}),
      errorCount: Object.keys(this.errors || {}).reduce(
        (count, field) => count + (this.errors[field]?.length || 0), 
        0
      ),
      validationDetails: this.errors,
      stack: this.stack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack
    };
    
    return debugInfo;
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}
