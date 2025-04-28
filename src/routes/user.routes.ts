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

export default router;
