export interface ImageData {
  id: number;
  filename: string;
  processedFilename: string;
  path: string;
  url: string;
  altText?: string;
  mimetype?: string;
  size?: number;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateImageInput {
  filename: string;
  processedFilename: string;
  path: string;
  url: string;
  altText?: string;
  mimetype?: string;
  size?: number;
  width?: number;
  height?: number;
}

export interface UpdateImageInput {
  altText?: string;
}

export interface ImageListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'filename';
  sortDirection?: 'asc' | 'desc';
}

export interface ImageListResult {
  images: ImageData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadImageResult {
  image: ImageData;
  message: string;
}

export interface MultiUploadImageResult {
  images: ImageData[];
  successCount: number;
  failedCount: number;
  message: string;
}

export interface ImageUploadOptions {
  resize?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  generateThumbnail?: boolean;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

export interface ImageUploadErrorResult {
  originalFilename: string;
  error: string;
}

export type ImageUploadResult = {
  successful: ImageData[];
  failed: ImageUploadErrorResult[];
  totalProcessed: number;
}
