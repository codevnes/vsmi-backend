import { Prisma } from '@prisma/client';
import { 
  CategoryData, 
  CategoryListParams, 
  CategoryListResult, 
  CategoryWithChildren, 
  CategoryTreeResult, 
  CreateCategoryInput, 
  UpdateCategoryInput 
} from '../types';
import { BadRequestError, NotFoundError } from '../utils/error';
import prisma from '../config/database';

/**
 * Generate a slug from title
 */
function generateSlug(title: string): string {
  // Simple slugify implementation since we can't install slugify
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert Prisma Category to CategoryData (handling null values)
 */
function convertToCategory(category: any): CategoryData {
  return {
    ...category,
    thumbnailId: category.thumbnailId || undefined,
    description: category.description || undefined,
    parentId: category.parentId || undefined,
    deletedAt: category.deletedAt || undefined,
    parent: category.parent ? convertToCategory(category.parent) : undefined,
    children: category.children ? category.children.map(convertToCategory) : undefined
  };
}

/**
 * Create a new category
 */
export const createCategory = async (data: CreateCategoryInput): Promise<CategoryData> => {
  const { title, thumbnailId, description, parentId } = data;
  let slug = data.slug;

  // Generate slug if not provided
  if (!slug) {
    slug = generateSlug(title);
  }

  // Check if slug is already in use
  const existingCategory = await prisma.category.findUnique({
    where: { slug }
  });

  if (existingCategory) {
    throw new BadRequestError(`A category with slug "${slug}" already exists`);
  }

  // If parentId is provided, verify parent exists
  if (parentId) {
    const parentExists = await prisma.category.findUnique({ 
      where: { id: parentId } 
    });
    
    if (!parentExists) {
      throw new BadRequestError('Parent category not found');
    }
  }

  const category = await prisma.category.create({
    data: {
      title,
      slug,
      thumbnailId,
      description,
      parentId,
    },
    include: {
      parent: true,
      children: true
    }
  });

  return convertToCategory(category);
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: string, includeDeleted: boolean = false): Promise<CategoryData> => {
  const category = await prisma.category.findUnique({
    where: {
      id,
      ...(includeDeleted ? {} : { deletedAt: null }),
    },
    include: {
      parent: true,
      children: {
        where: { deletedAt: null }
      }
    }
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return convertToCategory(category);
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug: string, includeDeleted: boolean = false): Promise<CategoryData> => {
  const category = await prisma.category.findUnique({
    where: {
      slug,
      ...(includeDeleted ? {} : { deletedAt: null }),
    },
    include: {
      parent: true,
      children: {
        where: { deletedAt: null }
      }
    }
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return convertToCategory(category);
};

/**
 * List categories with pagination
 */
export const listCategories = async (params: CategoryListParams): Promise<CategoryListResult> => {
  const {
    page = 1,
    limit = 20,
    search = '',
    parentId,
    includeDeleted = false,
    sortBy = 'createdAt',
    sortDirection = 'desc'
  } = params;

  const skip = (page - 1) * limit;

  // Build search conditions
  const where: Prisma.CategoryWhereInput = {};
  
  // Only include non-deleted categories unless specifically requested
  if (!includeDeleted) {
    where.deletedAt = null;
  }

  // Add search condition if provided
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
    ];
  }

  // Filter by parent ID if provided
  if (parentId !== undefined) {
    where.parentId = parentId ? parentId : null; // null means root categories
  }

  // Get total count
  const total = await prisma.category.count({ where });

  // Get categories
  const categoriesResult = await prisma.category.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortDirection },
    include: {
      parent: true,
      children: {
        where: { deletedAt: null },
        take: 5 // Limit number of children to avoid massive payloads
      }
    }
  });

  // Convert to our type
  const categories = categoriesResult.map(convertToCategory);

  return {
    categories,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Get category tree starting from root categories
 */
export const getCategoryTree = async (): Promise<CategoryTreeResult> => {
  // Get root categories (those without a parent)
  const rootCategories = await prisma.category.findMany({
    where: {
      parentId: null,
      deletedAt: null
    },
    orderBy: { title: 'asc' }
  });

  const total = rootCategories.length;
  const categories = await Promise.all(
    rootCategories.map(async (rootCategory) => {
      return await buildCategoryTree(rootCategory.id);
    })
  );

  return {
    categories,
    total
  };
};

/**
 * Recursively build category tree
 */
export const buildCategoryTree = async (categoryId: string): Promise<CategoryWithChildren> => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
      deletedAt: null
    }
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  const children = await prisma.category.findMany({
    where: {
      parentId: categoryId,
      deletedAt: null
    },
    orderBy: { title: 'asc' }
  });

  const childrenWithSubcategories = await Promise.all(
    children.map(async (child) => {
      return await buildCategoryTree(child.id);
    })
  );

  return {
    ...convertToCategory(category),
    children: childrenWithSubcategories
  };
};

