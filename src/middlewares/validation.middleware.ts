import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/error';

/**
 * Get field display name for error messages
 * Converts camelCase and snake_case to Title Case with spaces
 */
const getFieldDisplayName = (field: string): string => {
  // Convert camelCase or snake_case to space-separated words
  const name = field
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .toLowerCase();
  
  // Capitalize first letter of each word
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Enhance error message with field name
 */
const enhanceErrorMessage = (msg: string, field: string): string => {
  const fieldName = getFieldDisplayName(field);
  
  // If message already includes the field name, return as is
  if (msg.includes(fieldName)) {
    return msg;
  }
  
  // If it's a generic message, prepend the field name
  return `${fieldName} ${msg.toLowerCase()}`;
};

/**
 * Validate request against validation chains
 * @param validations array of express-validator validation chains
 * @returns middleware function that validates request
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Run all validations
      await Promise.all(validations.map(validation => validation.run(req)));
      
      // Check if validation errors exist
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
      
      // Format errors with enhanced messages
      const formattedErrors = errors.array().reduce((acc: Record<string, string[]>, error: any) => {
        const field = error.path;
        if (!acc[field]) {
          acc[field] = [];
        }
        
        // Enhance error message with field name for better readability
        const enhancedMessage = enhanceErrorMessage(error.msg, field);
        acc[field].push(enhancedMessage);
        
        return acc;
      }, {});
      
      // Create a descriptive error message based on validation errors
      const errorFields = Object.keys(formattedErrors);
      const errorMessage = errorFields.length === 1
        ? `Invalid ${getFieldDisplayName(errorFields[0])}`
        : `Invalid input: ${errorFields.map(getFieldDisplayName).join(', ')}`;
      
      // Throw validation error with enhanced message
      throw new ValidationError(errorMessage, formattedErrors);
    } catch (error) {
      next(error);
    }
  };
};
