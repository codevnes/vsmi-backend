import jwt from 'jsonwebtoken';
import { prisma } from '../config';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { ConflictError, NotFoundError, UnauthorizedError, InternalServerError } from '../utils/error';
import { LoginRequest, RegisterRequest, TokenPayload } from '../types/auth.types';
import { UserData } from '../types/user.types';
import { logger } from '../utils/logger';

/**
 * Register a new user
 * @param userData User registration data
 * @returns Created user data
 */
export const register = async (userData: RegisterRequest): Promise<UserData> => {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        fullName: userData.fullName,
        password: hashedPassword,
        phone: userData.phone,
      },
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as UserData;
  } catch (error) {
    // Handle database connection errors
    if (error instanceof Error && 
        (error.message.includes('database') || 
         error.message.includes('connection') || 
         error.message.includes('prisma'))) {
      logger.error('Database error during registration:', error);
      throw new InternalServerError('Database connection error. Please try again later.');
    }
    throw error;
  }
};

/**
 * Login a user
 * @param credentials User login credentials
 * @returns Authentication token and user data
 */
export const login = async (credentials: LoginRequest): Promise<{ token: string; user: UserData }> => {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate token
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    // Create token - bypassing type checks for jsonwebtoken
    // @ts-ignore - Known issue with jsonwebtoken types
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // Return token and user without password
    const { password, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword as UserData,
    };
  } catch (error) {
    // Handle database connection errors
    if (error instanceof Error && 
        (error.message.includes('database') || 
         error.message.includes('connection') || 
         error.message.includes('prisma'))) {
      logger.error('Database error during login:', error);
      throw new InternalServerError('Database connection error. Please try again later.');
    }
    throw error;
  }
};

/**
 * Validate a token
 * @param token JWT token
 * @returns Token payload
 */
export const validateToken = (token: string): TokenPayload => {
  try {
    // @ts-ignore - Known issue with jsonwebtoken types
    return jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};
