import { Router } from 'express';
import {
  getFinancialMetrics,
  getFinancialMetricsById,
  getFinancialMetricsBySymbol,
  createFinancialMetrics,
  updateFinancialMetrics,
  deleteFinancialMetrics,
  importFinancialMetrics,
  getFinancialMetricsReports,
  deleteAllFinancialMetrics,
  getFinancialMetricsJobStatus,
} from '../controllers/financialMetrics.controller';

const router = Router();

/**
 * @route GET /api/v1/financial-metrics
 * @desc Get all financial metrics with pagination and filtering
 * @access Private
 */
router.get('/', getFinancialMetrics);

/**
 * @route POST /api/v1/financial-metrics
 * @desc Create a new financial metrics record
 * @access Private (Admin)
 */
router.post('/', createFinancialMetrics);

/**
 * @route POST /api/v1/financial-metrics/import
 * @desc Bulk import financial metrics from CSV or Excel file
 * @access Private (Admin)
 */
router.post('/import', importFinancialMetrics);

/**
 * @route GET /api/v1/financial-metrics/jobs/:jobId
 * @desc Get status of a financial metrics import job
 * @access Private (Admin)
 */
router.get('/jobs/:jobId', getFinancialMetricsJobStatus);

/**
 * @route DELETE /api/v1/financial-metrics/delete-all
 * @desc Delete all financial metrics data
 * @access Private (Admin)
 */
router.delete('/delete-all', deleteAllFinancialMetrics);

/**
 * @route GET /api/v1/financial-metrics/stock/:symbol
 * @desc Get financial metrics for a specific stock
 * @access Private
 */
router.get('/stock/:symbol', getFinancialMetricsBySymbol);

/**
 * @route GET /api/v1/financial-metrics/stock/:symbol/reports
 * @desc Get financial metrics reports by year or quarter for a specific stock
 * @access Private
 */
router.get('/stock/:symbol/reports', getFinancialMetricsReports);

/**
 * @route GET /api/v1/financial-metrics/:id
 * @desc Get a single financial metrics record by ID
 * @access Private
 */
router.get('/:id', getFinancialMetricsById);

/**
 * @route PUT /api/v1/financial-metrics/:id
 * @desc Update an existing financial metrics record
 * @access Private (Admin)
 */
router.put('/:id', updateFinancialMetrics);

/**
 * @route DELETE /api/v1/financial-metrics/:id
 * @desc Delete a financial metrics record
 * @access Private (Admin)
 */
router.delete('/:id', deleteFinancialMetrics);

export default router; 