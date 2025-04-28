export interface PostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnailId?: number;
  published: boolean;
  publishedAt?: Date;
  authorId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  categories?: PostCategoryData[];
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PostCategoryData {
  postId: string;
  categoryId: string;
  category?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface CreatePostInput {
  title: string;
  slug?: string; // Optional, can be auto-generated
  content: string;
  excerpt?: string;
  thumbnailId?: number;
  published?: boolean;
  publishedAt?: Date;
  categoryIds?: string[];
}

export interface UpdatePostInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  thumbnailId?: number;
  published?: boolean;
  publishedAt?: Date;
  categoryIds?: string[];
}

export interface PostListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  authorId?: string;
  published?: boolean;
  includeDeleted?: boolean;
  sortBy?: 'title' | 'createdAt' | 'publishedAt';
  sortDirection?: 'asc' | 'desc';
}

export interface PostListResult {
  posts: PostData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 