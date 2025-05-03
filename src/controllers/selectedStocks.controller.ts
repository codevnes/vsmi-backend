import { Request, Response, NextFunction } from 'express';
import * as selectedStocksService from '../services/selectedStocks.service';
import { successResponse } from '../utils/response';
import { BadRequestError, NotFoundError } from '../utils/error';
import { body, param, query, CustomValidator } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Custom validator for flexible date formats
const isValidDate: CustomValidator = (value) => {
  if (!value) return false;
  
  // If it's already a Date object
  if (value instanceof Date) return true;
  
  // Check for ISO8601 format
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  
  // Check for M/D/YYYY format
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
    const parts = value.split('/');
    const month = parseInt(parts[0]) - 1;
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    const date = new Date(year, month, day);
    return !isNaN(date.getTime());
  }
  
  return false;
};

// Date parser for different formats
export const parseDate = (dateString: string | Date): Date => {
  if (dateString instanceof Date) return dateString;
  
  // Handle format "M/D/YYYY"
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    const parts = dateString.split('/');
    const month = parseInt(parts[0]) - 1;
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  
  // Default to standard Date parsing
  return new Date(dateString);
};

/**
 * Validation rules for creating a selected stocks entry
 */
const createSelectedStocksValidation = [
  body('symbol').isString().notEmpty().withMessage('Symbol is required'),
  body('date').custom(isValidDate).withMessage('Valid date is required'),
  body('close').optional().isFloat({ min: 0 }).withMessage('Close price must be a positive number'),
  body('return').optional().isFloat().withMessage('Return must be a number'),
  body('qIndex').optional().isFloat().withMessage('QIndex must be a number'),
  body('volume').optional().isFloat({ min: 0 }).withMessage('Volume must be a positive number'),
];

/**
 * Validation rules for updating a selected stocks entry
 */
const updateSelectedStocksValidation = [
  param('id').isUUID().withMessage('Selected stocks ID must be a valid UUID'),
  body('close').optional().isFloat({ min: 0 }).withMessage('Close price must be a positive number'),
  body('return').optional().isFloat().withMessage('Return must be a number'),
  body('qIndex').optional().isFloat().withMessage('QIndex must be a number'),
  body('volume').optional().isFloat({ min: 0 }).withMessage('Volume must be a positive number'),
];

/**
 * Validation rules for bulk upsert of selected stocks entries
 */
const bulkUpsertSelectedStocksValidation = [
  body().isArray().withMessage('Request body must be an array'),
  body('*.symbol').isString().notEmpty().withMessage('Symbol is required'),
  body('*.date').custom(isValidDate).withMessage('Valid date is required'),
  body('*.close').optional().isFloat({ min: 0 }).withMessage('Close price must be a positive number'),
  body('*.return').optional().isFloat().withMessage('Return must be a number'),
  body('*.qIndex').optional().isFloat().withMessage('QIndex must be a number'),
  body('*.volume').optional().isFloat({ min: 0 }).withMessage('Volume must be a positive number'),
];

/**
 * Configure multer for file uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'temp');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${file.originalname}`;
    cb(null, uniqueFileName);
  }
});

// File filter to accept only CSV and XLSX files
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
  const allowedExtensions = ['.csv', '.xlsx', '.xls'];
  
  const extname = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV and Excel files are allowed'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Handles file uploads and passes to the controller
const handleFileUpload = upload.single('file');

/**
 * Get selected stocks with pagination and filtering
 * @route GET /api/v1/selected-stocks
 */
