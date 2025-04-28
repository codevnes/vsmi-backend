import express from 'express';
import * as categoryController from '../controllers';

const router = express.Router();

/**
 * @route GET /api/v1/categories
 * @desc Get all categories with pagination
 * @access Private
 */
router.get('/', categoryController.getCategories);

/**
 * @route GET /api/v1/categories/tree
 * @desc Get category tree
 * @access Private
 */
router.get('/tree', categoryController.getCategoryTree);

/**
 * @route GET /api/v1/categories/slug/:slug
 * @desc Get category by slug
 * @access Private
 */
router.get('/slug/:slug', categoryController.getCategoryBySlug);

/**
 * @route GET /api/v1/categories/:id
 * @desc Get category by ID
 * @access Private
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @route POST /api/v1/categories
 * @desc Create a new category
 * @access Private (ADMIN, AUTHOR)
 */
router.post('/', categoryController.createCategory);

/**
 * @route PUT /api/v1/categories/:id
 * @desc Update a category
 * @access Private (ADMIN, AUTHOR)
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @route DELETE /api/v1/categories/:id
 * @desc Soft delete a category
 * @access Private (ADMIN only)
 */
router.delete('/:id', categoryController.softDeleteCategory);

/**
 * @route POST /api/v1/categories/:id/restore
 * @desc Restore a soft-deleted category
 * @access Private (ADMIN only)
 */
router.post('/:id/restore', categoryController.restoreCategory);

/**
 * @route DELETE /api/v1/categories/:id/permanent
 * @desc Permanently delete a category
 * @access Private (ADMIN only)
 */
router.delete('/:id/permanent', categoryController.permanentlyDeleteCategory);

export default router;
