import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Profile routes - authenticated users only
router.get('/profile', authenticate, userController.getProfile);
router.put(
  '/profile',
  authenticate,
  validate(userController.updateProfileValidationRules),
  userController.updateProfile
);
router.post(
  '/change-password',
  authenticate,
  validate(userController.changePasswordValidationRules),
  userController.changePassword
);

// Admin-only routes
router.get('/list', authenticate, checkRole(['ADMIN']), userController.listUsers);
router.get('/:id', authenticate, checkRole(['ADMIN']), userController.getUserById);

// New admin-only user management routes
router.put(
  '/:id/role',
  authenticate,
  checkRole(['ADMIN']),
  validate(userController.changeRoleValidationRules),
  userController.updateUserRole
);
router.put(
  '/:id/status',
  authenticate,
  checkRole(['ADMIN']),
  validate(userController.updateStatusValidationRules),
  userController.updateUserStatus
);
router.delete(
  '/:id',
  authenticate,
  checkRole(['ADMIN']),
  userController.deleteUser
);

// Additional admin-only user management routes
router.post(
  '/:id/reset-password',
  authenticate,
  checkRole(['ADMIN']),
  validate(userController.resetPasswordValidationRules),
  userController.resetPassword
);
router.put(
  '/:id/verify',
  authenticate,
  checkRole(['ADMIN']),
  validate(userController.verifyUserValidationRules),
  userController.verifyUser
);
router.post(
  '/bulk/status',
  authenticate,
  checkRole(['ADMIN']),
  validate(userController.bulkStatusUpdateValidationRules),
  userController.bulkUpdateUserStatus
);

export default router;
