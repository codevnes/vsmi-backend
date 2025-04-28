import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/response';

/**
 * Default API rate limiter
 * Limits each IP to 100 requests per 15 minutes
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000000, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res,
      'Too many requests, please try again later.',
      undefined,
      429
    );
  },
});

/**
 * Auth rate limiter
 * More restrictive for login/register endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20000000000, // Limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res,
      'Too many authentication attempts, please try again later.',
      undefined,
      429
    );
  },
});

/**
 * Stock data rate limiter
 * Less restrictive for stock data endpoints
 */
export const stockDataRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res,
      'Rate limit exceeded for stock data requests.',
      undefined,
      429
    );
  },
});
