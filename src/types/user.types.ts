import { Role } from './auth.types';

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: Role;
  verified: boolean;
  thumbnailId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends Omit<UserData, 'role' | 'verified' | 'thumbnailId'> {
  profilePictureUrl?: string | null;
}

export interface UpdateProfileInput {
  fullName?: string;
  phone?: string;
  thumbnailId?: number | null;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  verified?: boolean;
  sortBy?: 'createdAt' | 'fullName' | 'email';
  sortDirection?: 'asc' | 'desc';
}
