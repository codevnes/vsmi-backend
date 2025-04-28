import { Router } from 'express';
import {
  getAllSettings,
  getSettingsByGroup,
  getSettingByKey,
  createSetting,
  updateSetting,
  deleteSetting,
  upsertSetting,
  bulkUpsertSettings
} from '../controllers/setting.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: API endpoints for managing application settings
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get all settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all settings
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, checkRole(['ADMIN']), getAllSettings);

/**
 * @swagger
 * /api/settings/group/{group}:
 *   get:
 *     summary: Get settings by group
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: group
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of settings for the specified group
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.get('/group/:group', authenticate, getSettingsByGroup);

/**
 * @swagger
 * /api/settings/{key}:
 *   get:
 *     summary: Get setting by key
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The setting with the specified key
 *       404:
 *         description: Setting not found
 *       500:
 *         description: Server error
 */
router.get('/:key', authenticate, getSettingByKey);

/**
 * @swagger
 * /api/settings:
 *   post:
 *     summary: Create a new setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [text, number, boolean, json, image]
 *     responses:
 *       201:
 *         description: Setting created successfully
 *       400:
 *         description: Invalid request
 *       409:
 *         description: Key already exists
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, checkRole(['ADMIN']), createSetting);

/**
 * @swagger
 * /api/settings/{key}:
 *   put:
 *     summary: Update a setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [text, number, boolean, json, image]
 *     responses:
 *       200:
 *         description: Setting updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Setting not found
 *       500:
 *         description: Server error
 */
router.put('/:key', authenticate, checkRole(['ADMIN']), updateSetting);

/**
 * @swagger
 * /api/settings/{key}:
 *   delete:
 *     summary: Delete a setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Setting deleted successfully
 *       404:
 *         description: Setting not found
 *       500:
 *         description: Server error
 */
router.delete('/:key', authenticate, checkRole(['ADMIN']), deleteSetting);

/**
 * @swagger
 * /api/settings/upsert:
 *   post:
 *     summary: Create or update a setting
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [text, number, boolean, json, image]
 *     responses:
 *       200:
 *         description: Setting upserted successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/upsert', authenticate, checkRole(['ADMIN']), upsertSetting);

/**
 * @swagger
 * /api/settings/bulk-upsert:
 *   post:
 *     summary: Create or update multiple settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - settings
 *             properties:
 *               settings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - key
 *                     - value
 *                   properties:
 *                     key:
 *                       type: string
 *                     value:
 *                       type: string
 *                     description:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [text, number, boolean, json, image]
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */
router.post('/bulk-upsert', authenticate, checkRole(['ADMIN']), bulkUpsertSettings);

export default router;
