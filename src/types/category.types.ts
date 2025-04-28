export interface CategoryData {
  id: string;
  title: string;
  slug: string;
  thumbnailId?: number;
  description?: string;
  parentId?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  children?: CategoryData[];
  parent?: CategoryData;
}

export interface CreateCategoryInput {
  title: string;
  slug?: string; // Optional, can be auto-generated
  thumbnailId?: number;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryInput {
  title?: string;
  slug?: string;
  thumbnailId?: number;
  description?: string;
  parentId?: string;
}

export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string;
  includeDeleted?: boolean;
  sortBy?: 'title' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export interface CategoryListResult {
  categories: CategoryData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryWithChildren extends CategoryData {
  children: CategoryWithChildren[];
}

export interface CategoryTreeResult {
  categories: CategoryWithChildren[];
  total: number;
} 