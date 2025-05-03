import express from 'express';
import * as currencyController from '../controllers';

const router = express.Router();

/**
 * Currency Routes
 */

/**
 * @route GET /api/v1/currencies
 * @desc Get all currencies with pagination
 * @access Private
 */
router.get('/', currencyController.getCurrencies);

/**
 * @route POST /api/v1/currencies/import
 * @desc Import currencies from a file (CSV, XLSX, XLS)
 * @access Private (ADMIN only)
 */
router.post('/import', currencyController.upload.single('file'), currencyController.importCurrenciesFromFile);

/**
 * @route POST /api/v1/currencies/import/json
 * @desc Import currencies from JSON data
 * @access Private (ADMIN only)
 */
router.post('/import/json', currencyController.importCurrenciesFromJson);

/**
 * Currency Price Routes
 */

/**
 * @route GET /api/v1/currencies/prices
 * @desc Get currency prices with filtering
 * @access Private
 */
router.get('/prices', currencyController.getCurrencyPrices);

/**
 * @route POST /api/v1/currencies/prices/import
 * @desc Import currency prices from a file (CSV, XLSX, XLS)
 * @access Private (ADMIN only)
 */
router.post('/prices/import', currencyController.upload.single('file'), currencyController.importCurrencyPricesFromFile);

/**
 * @route POST /api/v1/currencies/prices/import/json
 * @desc Import currency prices from JSON data
 * @access Private (ADMIN only)
 */
router.post('/prices/import/json', currencyController.importCurrencyPricesFromJson);

/**
 * @route GET /api/v1/currencies/prices/all
 * @desc Get all currency prices for a specific currency code using query param (handles currency pairs with slash)
 * @access Private
 */
router.get('/prices/all', currencyController.getAllCurrencyPricesByCodeQuery);

/**
 * @route GET /api/v1/currencies/prices/latest
 * @desc Get latest currency prices
 * @access Private
 */
router.get('/prices/latest', currencyController.getLatestCurrencyPrices);

/**
 * @route GET /api/v1/currencies/prices/:id
 * @desc Get currency price by ID
 * @access Private
 */
router.get('/prices/:id', currencyController.getCurrencyPriceById);

/**
 * @route POST /api/v1/currencies/prices
 * @desc Create a new currency price
 * @access Private (ADMIN only)
 */
router.post('/prices', currencyController.createCurrencyPrice);

/**
 * @route POST /api/v1/currencies/prices/bulk
 * @desc Create multiple currency prices
 * @access Private (ADMIN only)
 */
router.post('/prices/bulk', currencyController.createManyCurrencyPrices);

/**
 * @route PUT /api/v1/currencies/prices/:id
 * @desc Update a currency price
 * @access Private (ADMIN only)
 */
router.put('/prices/:id', currencyController.updateCurrencyPrice);

/**
 * @route DELETE /api/v1/currencies/prices/:id
 * @desc Delete a currency price
 * @access Private (ADMIN only)
 */
router.delete('/prices/:id', currencyController.deleteCurrencyPrice);

/**
 * @route GET /api/v1/currencies/:code
 * @desc Get currency by code
 * @access Private
 */
router.get('/:code', currencyController.getCurrencyByCode);

/**
 * @route PUT /api/v1/currencies/:code
 * @desc Update a currency
 * @access Private (ADMIN only)
 */
router.put('/:code', currencyController.updateCurrency);

/**
 * @route DELETE /api/v1/currencies/:code
 * @desc Delete a currency
 * @access Private (ADMIN only)
 */
router.delete('/:code', currencyController.deleteCurrency);

/**
 * @route POST /api/v1/currencies
 * @desc Create a new currency
 * @access Private (ADMIN only)
 */
router.post('/', currencyController.createCurrency);

/**
 * @route GET /api/v1/currencies/:currencyCode/prices/all
 * @desc Get all currency prices for a specific currency code without limit
 * @access Private
 */
router.get('/:currencyCode/prices/all', currencyController.getAllCurrencyPricesByCode);

/**
 * @route GET /api/v1/currencies/:currencyCode/prices
 * @desc Get currency prices by currency code and date range
 * @access Private
 */
router.get('/:currencyCode/prices', currencyController.getCurrencyPricesByDateRange);

export default router;