export const getSelectedStocksList = [
  validate([
    query('symbol').optional().isString().withMessage('Symbol must be a string'),
    query('startDate').optional().isISO8601().toDate().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().toDate().withMessage('End date must be a valid ISO date'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be either asc or desc'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { symbol, startDate, endDate, page, limit, sortDirection } = req.query;
      
      // Process limit parameter
      let parsedLimit: number | undefined = undefined;
      if (limit !== undefined && limit !== '') {
        parsedLimit = parseInt(limit as string, 10);
      }
      
      const params = {
        symbol: symbol ? String(symbol) : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: parsedLimit,
        sortDirection: sortDirection as 'asc' | 'desc' | undefined,
      };
      
      const result = await selectedStocksService.getSelectedStocks(params);
      return successResponse(res, result, 'Selected stocks retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get selected stocks by symbol with pagination and date filtering
 * @route GET /api/v1/selected-stocks/symbol/:symbol
 */
export const getSelectedStocksBySymbol = [
  validate([
    param('symbol').isString().notEmpty().withMessage('Symbol is required'),
    query('startDate').optional().isISO8601().toDate().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().toDate().withMessage('End date must be a valid ISO date'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be either asc or desc'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const symbol = req.params.symbol;
      const { startDate, endDate, page, limit, sortDirection } = req.query;
      
      // Process limit parameter
      let parsedLimit: number | undefined = undefined;
      if (limit !== undefined && limit !== '') {
        parsedLimit = parseInt(limit as string, 10);
      }
      
      const params = {
        symbol,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: parsedLimit,
        sortDirection: sortDirection as 'asc' | 'desc' | undefined,
      };
      
      const result = await selectedStocksService.getSelectedStocks(params);
      return successResponse(res, result, 'Selected stocks retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get selected stocks by ID
 * @route GET /api/v1/selected-stocks/:id
 */
export const getSelectedStocksById = [
  authenticate,
  validate([
    param('id').isUUID().withMessage('Selected stocks ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const selectedStocks = await selectedStocksService.getSelectedStocksById(id);
      return successResponse(res, selectedStocks, 'Selected stocks retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Create a new selected stocks entry
 * @route POST /api/v1/selected-stocks
 */
export const createSelectedStocks = [
  authenticate,
  checkRole(['ADMIN']),
  validate(createSelectedStocksValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const selectedStocksData = req.body;
      const selectedStocks = await selectedStocksService.createSelectedStocks(selectedStocksData);
      return successResponse(res, selectedStocks, 'Selected stocks created successfully', 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Update a selected stocks entry
 * @route PUT /api/v1/selected-stocks/:id
 */
export const updateSelectedStocks = [
  authenticate,
  checkRole(['ADMIN']),
  validate(updateSelectedStocksValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const selectedStocksData = req.body;
      const selectedStocks = await selectedStocksService.updateSelectedStocks(id, selectedStocksData);
      return successResponse(res, selectedStocks, 'Selected stocks updated successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Delete a selected stocks entry
 * @route DELETE /api/v1/selected-stocks/:id
 */
export const deleteSelectedStocks = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('id').isUUID().withMessage('Selected stocks ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await selectedStocksService.deleteSelectedStocks(id);
      return successResponse(res, null, 'Selected stocks deleted successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Bulk upsert selected stocks entries
 * @route POST /api/v1/selected-stocks/bulk
 */
export const bulkUpsertSelectedStocks = [
  authenticate,
  checkRole(['ADMIN']),
  validate(bulkUpsertSelectedStocksValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Format dates before passing to service
      const selectedStocksData = req.body.map((item: any) => ({
        ...item,
        date: typeof item.date === 'string' ? parseDate(item.date) : item.date
      }));
      
      const count = await selectedStocksService.bulkUpsertSelectedStocks(selectedStocksData);
      return successResponse(res, { count }, `Successfully processed ${count} selected stocks entries`);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get selected stocks with price history for the last 6 months
 * @route GET /api/v1/selected-stocks/with-price-history
 */
export const getSelectedStocksWithPriceHistory = [
  validate([
    query('date').optional().custom(isValidDate).withMessage('Valid date is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, page, limit } = req.query;
      
      // Process limit parameter
      let parsedLimit: number | undefined = undefined;
      if (limit !== undefined && limit !== '') {
        parsedLimit = parseInt(limit as string, 10);
      }
      
      const params = {
        date: date ? parseDate(date as string) : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: parsedLimit,
      };
      
      const result = await selectedStocksService.getSelectedStocksWithPriceHistory(params);
      return successResponse(res, result, 'Selected stocks with price history retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
]; 