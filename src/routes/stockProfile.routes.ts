import { Router } from 'express';
import { StockProfileController } from '../controllers/stockProfile.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import { uploadCSV, uploadExcel } from '../middlewares/upload.middleware';

const router = Router();
const stockProfileController = new StockProfileController();

/**
 * @swagger
 * /stock-profiles:
 *   get:
 *     summary: Get all stock profiles
 *     tags: [StockProfile]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', stockProfileController.getAllStockProfiles);

/**
 * @swagger
 * /stock-profiles/{id}:
 *   get:
 *     summary: Get stock profile by ID
 *     tags: [StockProfile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock profile ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Stock profile not found
 */
router.get('/id/:id', stockProfileController.getStockProfileById);

/**
 * @swagger
 * /stock-profiles/symbol/{symbol}:
 *   get:
 *     summary: Get stock profile by symbol
 *     tags: [StockProfile]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock symbol
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Stock profile not found
 */
router.get('/symbol/:symbol', stockProfileController.getStockProfileBySymbol);

/**
 * @swagger
 * /stock-profiles:
 *   post:
 *     summary: Create a new stock profile
 *     tags: [StockProfile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *             properties:
 *               symbol:
 *                 type: string
 *               price:
 *                 type: number
 *               profit:
 *                 type: number
 *               volume:
 *                 type: number
 *               pe:
 *                 type: number
 *               eps:
 *                 type: number
 *               roa:
 *                 type: number
 *               roe:
 *                 type: number
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 *       409:
 *         description: Stock profile already exists
 */
router.post('/', authenticate, checkRole(['ADMIN']), stockProfileController.createStockProfile);

/**
 * @swagger
 * /stock-profiles/{id}:
 *   put:
 *     summary: Update a stock profile
 *     tags: [StockProfile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               profit:
 *                 type: number
 *               volume:
 *                 type: number
 *               pe:
 *                 type: number
 *               eps:
 *                 type: number
 *               roa:
 *                 type: number
 *               roe:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Stock profile not found
 */
router.put('/:id', authenticate, checkRole(['ADMIN']), stockProfileController.updateStockProfile);

/**
 * @swagger
 * /stock-profiles/{id}:
 *   delete:
 *     summary: Delete a stock profile
 *     tags: [StockProfile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock profile ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Stock profile not found
 */
router.delete('/:id', authenticate, checkRole(['ADMIN']), stockProfileController.deleteStockProfile);

/**
 * @swagger
 * /stock-profiles/upsert/{symbol}:
 *   post:
 *     summary: Upsert a stock profile by symbol
 *     tags: [StockProfile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock symbol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               profit:
 *                 type: number
 *               volume:
 *                 type: number
 *               pe:
 *                 type: number
 *               eps:
 *                 type: number
 *               roa:
 *                 type: number
 *               roe:
 *                 type: number
 *     responses:
 *       200:
 *         description: Updated or created
 */
router.post('/upsert/:symbol', authenticate, checkRole(['ADMIN']), stockProfileController.upsertStockProfile);

/**
 * @swagger
 * /stock-profiles/batch:
 *   get:
 *     summary: Get multiple stock profiles by symbols
 *     tags: [StockProfile]
 *     parameters:
 *       - in: query
 *         name: symbols
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of stock symbols
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 */
router.get('/batch', stockProfileController.getStockProfilesBySymbols);

/**
 * @swagger
 * /stock-profiles/import:
 *   post:
 *     summary: Import stock profiles from CSV or Excel file
 *     tags: [StockProfile]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: CSV or Excel file containing stock profile data
 *     responses:
 *       200:
 *         description: Profiles imported or partially imported
 *       400:
 *         description: Bad request
 */
router.post('/import', authenticate, checkRole(['ADMIN']), uploadCSV, stockProfileController.importStockProfilesFromFile);

/**
 * @swagger
 * /stock-profiles/full:
 *   get:
 *     summary: Get full stock profiles with stock information
 *     tags: [StockProfile]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/full', stockProfileController.getFullProfiles);

/**
 * @swagger
 * /stock-profiles/full/symbol/{symbol}:
 *   get:
 *     summary: Get full stock profile by symbol with stock information
 *     tags: [StockProfile]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock symbol
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Stock profile not found
 */
router.get('/full/symbol/:symbol', stockProfileController.getFullProfileBySymbol);

export default router; 