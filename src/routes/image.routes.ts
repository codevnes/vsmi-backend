import express from 'express';
import * as imageController from '../controllers/image.controller';

const router = express.Router();

/**
 * @route POST /api/v1/images/upload
 * @desc Upload a single image
 * @access Private
 */
router.post('/upload', imageController.uploadImage);

/**
 * @route POST /api/v1/images/upload-multiple
 * @desc Upload multiple images
 * @access Private
 */
router.post('/upload-multiple', imageController.uploadMultipleImagesHandler);

/**
 * @route POST /api/v1/images/:id/thumbnail
 * @desc Create a thumbnail from an existing image
 * @access Private
 */
router.post('/:id/thumbnail', imageController.createThumbnail);

/**
 * @route GET /api/v1/images
 * @desc Get all images with pagination
 * @access Private
 */
router.get('/', imageController.getImages);

/**
 * @route GET /api/v1/images/:id
 * @desc Get image by ID
 * @access Private
 */
router.get('/:id', imageController.getImageById);

/**
 * @route PUT /api/v1/images/:id
 * @desc Update image metadata
 * @access Private
 */
router.put('/:id', imageController.updateImage);

/**
 * @route DELETE /api/v1/images/:id
 * @desc Delete image
 * @access Private
 */
router.delete('/:id', imageController.deleteImage);

export default router;
