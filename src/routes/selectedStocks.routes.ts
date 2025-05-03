import { Router } from 'express';
import * as selectedStocksController from '../controllers/selectedStocks.controller';

const router = Router();

/**
 * @route GET /api/v1/selected-stocks
 * @desc Get selected stocks with pagination and filtering
 * @access Public
 */
router.get('/', selectedStocksController.getSelectedStocksList);

/**
 * @route GET /api/v1/selected-stocks/with-price-history
 * @desc Get selected stocks with price history for the last 6 months
 * @access Public
 */
router.get('/with-price-history', selectedStocksController.getSelectedStocksWithPriceHistory);

/**
 * @route GET /api/v1/selected-stocks/symbol/:symbol
 * @desc Get selected stocks by symbol with pagination and date filtering
 * @access Public
 */
router.get('/symbol/:symbol', selectedStocksController.getSelectedStocksBySymbol);

/**
 * @route GET /api/v1/selected-stocks/:id
 * @desc Get selected stocks by ID
 * @access Private
 */
router.get('/:id', selectedStocksController.getSelectedStocksById);

/**
 * @route POST /api/v1/selected-stocks
 * @desc Create a new selected stocks entry
 * @access Private (Admin only)
 */
router.post('/', selectedStocksController.createSelectedStocks);

/**
 * @route PUT /api/v1/selected-stocks/:id
 * @desc Update a selected stocks entry
 * @access Private (Admin only)
 */
router.put('/:id', selectedStocksController.updateSelectedStocks);

/**
 * @route DELETE /api/v1/selected-stocks/:id
 * @desc Delete a selected stocks entry
 * @access Private (Admin only)
 */
router.delete('/:id', selectedStocksController.deleteSelectedStocks);

/**
 * @route POST /api/v1/selected-stocks/bulk
 * @desc Bulk upsert selected stocks entries
 * @access Private (Admin only)
 */
router.post('/bulk', selectedStocksController.bulkUpsertSelectedStocks);

export default router; 