/**
 * Update a category
 */
export const updateCategory = async (id: string, data: UpdateCategoryInput): Promise<CategoryData> => {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  // If slug is being updated, check it's not already in use
  if (data.slug && data.slug !== category.slug) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug }
    });

    if (existingCategory) {
      throw new BadRequestError(`A category with slug "${data.slug}" already exists`);
    }
  }

  // If parentId is being updated, verify new parent exists and prevent circular references
  if (data.parentId && data.parentId !== category.parentId) {
    // Check if parent exists
    const parentExists = await prisma.category.findUnique({ 
      where: { id: data.parentId } 
    });
    
    if (!parentExists) {
      throw new BadRequestError('Parent category not found');
    }

    // Prevent circular references
    if (data.parentId === id) {
      throw new BadRequestError('A category cannot be its own parent');
    }

    // Check if the new parent is a descendant of this category
    const isDescendant = await isDescendantOf(data.parentId, id);
    if (isDescendant) {
      throw new BadRequestError('Cannot set a descendant as the parent (circular reference)');
    }
  }

  // Update the category
  const updatedCategory = await prisma.category.update({
    where: { id },
    data,
    include: {
      parent: true,
      children: true
    }
  });

  return convertToCategory(updatedCategory);
};

/**
 * Check if a category is a descendant of another
 */
async function isDescendantOf(categoryId: string, potentialAncestorId: string): Promise<boolean> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { parentId: true }
  });

  if (!category || !category.parentId) {
    return false;
  }

  if (category.parentId === potentialAncestorId) {
    return true;
  }

  return await isDescendantOf(category.parentId, potentialAncestorId);
}

/**
 * Soft delete a category
 */
export const softDeleteCategory = async (id: string): Promise<void> => {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id },
    include: { children: true }
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  // Check if the category has any children
  if (category.children && category.children.length > 0) {
    throw new BadRequestError('Cannot delete a category with subcategories. Delete subcategories first or update their parent.');
  }

  // Check if category is used in posts
  const postsCount = await prisma.post.count({
    where: { categoryId: id }
  });

  if (postsCount > 0) {
    throw new BadRequestError(`Cannot delete this category because it is used by ${postsCount} posts.`);
  }

  // Soft delete by setting deletedAt
  await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};

/**
 * Restore a soft-deleted category
 */
export const restoreCategory = async (id: string): Promise<CategoryData> => {
  // Check if soft-deleted category exists
  const category = await prisma.category.findFirst({
    where: {
      id,
      deletedAt: { not: null }
    }
  });

  if (!category) {
    throw new NotFoundError('Deleted category not found');
  }

  // If the category has a parent, ensure the parent is not deleted
  if (category.parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: category.parentId }
    });

    if (parent?.deletedAt) {
      throw new BadRequestError('Cannot restore a category whose parent is deleted. Restore the parent first.');
    }
  }

  // Restore by clearing deletedAt
  const restoredCategory = await prisma.category.update({
    where: { id },
    data: { deletedAt: null },
    include: {
      parent: true,
      children: true
    }
  });

  return convertToCategory(restoredCategory);
};

/**
 * Permanently delete a category
 */
export const permanentlyDeleteCategory = async (id: string): Promise<void> => {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id },
    include: { children: true }
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  // Check if the category has any children
  if (category.children && category.children.length > 0) {
    throw new BadRequestError('Cannot delete a category with subcategories. Delete subcategories first or update their parent.');
  }

  // Check if category is used in posts
  const postsCount = await prisma.post.count({
    where: { categoryId: id }
  });

  if (postsCount > 0) {
    throw new BadRequestError(`Cannot delete this category because it is used by ${postsCount} posts.`);
  }

  // Permanently delete
  await prisma.category.delete({
    where: { id }
  });
};
