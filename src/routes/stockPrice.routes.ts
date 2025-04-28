import express from 'express';
import {
  getStockPrices,
  getStockPriceById,
  createStockPrice,
  updateStockPrice,
  deleteStockPrice,
  bulkUpsertStockPrices,
  uploadStockPricesCsv,
  getAllStockPrices,
  getJobStatus
} from '../controllers/stockPrice.controller';

const router = express.Router();

// Get stock prices by symbol
router.get('/symbol/:symbol', getStockPrices);

// Get all stock prices with filtering
router.get('/', getAllStockPrices);

// Get stock price by ID
router.get('/:id', getStockPriceById);

// Create new stock price
router.post('/', createStockPrice);

// Update stock price
router.put('/:id', updateStockPrice);

// Delete stock price
router.delete('/:id', deleteStockPrice);

// Bulk upsert stock prices
router.post('/bulk', bulkUpsertStockPrices);

// Upload stock prices CSV/Excel
router.post('/upload', uploadStockPricesCsv);

// Get job status
router.get('/job/:jobId', getJobStatus);

export default router;
