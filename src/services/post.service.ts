import { PrismaClient, Prisma } from '@prisma/client';
import { 
  PostData, 
  PostListParams, 
  PostListResult, 
  CreatePostInput, 
  UpdatePostInput 
} from '../types';
import { BadRequestError, NotFoundError } from '../utils/error';

const prisma = new PrismaClient();

/**
 * Generate a slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert Prisma Post to PostData (handling null values)
 */
function convertToPost(post: any): PostData {
  return {
    ...post,
    content: post.content || '',
    excerpt: post.description || undefined,
    thumbnailId: post.thumbnailId || undefined,
    published: post.isPremium || false,
    publishedAt: post.createdAt || undefined,
    authorId: post.userId,
    deletedAt: post.deletedAt || undefined,
    categories: post.category ? [{
      postId: post.id,
      categoryId: post.categoryId,
      category: {
        id: post.category.id,
        title: post.category.title,
        slug: post.category.slug
      }
    }] : [],
    author: post.user ? {
      id: post.user.id,
      name: post.user.name || '',
      email: post.user.email || ''
    } : undefined
  };
}

/**
 * Create a new post
 */
export const createPost = async (authorId: string, data: CreatePostInput): Promise<PostData> => {
  const { title, content, excerpt, thumbnailId, published = false, publishedAt, categoryIds = [] } = data;
  let slug = data.slug;

  // Generate slug if not provided
  if (!slug) {
    slug = generateSlug(title);
  }

  // Check if slug is already in use
  const existingPost = await prisma.post.findUnique({
    where: { slug }
  });

  if (existingPost) {
    throw new BadRequestError(`A post with slug "${slug}" already exists`);
  }

  // Check if we have a category ID
  if (categoryIds.length === 0) {
    throw new BadRequestError('At least one category ID is required');
  }

  // Get the first category ID
  const categoryId = categoryIds[0];
  
  // Verify category exists
  const categoryExists = await prisma.category.findUnique({
    where: {
      id: categoryId,
      deletedAt: null
    }
  });
  
  if (!categoryExists) {
    throw new BadRequestError('Category not found');
  }

  // Prepare data for post creation
  const postData = {
    title,
    slug,
    content,
    description: excerpt,
    thumbnailId,
    isPremium: published,
    userId: authorId,
    categoryId
  };

  // Create the post
  const post = await prisma.post.create({
    data: postData,
    include: {
      category: true,
      user: true
    }
  });

  return convertToPost(post);
};

/**
 * Get post by ID
 */
export const getPostById = async (id: string, includeDeleted: boolean = false): Promise<PostData> => {
  const post = await prisma.post.findUnique({
    where: {
      id,
      ...(includeDeleted ? {} : { deletedAt: null }),
    },
    include: {
      category: true,
      user: true
    }
  });

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  return convertToPost(post);
};

/**
 * Get post by slug
 */
export const getPostBySlug = async (slug: string, includeDeleted: boolean = false): Promise<PostData> => {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      ...(includeDeleted ? {} : { deletedAt: null }),
    },
    include: {
      category: true,
      user: true
    }
  });

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  return convertToPost(post);
};

/**
 * List posts with pagination
 */
export const listPosts = async (params: PostListParams): Promise<PostListResult> => {
  const {
    page = 1,
    limit = 20,
    search = '',
    categoryId,
    authorId,
    published,
    includeDeleted = false,
    sortBy = 'createdAt',
    sortDirection = 'desc'
  } = params;

  const skip = (page - 1) * limit;

  // Build base where condition
  const where: Prisma.PostWhereInput = {};
  
  // Only include non-deleted posts unless specifically requested
  if (!includeDeleted) {
    where.deletedAt = null;
  }

  // Add search condition if provided
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { content: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
    ];
  }

  // Filter by published status if provided
  if (published !== undefined) {
    where.isPremium = published;
  }

  // Filter by author if provided
  if (authorId) {
    where.userId = authorId;
  }

  // Filter by category if provided
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Get total count
  const total = await prisma.post.count({ where });

  // Get posts
  const postsResult = await prisma.post.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortDirection },
    include: {
      category: true,
      user: true
    }
  });

  // Convert to our type
  const posts = postsResult.map(convertToPost);

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Update a post
 */
export const updatePost = async (id: string, data: UpdatePostInput): Promise<PostData> => {
  // Check if post exists
  const post = await prisma.post.findUnique({
    where: { id, deletedAt: null }
  });

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  // Handle slug update
  if (data.slug) {
    // Check if slug is already in use by another post
    const existingPost = await prisma.post.findUnique({
      where: { slug: data.slug }
    });

    if (existingPost && existingPost.id !== id) {
      throw new BadRequestError(`A post with slug "${data.slug}" already exists`);
    }
  }

  // Extract categoryIds and prepare data for update
  const { categoryIds, published, publishedAt, excerpt, ...updateData } = data;
  
  // Prepare the update data
  const postUpdateData: any = {
    ...updateData,
    description: excerpt,
    isPremium: published
  };
  
  // If categoryIds is provided
  if (categoryIds !== undefined) {
    if (categoryIds.length > 0) {
      const categoryId = categoryIds[0];
      
      // Verify category exists
      const categoryExists = await prisma.category.findUnique({
        where: {
          id: categoryId,
          deletedAt: null
        }
      });
      
      if (!categoryExists) {
        throw new BadRequestError('Category not found');
      }
      
      postUpdateData.categoryId = categoryId;
    } else {
      // If empty array is provided, remove the category
      postUpdateData.categoryId = null;
    }
  }

  // Update the post
  const updatedPost = await prisma.post.update({
    where: { id },
    data: postUpdateData,
    include: {
      category: true,
      user: true
    }
  });

  return convertToPost(updatedPost);
};

/**
 * Soft delete a post
 */
export const softDeletePost = async (id: string): Promise<void> => {
  // Check if post exists
  const post = await prisma.post.findUnique({
    where: { id, deletedAt: null }
  });

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  // Soft delete the post
  await prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};

/**
 * Restore a soft-deleted post
 */
export const restorePost = async (id: string): Promise<PostData> => {
  // Check if post exists and is deleted
  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  if (!post.deletedAt) {
    throw new BadRequestError('Post is not deleted');
  }

  // Restore the post
  const restoredPost = await prisma.post.update({
    where: { id },
    data: { deletedAt: null },
    include: {
      category: true,
      user: true
    }
  });

  return convertToPost(restoredPost);
};

/**
 * Permanently delete a post
 */
export const permanentlyDeletePost = async (id: string): Promise<void> => {
  // Check if post exists
  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  // Delete the post
  await prisma.post.delete({
    where: { id }
  });
};
