import { Request, Response, NextFunction } from 'express';
import * as stockPriceService from '../services/stockPrice.service';
import * as fileProcessorService from '../services/fileProcessor.service';
import { successResponse } from '../utils/response';
import { BadRequestError, NotFoundError } from '../utils/error';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

/**
 * Validation rules for creating a stock price
 */
const createStockPriceValidation = [
  body('symbol').isString().notEmpty().withMessage('Symbol is required'),
  body('date').isISO8601().toDate().withMessage('Valid date is required'),
  body('open').isFloat({ min: 0 }).withMessage('Open price must be a positive number'),
  body('high').isFloat({ min: 0 }).withMessage('High price must be a positive number'),
  body('low').isFloat({ min: 0 }).withMessage('Low price must be a positive number'),
  body('close').isFloat({ min: 0 }).withMessage('Close price must be a positive number'),
  body('volume').optional().isInt({ min: 0 }).withMessage('Volume must be a positive integer'),
  body('trendQ').optional().isFloat().withMessage('TrendQ must be a number'),
  body('fq').optional().isFloat().withMessage('FQ must be a number'),
  body('bandDown').optional().isFloat().withMessage('Band down must be a number'),
  body('bandUp').optional().isFloat().withMessage('Band up must be a number'),
];

/**
 * Validation rules for updating a stock price
 */
const updateStockPriceValidation = [
  param('id').isUUID().withMessage('Stock price ID must be a valid UUID'),
  body('open').optional().isFloat({ min: 0 }).withMessage('Open price must be a positive number'),
  body('high').optional().isFloat({ min: 0 }).withMessage('High price must be a positive number'),
  body('low').optional().isFloat({ min: 0 }).withMessage('Low price must be a positive number'),
  body('close').optional().isFloat({ min: 0 }).withMessage('Close price must be a positive number'),
  body('volume').optional().isInt({ min: 0 }).withMessage('Volume must be a positive integer'),
  body('trendQ').optional().isFloat().withMessage('TrendQ must be a number'),
  body('fq').optional().isFloat().withMessage('FQ must be a number'),
  body('bandDown').optional().isFloat().withMessage('Band down must be a number'),
  body('bandUp').optional().isFloat().withMessage('Band up must be a number'),
];

/**
 * Validation rules for bulk upsert of stock prices
 */
