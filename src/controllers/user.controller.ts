import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { successResponse } from '../utils/response';
import { authenticate } from '../middlewares/auth.middleware';
import { body, validationResult } from 'express-validator';
import { BadRequestError } from '../utils/error';
import { ChangePasswordInput, UpdateProfileInput, UserListParams } from '../types/user.types';
import { Role } from '../types/auth.types';

// Validation rules for update profile
export const updateProfileValidationRules = [
  body('fullName').optional().isString().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('phone').optional().matches(/^[0-9]{10,15}$/).withMessage('Phone number must be between 10 and 15 digits'),
];

// Validation rules for change password
export const changePasswordValidationRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
    .withMessage('Password must contain at least one number, one lowercase and one uppercase letter'),
  body('confirmPassword').notEmpty().withMessage('Password confirmation is required'),
];

// Validation rules for change role
export const changeRoleValidationRules = [
  body('role').isIn(['USER', 'AUTHOR', 'ADMIN']).withMessage('Invalid role'),
];

// Validation rules for update status
export const updateStatusValidationRules = [
  body('active').isBoolean().withMessage('Active must be a boolean value'),
];

// Validation rules for admin reset password
export const resetPasswordValidationRules = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
    .withMessage('Password must contain at least one number, one lowercase and one uppercase letter'),
];

// Validation rules for bulk status update
export const bulkStatusUpdateValidationRules = [
  body('userIds').isArray().withMessage('User IDs must be an array'),
  body('userIds.*').isString().withMessage('Each user ID must be a string'),
  body('active').isBoolean().withMessage('Active must be a boolean value'),
];

// Validation rules for verification
export const verifyUserValidationRules = [
  body('verified').isBoolean().withMessage('Verified must be a boolean value'),
];

/**
 * Get user profile
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const profile = await userService.getUserProfile(userId);
    successResponse(res, profile, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Validation error');
    }

    const userId = req.user?.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const profileData: UpdateProfileInput = req.body;
    const updatedProfile = await userService.updateProfile(userId, profileData);
    
    successResponse(res, updatedProfile, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Change user password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Validation error');
    }

    const userId = req.user?.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const passwordData: ChangePasswordInput = req.body;
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      throw new BadRequestError('New passwords do not match');
    }

    await userService.changePassword(userId, passwordData);
    
    successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * List users (admin only)
 */
export const listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, search, role, verified, sortBy, sortDirection } = req.query;
    
    const params: UserListParams = {
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      search: search as string,
      role: role as Role,
      verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
      sortBy: sortBy as 'createdAt' | 'fullName' | 'email',
      sortDirection: sortDirection as 'asc' | 'desc',
    };
    
    const result = await userService.listUsers(params);
    
    successResponse(res, result, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID (admin only)
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const user = await userService.getUserById(userId);
    successResponse(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Validation error');
    }

    const userId = req.params.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const { role } = req.body;
    const updatedUser = await userService.updateUserRole(userId, role);
    
    successResponse(res, updatedUser, 'User role updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update user status (active/inactive) (admin only)
 */
export const updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Validation error');
    }

    const userId = req.params.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const { active } = req.body;
    const updatedUser = await userService.updateUserStatus(userId, active);
    
    successResponse(res, updatedUser, `User ${active ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    await userService.deleteUser(userId);
    
    successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Reset user password (admin only)
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Validation error');
    }

    const userId = req.params.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const { password } = req.body;
    await userService.resetPassword(userId, password);
    
    successResponse(res, null, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk update user status (admin only)
 */
export const bulkUpdateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Validation error');
    }

    const { userIds, active } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new BadRequestError('At least one user ID is required');
    }

    const result = await userService.bulkUpdateUserStatus(userIds, active);
    
    successResponse(res, result, `${result.successCount} users ${active ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user (admin only)
 */
export const verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestError('Validation error');
    }

    const userId = req.params.id;
    
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const { verified } = req.body;
    const updatedUser = await userService.verifyUser(userId, verified);
    
    successResponse(res, updatedUser, `User ${verified ? 'verified' : 'unverified'} successfully`);
  } catch (error) {
    next(error);
  }
};
