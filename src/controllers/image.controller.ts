import { Request, Response, NextFunction } from 'express';
import * as imageService from '../services';
import { successResponse } from '../utils/response';
import { BadRequestError } from '../utils/error';
import { uploadSingleImage, uploadMultipleImages as multerUploadMultiple } from '../middlewares/upload.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { body, query, param } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { ImageUploadOptions } from '../types';

/**
 * Validation rules for updating image
 */
const updateImageValidation = [
  param('id').isInt().withMessage('Image ID must be an integer'),
  body('altText').optional().isString().withMessage('Alt text must be a string'),
];

/**
 * Parse image processing options from request
 */
const parseImageOptions = (req: Request): ImageUploadOptions | undefined => {
  const { 
    resize, 
    maxWidth, 
    maxHeight, 
    quality, 
    generateThumbnail, 
    thumbnailWidth, 
    thumbnailHeight 
  } = req.body;

  if (!resize && !generateThumbnail) {
    return undefined;
  }

  return {
    resize: resize === 'true' || resize === true,
    maxWidth: maxWidth ? parseInt(maxWidth as string, 10) : undefined,
    maxHeight: maxHeight ? parseInt(maxHeight as string, 10) : undefined,
    quality: quality ? parseInt(quality as string, 10) : undefined,
    generateThumbnail: generateThumbnail === 'true' || generateThumbnail === true,
    thumbnailWidth: thumbnailWidth ? parseInt(thumbnailWidth as string, 10) : undefined,
    thumbnailHeight: thumbnailHeight ? parseInt(thumbnailHeight as string, 10) : undefined,
  };
};

/**
 * Upload a single image
 * @route POST /api/v1/images/upload
 */
export const uploadImage = [
  authenticate,
  uploadSingleImage,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('No image file provided');
      }

      const options = parseImageOptions(req);
      const image = await imageService.processUploadedImage(req.file, options);
      return successResponse(res, { image }, 'Image uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Upload multiple images
 * @route POST /api/v1/images/upload-multiple
 */
export const uploadMultipleImagesHandler = [
  authenticate,
  multerUploadMultiple,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // The req.files will now be an object with field names as keys and arrays of files as values
      if (!req.files || Object.keys(req.files).length === 0) {
        throw new BadRequestError('No image files provided');
      }

      // Collect all files from different fields into a single array
      const allFiles: Express.Multer.File[] = [];
      Object.values(req.files).forEach((filesArray: Express.Multer.File[]) => {
        if (Array.isArray(filesArray)) {
          allFiles.push(...filesArray);
        }
      });

      if (allFiles.length === 0) {
        throw new BadRequestError('No valid image files found');
      }

      const options = parseImageOptions(req);
      const result = await imageService.processMultipleImages(allFiles, options);
      
      const message = result.failed.length > 0 
        ? `Uploaded ${result.successful.length} images successfully with ${result.failed.length} failures`
        : `All ${result.successful.length} images uploaded successfully`;
      
      return successResponse(
        res, 
        result, 
        message, 
        result.successful.length > 0 ? 201 : 400
      );
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Create thumbnail from existing image
 * @route POST /api/v1/images/:id/thumbnail
 */
export const createThumbnail = [
  authenticate,
  validate([
    param('id').isInt().withMessage('Image ID must be an integer'),
    body('width').isInt({ min: 50, max: 500 }).withMessage('Width must be between 50 and 500 pixels'),
    body('height').isInt({ min: 50, max: 500 }).withMessage('Height must be between 50 and 500 pixels'),
    body('quality').optional().isInt({ min: 1, max: 100 }).withMessage('Quality must be between 1 and 100'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { width, height, quality } = req.body;
      
      const thumbnail = await imageService.createThumbnail(id, {
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        quality: quality ? parseInt(quality, 10) : undefined
      });
      
      return successResponse(res, { thumbnail }, 'Thumbnail created successfully', 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get all images with pagination
 * @route GET /api/v1/images
 */
export const getImages = [
  // authenticate,
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString(),
    query('sortBy').optional().isIn(['createdAt', 'filename']).withMessage('Sort by must be one of: createdAt, filename'),
    query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be either asc or desc'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, search, sortBy, sortDirection } = req.query;
      
      const params = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        sortBy: sortBy as 'createdAt' | 'filename',
        sortDirection: sortDirection as 'asc' | 'desc',
      };
      
      const result = await imageService.listImages(params);
      return successResponse(res, result, 'Images retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get image by ID
 * @route GET /api/v1/images/:id
 */
export const getImageById = [
  authenticate,
  validate([
    param('id').isInt().withMessage('Image ID must be an integer'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const image = await imageService.getImageById(id);
      return successResponse(res, image, 'Image retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Update image metadata
 * @route PUT /api/v1/images/:id
 */
export const updateImage = [
  authenticate,
  validate(updateImageValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { altText } = req.body;
      
      const updatedImage = await imageService.updateImage(id, { altText });
      return successResponse(res, updatedImage, 'Image updated successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Delete image
 * @route DELETE /api/v1/images/:id
 */
export const deleteImage = [
  authenticate,
  validate([
    param('id').isInt().withMessage('Image ID must be an integer'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      await imageService.deleteImage(id);
      return successResponse(res, null, 'Image deleted successfully');
    } catch (error) {
      next(error);
    }
  },
];