const bulkUpsertStockPricesValidation = [
  body().isArray().withMessage('Request body must be an array'),
  body('*.symbol').isString().notEmpty().withMessage('Symbol is required'),
  body('*.date').isISO8601().toDate().withMessage('Valid date is required'),
  body('*.open').isFloat({ min: 0 }).withMessage('Open price must be a positive number'),
  body('*.high').isFloat({ min: 0 }).withMessage('High price must be a positive number'),
  body('*.low').isFloat({ min: 0 }).withMessage('Low price must be a positive number'),
  body('*.close').isFloat({ min: 0 }).withMessage('Close price must be a positive number'),
  body('*.volume').optional().isInt({ min: 0 }).withMessage('Volume must be a positive integer'),
  body('*.trendQ').optional().isFloat().withMessage('TrendQ must be a number'),
  body('*.fq').optional().isFloat().withMessage('FQ must be a number'),
  body('*.bandDown').optional().isFloat().withMessage('Band down must be a number'),
  body('*.bandUp').optional().isFloat().withMessage('Band up must be a number'),
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
 * Get stock prices by symbol with pagination and date filtering
 * @route GET /api/v1/stock-prices/symbol/:symbol
 */
export const getStockPrices = [
  authenticate,
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
      
      const params = {
        symbol,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        sortDirection: sortDirection as 'asc' | 'desc' | undefined,
      };
      
      const result = await stockPriceService.getStockPrices(params);
      return successResponse(res, result, 'Stock prices retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get stock price by ID
 * @route GET /api/v1/stock-prices/:id
 */
export const getStockPriceById = [
  authenticate,
  validate([
    param('id').isUUID().withMessage('Stock price ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const stockPrice = await stockPriceService.getStockPriceById(id);
      return successResponse(res, stockPrice, 'Stock price retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Create a new stock price
 * @route POST /api/v1/stock-prices
 */
export const createStockPrice = [
  authenticate,
  checkRole(['ADMIN']),
  validate(createStockPriceValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stockPriceData = req.body;
      const stockPrice = await stockPriceService.createStockPrice(stockPriceData);
      return successResponse(res, stockPrice, 'Stock price created successfully', 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Update a stock price
 * @route PUT /api/v1/stock-prices/:id
 */
export const updateStockPrice = [
  authenticate,
  checkRole(['ADMIN']),
  validate(updateStockPriceValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const stockPriceData = req.body;
      
      // Ensure at least one field is provided
      if (Object.keys(stockPriceData).length === 0) {
        throw new BadRequestError('No update data provided');
      }
      
      const stockPrice = await stockPriceService.updateStockPrice(id, stockPriceData);
      return successResponse(res, stockPrice, 'Stock price updated successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Delete a stock price
 * @route DELETE /api/v1/stock-prices/:id
 */
export const deleteStockPrice = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('id').isUUID().withMessage('Stock price ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await stockPriceService.deleteStockPrice(id);
      return successResponse(res, null, 'Stock price deleted successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Bulk upsert stock prices
 * @route POST /api/v1/stock-prices/bulk
 */
export const bulkUpsertStockPrices = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    body().isArray().withMessage('Request body must be an array'),
    body('*.symbol').isString().notEmpty().withMessage('Symbol is required'),
    body('*.date').isISO8601().toDate().withMessage('Valid date is required'),
    body('*.open').isFloat({ min: 0 }).withMessage('Open price must be a positive number'),
    body('*.high').isFloat({ min: 0 }).withMessage('High price must be a positive number'),
    body('*.low').isFloat({ min: 0 }).withMessage('Low price must be a positive number'),
    body('*.close').isFloat({ min: 0 }).withMessage('Close price must be a positive number'),
    body('*.volume').optional().isInt({ min: 0 }).withMessage('Volume must be a positive integer'),
    body('*.trendQ').optional().isFloat().withMessage('TrendQ must be a number'),
    body('*.fq').optional().isFloat().withMessage('FQ must be a number'),
    body('*.bandDown').optional().isFloat().withMessage('Band down must be a number'),
    body('*.bandUp').optional().isFloat().withMessage('Band up must be a number'),
    query('mode').optional().isIn(['sync', 'async']).withMessage('Mode must be either sync or async'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stockPrices = req.body;
      const mode = (req.query.mode as string) || 'sync';
      
      // Check for large datasets (more than 10,000 records)
      const isLargeDataset = stockPrices.length > 10000;
      
      // For large datasets or async mode, create a background job
      if (isLargeDataset || mode === 'async') {
        const jobResult = await stockPriceService.createBulkUpsertJob(stockPrices);
        return successResponse(
          res, 
          jobResult, 
          `Job created to process ${jobResult.totalRecords} stock price records. Check status at /api/v1/stock-prices/jobs/${jobResult.jobId}`, 
          202 // Accepted
        );
      }
      
      // For smaller datasets in sync mode, process directly
      const count = await stockPriceService.bulkUpsertStockPrices(stockPrices);
      return successResponse(res, { count }, `${count} stock price records processed successfully`, 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get job status for bulk stock price operation
 * @route GET /api/v1/stock-prices/jobs/:jobId
 */
export const getJobStatus = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('jobId').isString().notEmpty().withMessage('Job ID is required'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobId;
      const jobStatus = stockPriceService.getStockPriceJobStatus(jobId);
      
      if (!jobStatus) {
        throw new NotFoundError(`Job with ID ${jobId} not found`);
      }
      
      return successResponse(res, jobStatus, `Job status retrieved successfully`);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Upload stock prices via CSV or XLSX file
 * @route POST /api/v1/stock-prices/upload
 */
export const uploadStockPricesCsv = [
  authenticate,
  checkRole(['ADMIN']),
  (req: Request, res: Response, next: NextFunction) => {
    handleFileUpload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        // Multer error (file size, etc.)
        return next(new BadRequestError(`File upload error: ${err.message}`));
      } else if (err) {
        // Other errors
        return next(new BadRequestError(`File upload error: ${err.message}`));
      }
      // No errors, continue to next middleware
      next();
    });
  },
  validate([
    body('symbol').optional().isString().withMessage('Symbol must be a string'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }
      
      // Symbol can be optionally provided in the request body
      const { symbol } = req.body;
      
      // Create a job ID
      const jobId = `sp-file-job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Get file path and original name
      const filePath = req.file.path;
      const fileOriginalName = req.file.originalname;
      const fileExtension = path.extname(fileOriginalName).toLowerCase();
      const fileType = fileExtension === '.csv' ? 'CSV' : 'Excel';
      
      // Đọc kích thước file để ước tính số bản ghi
      const stats = fs.statSync(filePath);
      // Ước tính trung bình mỗi bản ghi ~200 bytes (có thể điều chỉnh dựa trên dữ liệu thực tế)
      const estimatedRecords = Math.ceil(stats.size / 200); 
      
      // Register the job in the tracking system before processing
      stockPriceService.registerFileUploadJob(jobId, symbol || 'auto-detect', fileOriginalName, estimatedRecords);
      
      // Process the file in the background
      setTimeout(async () => {
        try {
          console.log(`Starting to process ${fileType} file for job ${jobId}`);
          
          // Update job status
          stockPriceService.updateFileUploadJobStatus(jobId, 'processing');

          // PHASE 1: Đọc file - 20% tiến trình
          stockPriceService.updateJobProgress(jobId, Math.round(estimatedRecords * 0.2));
          
          // Parse the file and get stock price data
          const stockPrices = await fileProcessorService.processStockPriceFile(
            filePath, 
            symbol,
            fileOriginalName
          );
          
          console.log(`Parsed ${stockPrices.length} records from ${fileType} file for job ${jobId}`);
          
          // PHASE 2: Phân tích file hoàn tất - 40% tiến trình
          // Cập nhật tổng số bản ghi thực tế
          stockPriceService.updateJobTotalRecords(jobId, stockPrices.length);
          stockPriceService.updateJobProgress(jobId, Math.round(stockPrices.length * 0.4));
          
          // PHASE 3: Xử lý dữ liệu theo batch
          const BATCH_SIZE = 1000;
          let processedCount = 0;
          
          // Process data in batches
          for (let i = 0; i < stockPrices.length; i += BATCH_SIZE) {
            const batch = stockPrices.slice(i, i + BATCH_SIZE);
            
            // Xử lý từng batch
            await stockPriceService.bulkUpsertStockPrices(batch);
            
            processedCount += batch.length;
            
            // Cập nhật tiến trình: 40% ban đầu + tỉ lệ hoàn thành của 60% còn lại
            const progressPercentage = 0.4 + (processedCount / stockPrices.length * 0.6);
            stockPriceService.updateJobProgress(jobId, Math.round(stockPrices.length * progressPercentage));
          }
          
          console.log(`Successfully processed ${processedCount} records for job ${jobId}`);
          
          // Update job status
          stockPriceService.updateFileUploadJobStatus(jobId, 'completed', stockPrices.length);
          
          // Clean up - delete the temporary file
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting temporary file ${filePath}:`, err);
            }
          });
        } catch (error) {
          console.error(`Error processing ${fileType} file for job ${jobId}:`, error);
          
          // Update job status with error
          stockPriceService.updateFileUploadJobStatus(
            jobId, 
            'failed', 
            0, 
            error instanceof Error ? error.message : 'Unknown error'
          );
          
          // Clean up even on error
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting temporary file ${filePath}:`, err);
            }
          });
        }
      }, 0);
      
      return successResponse(
        res, 
        { 
          jobId, 
          symbol: symbol || 'Auto-detected from file',
          fileName: fileOriginalName,
          fileType,
          status: 'queued',
          progress: 0
        }, 
        `${fileType} file upload accepted. Processing will be done in the background. You can check the progress with the job ID.`, 
        202 // Accepted
      );
    } catch (error) {
      // Clean up the uploaded file if there's an error
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error(`Error deleting temporary file ${req.file!.path}:`, err);
          }
        });
      }
      
      next(error);
    }
  },
];

/**
 * Get all stock prices with pagination, date filtering, and optional symbol filtering
 * @route GET /api/v1/stock-prices
 */
export const getAllStockPrices = [
  authenticate,
  validate([
    query('startDate').optional().isISO8601().toDate().withMessage('Start date must be a valid ISO date'),
    query('endDate').optional().isISO8601().toDate().withMessage('End date must be a valid ISO date'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be either asc or desc'),
    query('symbol').optional().isString().withMessage('Symbol must be a string'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, page, limit, sortDirection, symbol } = req.query;
      
      const params = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        sortDirection: sortDirection as 'asc' | 'desc' | undefined,
        symbol: symbol as string | undefined,
      };
      
      const result = await stockPriceService.getAllStockPrices(params);
      return successResponse(res, result, 'Stock prices retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];
