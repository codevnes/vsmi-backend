import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Apply rate limiter to all auth routes
router.use(authRateLimiter);

// Auth routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/validate-token', authController.validateToken);

export default router;
