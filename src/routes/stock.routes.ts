import express from 'express';
import * as stockController from '../controllers';

const router = express.Router();

/**
 * @route GET /api/v1/stocks
 * @desc Get all stocks with pagination
 * @access Private
 */
router.get('/', stockController.getStocks);

/**
 * @route GET /api/v1/stocks/exchanges
 * @desc Get unique exchanges
 * @access Private
 */
router.get('/exchanges', stockController.getExchanges);

/**
 * @route GET /api/v1/stocks/industries
 * @desc Get unique industries
 * @access Private
 */
router.get('/industries', stockController.getIndustries);

/**
 * @route GET /api/v1/stocks/symbol/:symbol
 * @desc Get stock by symbol
 * @access Private
 */
router.get('/symbol/:symbol', stockController.getStockBySymbol);

/**
 * @route GET /api/v1/stocks/:id
 * @desc Get stock by ID
 * @access Private
 */
router.get('/:id', stockController.getStockById);

/**
 * @route POST /api/v1/stocks
 * @desc Create a new stock
 * @access Private (ADMIN only)
 */
router.post('/', stockController.createStock);

/**
 * @route PUT /api/v1/stocks/symbol/:symbol
 * @desc Update a stock by symbol
 * @access Private (ADMIN only)
 */
router.put('/symbol/:symbol', stockController.updateStockBySymbol);

/**
 * @route PUT /api/v1/stocks/:id
 * @desc Update a stock
 * @access Private (ADMIN only)
 */
router.put('/:id', stockController.updateStock);

/**
 * @route DELETE /api/v1/stocks/symbol/:symbol
 * @desc Delete a stock by symbol
 * @access Private (ADMIN only)
 */
router.delete('/symbol/:symbol', stockController.deleteStockBySymbol);

/**
 * @route DELETE /api/v1/stocks/:id
 * @desc Delete a stock
 * @access Private (ADMIN only)
 */
router.delete('/:id', stockController.deleteStock);

/**
 * @route POST /api/v1/stocks/import
 * @desc Bulk import stocks (create or update)
 * @access Private (ADMIN only)
 */
router.post('/import', stockController.importStocks);

/**
 * @route POST /api/v1/stocks/import-file
 * @desc Import stocks from a CSV or Excel file
 * @access Private (ADMIN only)
 */
router.post('/import-file', stockController.importStocksFromFile);

export default router;
