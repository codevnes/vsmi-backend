// Define Role type to match Prisma schema
export type Role = 'USER' | 'AUTHOR' | 'ADMIN';

export interface TokenPayload {
  id: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
