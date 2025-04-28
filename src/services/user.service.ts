import { prisma } from '../config';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { BadRequestError, NotFoundError } from '../utils/error';
import { ChangePasswordInput, UpdateProfileInput, UserData, UserListParams, UserProfile } from '../types/user.types';

/**
 * Get user by ID
 * @param userId User ID
 * @returns User data
 */
export const getUserById = async (userId: string): Promise<UserData> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      thumbnail: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as UserData;
};

/**
 * Get user profile
 * @param userId User ID
 * @returns User profile data
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      thumbnail: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Create profile object
  const profile: UserProfile = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    profilePictureUrl: user.thumbnail?.url || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return profile;
};

/**
 * Update user profile
 * @param userId User ID
 * @param profileData Profile data to update
 * @returns Updated user profile
 */
export const updateProfile = async (
  userId: string,
  profileData: UpdateProfileInput
): Promise<UserProfile> => {
  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: profileData,
    include: {
      thumbnail: true,
    },
  });

  // Create profile object
  const profile: UserProfile = {
    id: updatedUser.id,
    email: updatedUser.email,
    fullName: updatedUser.fullName,
    phone: updatedUser.phone,
    profilePictureUrl: updatedUser.thumbnail?.url || null,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };

  return profile;
};

/**
 * Change user password
 * @param userId User ID
 * @param passwordData Password change data
 */
export const changePassword = async (
  userId: string,
  passwordData: ChangePasswordInput
): Promise<void> => {
  // Validate passwords match
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    throw new BadRequestError('New passwords do not match');
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Verify current password
  const isPasswordValid = await verifyPassword(
    passwordData.currentPassword,
    user.password
  );

  if (!isPasswordValid) {
    throw new BadRequestError('Current password is incorrect');
  }

  // Hash new password
  const hashedPassword = await hashPassword(passwordData.newPassword);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

/**
 * List users with filtering and pagination
 * @param params List parameters
 * @returns Paginated list of users
 */
export const listUsers = async (params: UserListParams = {}): Promise<{
  users: UserData[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}> => {
  const {
    page = 1,
    limit = 10,
    search = '',
    role,
    verified,
    sortBy = 'createdAt',
    sortDirection = 'desc',
  } = params;

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Build where conditions
  const where: any = {
    deletedAt: null,
  };

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { fullName: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role !== undefined) {
    where.role = role;
  }

  if (verified !== undefined) {
    where.verified = verified;
  }

  // Build order by
  const orderBy: any = {};
  orderBy[sortBy] = sortDirection;

  // Fetch users and count
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        verified: true,
        thumbnailId: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users as UserData[],
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};
