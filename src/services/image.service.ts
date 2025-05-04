import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CreateImageInput, ImageData, ImageListParams, ImageListResult, UpdateImageInput, ImageUploadOptions, ImageUploadResult, ImageUploadErrorResult } from '../types/image.types';
import { BadRequestError, NotFoundError } from '../utils/error';
import prisma from '../config/database';
import sharp from 'sharp';

/**
 * Create a new image record
 */
export const createImage = async (imageData: CreateImageInput): Promise<ImageData> => {
  const result = await prisma.image.create({
    data: imageData
  });
  
  // Convert nulls to undefined to match ImageData interface
  return {
    ...result,
    altText: result.altText ?? undefined,
    mimetype: result.mimetype ?? undefined,
    size: result.size ?? undefined,
    width: result.width ?? undefined,
    height: result.height ?? undefined,
  };
};

/**
 * Get image by ID
 */
export const getImageById = async (id: number): Promise<ImageData> => {
  const image = await prisma.image.findUnique({
    where: { id }
  });

  if (!image) {
    throw new NotFoundError('Image not found');
  }

  // Convert nulls to undefined to match ImageData interface
  return {
    ...image,
    altText: image.altText ?? undefined,
    mimetype: image.mimetype ?? undefined,
    size: image.size ?? undefined,
    width: image.width ?? undefined,
    height: image.height ?? undefined,
  };
};

/**
 * Get images with pagination
 */
export const listImages = async (params: ImageListParams): Promise<ImageListResult> => {
  const {
    page = 1,
    limit = 20,
    search = '',
    sortBy = 'createdAt',
    sortDirection = 'desc'
  } = params;

  const skip = (page - 1) * limit;

  // Build search conditions
  const where: Prisma.ImageWhereInput = {};
  if (search) {
    where.OR = [
      { filename: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { altText: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
    ];
  }

  // Get total count
  const total = await prisma.image.count({ where });

  // Get images
  const imagesResult = await prisma.image.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortDirection }
  });

  // Convert nulls to undefined to match ImageData interface
  const images = imagesResult.map(img => ({
    ...img,
    altText: img.altText ?? undefined,
    mimetype: img.mimetype ?? undefined,
    size: img.size ?? undefined,
    width: img.width ?? undefined,
    height: img.height ?? undefined,
  }));

  return {
    images,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Update image details
 */
export const updateImage = async (id: number, updateData: UpdateImageInput): Promise<ImageData> => {
  try {
    const result = await prisma.image.update({
      where: { id },
      data: updateData
    });
    
    // Convert nulls to undefined to match ImageData interface
    return {
      ...result,
      altText: result.altText ?? undefined,
      mimetype: result.mimetype ?? undefined,
      size: result.size ?? undefined,
      width: result.width ?? undefined,
      height: result.height ?? undefined,
    };
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new NotFoundError('Image not found');
    }
    throw error;
  }
};

/**
 * Delete image
 */
export const deleteImage = async (id: number): Promise<void> => {
  try {
    // First get the image to check if it exists and get the file path
    const image = await prisma.image.findUnique({
      where: { id }
    });

    if (!image) {
      throw new NotFoundError('Image not found');
    }

    // Delete the image from the database
    await prisma.image.delete({
      where: { id }
    });

    // Also delete the file from the filesystem if it exists
    const filePath = path.join(process.cwd(), image.path);
    const processedFilePath = path.join(process.cwd(), 'uploads', 'processed', image.processedFilename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    if (fs.existsSync(processedFilePath)) {
      fs.unlinkSync(processedFilePath);
    }
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new BadRequestError(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Process the uploaded file and create an image record
 */
export const processUploadedImage = async (file: Express.Multer.File, options?: ImageUploadOptions): Promise<ImageData> => {
  if (!file) {
    throw new BadRequestError('No image file provided');
  }

  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  const processedFilename = `${uuidv4()}_${file.originalname}`;

  // Create relative paths for storing in database
  const relativePath = path.join('uploads', 'original', file.filename);
  const imageUrl = `${baseUrl}/uploads/original/${file.filename}`;

  // Process the image if options are provided
  let width, height;
  if (options?.resize) {
    // In a real implementation, you'd use a library like sharp to resize/process the image
    // For now, we'll just simulate it by setting dimensions
    width = options.maxWidth || 800;
    height = options.maxHeight || 600;
    
    // Actually process the image (commented out as it's implementation-specific)
    // await processImage(file.path, options);
  }

  // Create image record
  const imageData: CreateImageInput = {
    filename: file.originalname,
    processedFilename,
    path: relativePath,
    url: imageUrl,
    mimetype: file.mimetype,
    size: file.size,
    width,
    height
  };

  return createImage(imageData);
};

/**
 * Process multiple uploaded files
 */
export const processMultipleImages = async (files: Express.Multer.File[], options?: ImageUploadOptions): Promise<ImageUploadResult> => {
  if (!files || files.length === 0) {
    throw new BadRequestError('No image files provided');
  }

  const successful: ImageData[] = [];
  const failed: ImageUploadErrorResult[] = [];

  // Process each file
  for (const file of files) {
    try {
      const processedImage = await processUploadedImage(file, options);
      successful.push(processedImage);
    } catch (error: any) {
      failed.push({
        originalFilename: file.originalname,
        error: error.message || 'Unknown error during processing'
      });
    }
  }

  return {
    successful,
    failed,
    totalProcessed: files.length
  };
};

/**
 * Create thumbnail from original image
 * This is a placeholder function - you would use a library like Sharp in a real implementation
 */
export const createThumbnail = async (imageId: number, options: { width: number; height: number; quality?: number }): Promise<ImageData> => {
  const { width, height, quality = 80 } = options;
  
  // Get the original image
  const originalImage = await getImageById(imageId);
  
  // In a real implementation, you would:
  // 1. Read the original image file
  // 2. Resize it to thumbnail dimensions
  // 3. Save it to the thumbnails directory
  // 4. Update the image record or create a related thumbnail record
  
  // For now, we'll simulate it
  const thumbnailUrl = originalImage.url.replace('/original/', '/thumbnails/');
  
  // In a real app, you'd create the actual thumbnail file and update the database
  // For this example, we're just returning the original image with updated info
  return {
    ...originalImage,
    url: thumbnailUrl
  };
};
