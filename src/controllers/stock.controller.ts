import { Request, Response, NextFunction } from 'express';
import * as stockService from '../services';
import { successResponse } from '../utils/response';
import { BadRequestError, NotFoundError } from '../utils/error';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csv from 'csv-parse/sync';
import * as XLSX from 'xlsx';

/**
 * Validation rules for creating a stock
 */
const createStockValidation = [
  body('symbol').isString().notEmpty().withMessage('Symbol is required'),
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('exchange').optional().isString().withMessage('Exchange must be a string'),
  body('industry').optional().isString().withMessage('Industry must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
];

/**
 * Validation rules for updating a stock
 */
const updateStockValidation = [
  param('id').isUUID().withMessage('Stock ID must be a valid UUID'),
  body('name').optional().isString().withMessage('Name must be a string'),
  body('exchange').optional().isString().withMessage('Exchange must be a string'),
  body('industry').optional().isString().withMessage('Industry must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
];

/**
 * Get all stocks with pagination
 * @route GET /api/v1/stocks
 */
export const getStocks = [
  validate([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString(),
    query('industry').optional().isString(),
    query('exchange').optional().isString(),
    query('sortBy').optional().isIn(['symbol', 'name', 'createdAt']).withMessage('Sort by must be one of: symbol, name, createdAt'),
    query('sortDirection').optional().isIn(['asc', 'desc']).withMessage('Sort direction must be either asc or desc'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { 
        page, 
        limit, 
        search, 
        industry, 
        exchange, 
        sortBy, 
        sortDirection 
      } = req.query;
      
      const params = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        industry: industry as string,
        exchange: exchange as string,
        sortBy: sortBy as 'symbol' | 'name' | 'createdAt',
        sortDirection: sortDirection as 'asc' | 'desc',
      };
      
      const result = await stockService.listStocks(params);
      return successResponse(res, result, 'Stocks retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get stock by ID
 * @route GET /api/v1/stocks/:id
 */
export const getStockById = [
  authenticate,
  validate([
    param('id').isUUID().withMessage('Stock ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const stock = await stockService.getStockById(id);
      return successResponse(res, stock, 'Stock retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get stock by symbol
 * @route GET /api/v1/stocks/symbol/:symbol
 */
export const getStockBySymbol = [
  validate([
    param('symbol').isString().withMessage('Symbol must be a string'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const symbol = req.params.symbol;
      const stock = await stockService.getStockBySymbol(symbol);
      return successResponse(res, stock, 'Stock retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Create a new stock
 * @route POST /api/v1/stocks
 */
export const createStock = [
  authenticate,
  checkRole(['ADMIN']),
  validate(createStockValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stockData = req.body;
      const stock = await stockService.createStock(stockData);
      return successResponse(res, stock, 'Stock created successfully', 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Update a stock
 * @route PUT /api/v1/stocks/:id
 */
export const updateStock = [
  authenticate,
  checkRole(['ADMIN']),
  validate(updateStockValidation),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const stockData = req.body;
      
      // Ensure at least one field is provided
      if (Object.keys(stockData).length === 0) {
        throw new BadRequestError('No update data provided');
      }
      
      const stock = await stockService.updateStock(id, stockData);
      return successResponse(res, stock, 'Stock updated successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Update a stock by symbol
 * @route PUT /api/v1/stocks/symbol/:symbol
 */
export const updateStockBySymbol = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('symbol').isString().withMessage('Symbol must be a string'),
    body('name').optional().isString().withMessage('Name must be a string'),
    body('exchange').optional().isString().withMessage('Exchange must be a string'),
    body('industry').optional().isString().withMessage('Industry must be a string'),
    body('description').optional().isString().withMessage('Description must be a string'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const symbol = req.params.symbol;
      const stockData = req.body;
      
      // Ensure at least one field is provided
      if (Object.keys(stockData).length === 0) {
        throw new BadRequestError('No update data provided');
      }
      
      const stock = await stockService.updateStockBySymbol(symbol, stockData);
      return successResponse(res, stock, 'Stock updated successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Delete a stock
 * @route DELETE /api/v1/stocks/:id
 */
export const deleteStock = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('id').isUUID().withMessage('Stock ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await stockService.deleteStock(id);
      return successResponse(res, null, 'Stock deleted successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Delete a stock by symbol
 * @route DELETE /api/v1/stocks/symbol/:symbol
 */
export const deleteStockBySymbol = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    param('symbol').isString().withMessage('Symbol must be a string'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const symbol = req.params.symbol;
      await stockService.deleteStockBySymbol(symbol);
      return successResponse(res, null, 'Stock deleted successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get unique exchanges
 * @route GET /api/v1/stocks/exchanges
 */
export const getExchanges = [
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exchanges = await stockService.getUniqueExchanges();
      return successResponse(res, exchanges, 'Exchanges retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get unique industries
 * @route GET /api/v1/stocks/industries
 */
export const getIndustries = [
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const industries = await stockService.getUniqueIndustries();
      return successResponse(res, industries, 'Industries retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Bulk import stocks
 * @route POST /api/v1/stocks/import
 */
export const importStocks = [
  authenticate,
  checkRole(['ADMIN']),
  validate([
    body().isArray().withMessage('Request body must be an array'),
    body('*.symbol').isString().notEmpty().withMessage('Symbol is required for each stock'),
    body('*.name').isString().notEmpty().withMessage('Name is required for each stock'),
    body('*.exchange').optional().isString().withMessage('Exchange must be a string'),
    body('*.industry').optional().isString().withMessage('Industry must be a string'),
    body('*.description').optional().isString().withMessage('Description must be a string'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stocks = req.body;
      
      if (stocks.length === 0) {
        throw new BadRequestError('No stocks provided for import');
      }
      
      // Process in batches of 100 stocks
      const batchSize = 100;
      const results = {
        created: 0,
        updated: 0,
        failed: 0,
        total: stocks.length,
        errors: [] as { symbol: string; error: string }[]
      };

      // Process stocks in batches
      for (let i = 0; i < stocks.length; i += batchSize) {
        const batch = stocks.slice(i, i + batchSize);
        
        // Process each stock in the batch
        const batchPromises = batch.map(async (stockData: any) => {
          try {
            // Check if stock exists
            const existingStock = await stockService.getStockBySymbolSafe(stockData.symbol);
            
            if (existingStock) {
              // Update existing stock
              await stockService.updateStockBySymbol(stockData.symbol, stockData);
              return { status: 'updated', symbol: stockData.symbol };
            } else {
              // Create new stock
              await stockService.createStock(stockData);
              return { status: 'created', symbol: stockData.symbol };
            }
          } catch (error: any) {
            // Handle errors for this specific stock
            return { 
              status: 'failed', 
              symbol: stockData.symbol, 
              error: error.message || 'Unknown error' 
            };
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        
        // Aggregate results
        batchResults.forEach(result => {
          if (result.status === 'created') {
            results.created++;
          } else if (result.status === 'updated') {
            results.updated++;
          } else if (result.status === 'failed') {
            results.failed++;
            results.errors.push({ 
              symbol: result.symbol, 
              error: result.error 
            });
          }
        });
      }

      return successResponse(
        res, 
        results, 
        `Import completed: ${results.created} created, ${results.updated} updated, ${results.failed} failed`, 
        200
      );
    } catch (error) {
      next(error);
    }
  },
];

// Configure multer for file uploads
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
 * Process CSV file for stock import
 */
const processStockCsvFile = (filePath: string): Array<any> => {
  // Read file content
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
  
  // Parse CSV
  const records = csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  
  return records;
};

/**
 * Process Excel file for stock import
 */
const processStockExcelFile = (filePath: string): Array<any> => {
  // Read the Excel file
  const workbook = XLSX.readFile(filePath);
  
  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON
  return XLSX.utils.sheet_to_json(worksheet);
};

/**
 * Import stocks from file (CSV or Excel)
 * @route POST /api/v1/stocks/import-file
 */
export const importStocksFromFile = [
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }
      
      // Get file path and original name
      const filePath = req.file.path;
      const fileOriginalName = req.file.originalname;
      const fileExtension = path.extname(fileOriginalName).toLowerCase();
      
      let stocks: any[] = [];
      
      // Process the file based on its extension
      if (fileExtension === '.csv') {
        stocks = processStockCsvFile(filePath);
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        stocks = processStockExcelFile(filePath);
      } else {
        // Clean up the uploaded file
        fs.unlinkSync(filePath);
        throw new BadRequestError('Unsupported file format. Only CSV, XLSX, and XLS files are supported.');
      }
      
      // Create a job ID
      const jobId = `stock-import-job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Validate the stock data
      const validStocks = stocks.filter(stock => {
        return stock.symbol && stock.name; // Basic validation
      });
      
      if (validStocks.length === 0) {
        // Clean up the uploaded file
        fs.unlinkSync(filePath);
        throw new BadRequestError('No valid stock data found in the file. Each stock must have at least a symbol and name.');
      }
      
      // Process the import in the background
      setTimeout(async () => {
        try {
          console.log(`Starting to process ${validStocks.length} stocks from file for job ${jobId}`);
          
          // Process in batches of 100 stocks
          const batchSize = 100;
          const results = {
            created: 0,
            updated: 0,
            failed: 0,
            total: validStocks.length,
            errors: [] as { symbol: string; error: string }[]
          };

          // Process stocks in batches
          for (let i = 0; i < validStocks.length; i += batchSize) {
            const batch = validStocks.slice(i, i + batchSize);
            
            // Process each stock in the batch
            const batchPromises = batch.map(async (stockData: any) => {
              try {
                // Check if stock exists
                const existingStock = await stockService.getStockBySymbolSafe(stockData.symbol);
                
                if (existingStock) {
                  // Update existing stock
                  await stockService.updateStockBySymbol(stockData.symbol, stockData);
                  return { status: 'updated', symbol: stockData.symbol };
                } else {
                  // Create new stock
                  await stockService.createStock(stockData);
                  return { status: 'created', symbol: stockData.symbol };
                }
              } catch (error: any) {
                // Handle errors for this specific stock
                return { 
                  status: 'failed', 
                  symbol: stockData.symbol, 
                  error: error.message || 'Unknown error' 
                };
              }
            });
            
            const batchResults = await Promise.all(batchPromises);
            
            // Aggregate results
            batchResults.forEach(result => {
              if (result.status === 'created') {
                results.created++;
              } else if (result.status === 'updated') {
                results.updated++;
              } else if (result.status === 'failed') {
                results.failed++;
                results.errors.push({ 
                  symbol: result.symbol, 
                  error: result.error 
                });
              }
            });
          }
          
          console.log(`Import job ${jobId} completed: ${results.created} created, ${results.updated} updated, ${results.failed} failed`);
          
          // Clean up the uploaded file
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error(`Error processing file for job ${jobId}:`, error);
          
          // Clean up the uploaded file
          fs.unlinkSync(filePath);
        }
      }, 0);
      
      return successResponse(
        res, 
        { 
          jobId,
          fileName: fileOriginalName,
          fileType: fileExtension === '.csv' ? 'CSV' : 'Excel',
          totalRecords: validStocks.length
        }, 
        `File upload accepted. Processing ${validStocks.length} stock records in the background.`, 
        202 // Accepted
      );
    } catch (error) {
      // Clean up the uploaded file if there's an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      next(error);
    }
  },
];
