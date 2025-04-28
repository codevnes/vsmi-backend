import express from 'express';
import * as postController from '../controllers';

const router = express.Router();

/**
 * @route GET /api/v1/posts
 * @desc Get all posts with pagination
 * @access Private
 */
router.get('/', postController.getPosts);

/**
 * @route GET /api/v1/posts/slug/:slug
 * @desc Get post by slug
 * @access Private
 */
router.get('/slug/:slug', postController.getPostBySlug);

/**
 * @route GET /api/v1/posts/:id
 * @desc Get post by ID
 * @access Private
 */
router.get('/:id', postController.getPostById);

/**
 * @route POST /api/v1/posts
 * @desc Create a new post
 * @access Private (ADMIN, AUTHOR)
 */
router.post('/', postController.createPost);

/**
 * @route PUT /api/v1/posts/:id
 * @desc Update a post
 * @access Private (ADMIN, AUTHOR)
 */
router.put('/:id', postController.updatePost);

/**
 * @route DELETE /api/v1/posts/:id
 * @desc Soft delete a post
 * @access Private (ADMIN, AUTHOR)
 */
router.delete('/:id', postController.softDeletePost);

/**
 * @route POST /api/v1/posts/:id/restore
 * @desc Restore a soft-deleted post
 * @access Private (ADMIN only)
 */
router.post('/:id/restore', postController.restorePost);

/**
 * @route DELETE /api/v1/posts/:id/permanent
 * @desc Permanently delete a post
 * @access Private (ADMIN only)
 */
router.delete('/:id/permanent', postController.permanentlyDeletePost);

export default router;
