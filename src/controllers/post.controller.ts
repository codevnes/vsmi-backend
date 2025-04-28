import { Request, Response, NextFunction } from 'express';
import * as postService from '../services';
import { successResponse } from '../utils/response';
import { BadRequestError } from '../utils/error';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';

/**
 * Validation rules for creating a post
 */
const createPostValidation = [
  body('title').isString().notEmpty().withMessage('Title is required'),
  body('content').isString().notEmpty().withMessage('Content is required'),
  body('slug').optional().isString().withMessage('Slug must be a string'),
  body('excerpt').optional().isString().withMessage('Excerpt must be a string'),
  body('thumbnailId').optional().isInt().withMessage('Thumbnail ID must be an integer'),
  body('published').optional().isBoolean().withMessage('Published must be a boolean'),
  body('publishedAt').optional().isISO8601().withMessage('Published at must be a valid date'),
  body('categoryIds').optional().isArray().withMessage('Category IDs must be an array'),
  body('categoryIds.*').optional().isUUID().withMessage('Each category ID must be a valid UUID'),
];

/**
 * Validation rules for updating a post
 */
const updatePostValidation = [
  param('id').isUUID().withMessage('Post ID must be a valid UUID'),
  body('title').optional().isString().withMessage('Title must be a string'),
  body('content').optional().isString().withMessage('Content must be a string'),
  body('slug').optional().isString().withMessage('Slug must be a string'),
  body('excerpt').optional().isString().withMessage('Excerpt must be a string'),
  body('thumbnailId').optional().isInt().withMessage('Thumbnail ID must be an integer'),
  body('published').optional().isBoolean().withMessage('Published must be a boolean'),
  body('publishedAt').optional().isISO8601().withMessage('Published at must be a valid date'),
  body('categoryIds').optional().isArray().withMessage('Category IDs must be an array'),
  body('categoryIds.*').optional().isUUID().withMessage('Each category ID must be a valid UUID'),
];

/**
 * Get all posts with pagination
 * @route GET /api/v1/posts
 */
export const getPosts = [
  authenticate,
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString(),
    query('categoryId').optional().isUUID().withMessage('Category ID must be a valid UUID'),
    query('authorId').optional().isUUID().withMessage('Author ID must be a valid UUID'),
    query('published').optional().isBoolean().withMessage('Published must be a boolean'),
    query('includeDeleted').optional().isBoolean().withMessage('Include deleted must be a boolean'),
    query('sortBy').optional().isIn(['title', 'createdAt', 'publishedAt']).withMessage('Sort by must be one of: title, createdAt, publishedAt'),
    query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be either asc or desc'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { 
        page, 
        limit, 
        search, 
        categoryId, 
        authorId, 
        published, 
        includeDeleted, 
        sortBy, 
        sortDirection 
      } = req.query;
      
      const params = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        categoryId: categoryId as string,
        authorId: authorId as string,
        published: published === 'true',
        includeDeleted: includeDeleted === 'true',
        sortBy: sortBy as 'title' | 'createdAt' | 'publishedAt',
        sortDirection: sortDirection as 'asc' | 'desc',
      };
      
      const result = await postService.listPosts(params);
      return successResponse(res, result, 'Posts retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get post by ID
 * @route GET /api/v1/posts/:id
 */
export const getPostById = [
  authenticate,
  validate([
    param('id').isUUID().withMessage('Post ID must be a valid UUID'),
    query('includeDeleted').optional().isBoolean().withMessage('Include deleted must be a boolean'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const includeDeleted = req.query.includeDeleted === 'true';
      
      const post = await postService.getPostById(id, includeDeleted);
      return successResponse(res, post, 'Post retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get post by slug
 * @route GET /api/v1/posts/slug/:slug
 */
export const getPostBySlug = [
  authenticate,
  validate([
    param('slug').isString().withMessage('Slug must be a string'),
    query('includeDeleted').optional().isBoolean().withMessage('Include deleted must be a boolean'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug;
      const includeDeleted = req.query.includeDeleted === 'true';
      
      const post = await postService.getPostBySlug(slug, includeDeleted);
      return successResponse(res, post, 'Post retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Create a new post
 * @route POST /api/v1/posts
 */
export const createPost = [
  authenticate,
  checkRole(['ADMIN', 'AUTHOR']),
  validate(createPostValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.user?.id;
      if (!authorId) {
        throw new BadRequestError('User ID not found');
      }
      
      const postData = req.body;
      const post = await postService.createPost(authorId, postData);
      return successResponse(res, post, 'Post created successfully', 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Update a post
 * @route PUT /api/v1/posts/:id
 */
export const updatePost = [
  authenticate,
  checkRole(['ADMIN', 'AUTHOR']),
  validate(updatePostValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const postData = req.body;
      
      // Ensure at least one field is provided
      if (Object.keys(postData).length === 0) {
        throw new BadRequestError('No update data provided');
      }
      
      const post = await postService.updatePost(id, postData);
      return successResponse(res, post, 'Post updated successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Soft delete a post
 * @route DELETE /api/v1/posts/:id
 */
export const softDeletePost = [
  authenticate,
  checkRole(['ADMIN', 'AUTHOR']),
  validate([
    param('id').isUUID().withMessage('Post ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await postService.softDeletePost(id);
      return successResponse(res, null, 'Post deleted successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Restore a soft-deleted post
 * @route POST /api/v1/posts/:id/restore
 */
export const restorePost = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('id').isUUID().withMessage('Post ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const restoredPost = await postService.restorePost(id);
      return successResponse(res, restoredPost, 'Post restored successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Permanently delete a post
 * @route DELETE /api/v1/posts/:id/permanent
 */
export const permanentlyDeletePost = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('id').isUUID().withMessage('Post ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await postService.permanentlyDeletePost(id);
      return successResponse(res, null, 'Post permanently deleted');
    } catch (error) {
      next(error);
    }
  },
];
