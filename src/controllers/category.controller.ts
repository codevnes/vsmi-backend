import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services';
import { successResponse } from '../utils/response';
import { BadRequestError } from '../utils/error';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import { Role } from '../types';

/**
 * Validation rules for creating a category
 */
const createCategoryValidation = [
  body('title').isString().notEmpty().withMessage('Title is required'),
  body('slug').optional().isString().withMessage('Slug must be a string'),
  body('thumbnailId').optional().isInt().withMessage('Thumbnail ID must be an integer'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('parentId').optional().isUUID().withMessage('Parent ID must be a valid UUID'),
];

/**
 * Validation rules for updating a category
 */
const updateCategoryValidation = [
  param('id').isUUID().withMessage('Category ID must be a valid UUID'),
  body('title').optional().isString().withMessage('Title must be a string'),
  body('slug').optional().isString().withMessage('Slug must be a string'),
  body('thumbnailId').optional().isInt().withMessage('Thumbnail ID must be an integer'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('parentId').optional().isUUID().withMessage('Parent ID must be a valid UUID'),
];

/**
 * Get all categories with pagination
 * @route GET /api/v1/categories
 */
export const getCategories = [
  authenticate,
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString(),
    query('parentId').optional().isUUID().withMessage('Parent ID must be a valid UUID'),
    query('includeDeleted').optional().isBoolean().withMessage('Include deleted must be a boolean'),
    query('sortBy').optional().isIn(['title', 'createdAt']).withMessage('Sort by must be one of: title, createdAt'),
    query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be either asc or desc'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { 
        page, 
        limit, 
        search, 
        parentId, 
        includeDeleted, 
        sortBy, 
        sortDirection 
      } = req.query;
      
      const params = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        parentId: parentId as string,
        includeDeleted: includeDeleted === 'true',
        sortBy: sortBy as 'title' | 'createdAt',
        sortDirection: sortDirection as 'asc' | 'desc',
      };
      
      const result = await categoryService.listCategories(params);
      return successResponse(res, result, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get category tree
 * @route GET /api/v1/categories/tree
 */
export const getCategoryTree = [
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await categoryService.getCategoryTree();
      return successResponse(res, result, 'Category tree retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get category by ID
 * @route GET /api/v1/categories/:id
 */
export const getCategoryById = [
  authenticate,
  validate([
    param('id').isUUID().withMessage('Category ID must be a valid UUID'),
    query('includeDeleted').optional().isBoolean().withMessage('Include deleted must be a boolean'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const includeDeleted = req.query.includeDeleted === 'true';
      
      const category = await categoryService.getCategoryById(id, includeDeleted);
      return successResponse(res, category, 'Category retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get category by slug
 * @route GET /api/v1/categories/slug/:slug
 */
export const getCategoryBySlug = [
  authenticate,
  validate([
    param('slug').isString().withMessage('Slug must be a string'),
    query('includeDeleted').optional().isBoolean().withMessage('Include deleted must be a boolean'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug;
      const includeDeleted = req.query.includeDeleted === 'true';
      
      const category = await categoryService.getCategoryBySlug(slug, includeDeleted);
      return successResponse(res, category, 'Category retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Create a new category
 * @route POST /api/v1/categories
 */
export const createCategory = [
  authenticate,
  checkRole(['ADMIN', 'AUTHOR']),
  validate(createCategoryValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryData = req.body;
      const category = await categoryService.createCategory(categoryData);
      return successResponse(res, category, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Update a category
 * @route PUT /api/v1/categories/:id
 */
export const updateCategory = [
  authenticate,
  checkRole(['ADMIN', 'AUTHOR']),
  validate(updateCategoryValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const categoryData = req.body;
      
      // Ensure at least one field is provided
      if (Object.keys(categoryData).length === 0) {
        throw new BadRequestError('No update data provided');
      }
      
      const category = await categoryService.updateCategory(id, categoryData);
      return successResponse(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Soft delete a category
 * @route DELETE /api/v1/categories/:id
 */
export const softDeleteCategory = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('id').isUUID().withMessage('Category ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await categoryService.softDeleteCategory(id);
      return successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Restore a soft-deleted category
 * @route POST /api/v1/categories/:id/restore
 */
export const restoreCategory = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('id').isUUID().withMessage('Category ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const restoredCategory = await categoryService.restoreCategory(id);
      return successResponse(res, restoredCategory, 'Category restored successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Permanently delete a category
 * @route DELETE /api/v1/categories/:id/permanent
 */
export const permanentlyDeleteCategory = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('id').isUUID().withMessage('Category ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await categoryService.permanentlyDeleteCategory(id);
      return successResponse(res, null, 'Category permanently deleted');
    } catch (error) {
      next(error);
    }
  },
];
