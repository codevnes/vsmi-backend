import { Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import * as csv from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import multer from 'multer';

import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { successResponse } from '../utils/response';
import { BadRequestError, NotFoundError } from '../utils/error';
import * as financialMetricsService from '../services/financialMetrics.service';

/**
 * Get all financial metrics with pagination and filtering
 * @route GET /api/v1/financial-metrics
 */
export const getFinancialMetrics = [
  authenticate,
  validate([
    query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be between 1 and 100'),
    query('symbol').optional().isString().withMessage('Symbol must be a string'),
    query('year').optional().isNumeric().toInt().withMessage('Year must be an integer'),
    query('quarter').optional().isNumeric().toInt().custom((value) => {
      if (value !== null && (value < 1 || value > 4)) {
        throw new Error('Quarter must be between 1 and 4');
      }
      return true;
    }).withMessage('Quarter must be between 1 and 4 or null'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        symbol, 
        year, 
        quarter 
      } = req.query;
      
      const result = await financialMetricsService.getFinancialMetrics(
        Number(page), 
        Number(limit), 
        symbol as string, 
        year ? Number(year) : undefined, 
        quarter ? Number(quarter) : undefined
      );
      
      return successResponse(res, result, 'Financial metrics retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get a financial metrics record by ID
 * @route GET /api/v1/financial-metrics/:id
 */
export const getFinancialMetricsById = [
  authenticate,
  validate([
    param('id').isUUID().withMessage('ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const metrics = await financialMetricsService.getFinancialMetricsById(id);
      
      return successResponse(res, metrics, 'Financial metrics retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get financial metrics for a specific stock
 * @route GET /api/v1/financial-metrics/stock/:symbol
 */
export const getFinancialMetricsBySymbol = [
  authenticate,
  validate([
    param('symbol').isString().notEmpty().withMessage('Stock symbol is required'),
    query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be between 1 and 100'),
    query('year').optional().isNumeric().toInt().withMessage('Year must be an integer'),
    query('quarter').optional().isNumeric().toInt().custom((value) => {
      if (value !== null && (value < 1 || value > 4)) {
        throw new Error('Quarter must be between 1 and 4');
      }
      return true;
    }).withMessage('Quarter must be between 1 and 4 or null'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { symbol } = req.params;
      const { 
        page = 1, 
        limit = 20, 
        year, 
        quarter 
      } = req.query;
      
      const result = await financialMetricsService.getFinancialMetricsBySymbol(
        symbol,
        Number(page),
        Number(limit),
        year ? Number(year) : undefined,
        quarter ? Number(quarter) : undefined
      );
      
      return successResponse(res, result, 'Financial metrics retrieved successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Create a new financial metrics record
 * @route POST /api/v1/financial-metrics
 */
export const createFinancialMetrics = [
  authenticate,
  authorize('ADMIN'),
  validate([
    body('symbol').isString().notEmpty().withMessage('Stock symbol is required'),
    body('year').isInt().withMessage('Year must be an integer'),
    body('quarter').optional({ nullable: true }).isInt({ min: 1, max: 4 }).withMessage('Quarter must be between 1 and 4 or null'),
    body('eps').optional({ nullable: true }).isFloat().withMessage('EPS must be a number or null'),
    body('epsIndustry').optional({ nullable: true }).isFloat().withMessage('EPSIndustry must be a number or null'),
    body('pe').optional({ nullable: true }).isFloat().withMessage('PE must be a number or null'),
    body('peIndustry').optional({ nullable: true }).isFloat().withMessage('PEIndustry must be a number or null'),
    body('roa').optional({ nullable: true }).isFloat().withMessage('ROA must be a number or null'),
    body('roe').optional({ nullable: true }).isFloat().withMessage('ROE must be a number or null'),
    body('roaIndustry').optional({ nullable: true }).isFloat().withMessage('ROAIndustry must be a number or null'),
    body('roeIndustry').optional({ nullable: true }).isFloat().withMessage('ROEIndustry must be a number or null'),
    body('revenue').optional({ nullable: true }).isFloat().withMessage('Revenue must be a number or null'),
    body('margin').optional({ nullable: true }).isFloat().withMessage('Margin must be a number or null'),
    body('totalDebtToEquity').optional({ nullable: true }).isFloat().withMessage('TotalDebtToEquity must be a number or null'),
    body('totalAssetsToEquity').optional({ nullable: true }).isFloat().withMessage('TotalAssetsToEquity must be a number or null'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const metrics = await financialMetricsService.createFinancialMetrics(req.body);
      
      return successResponse(res, metrics, 'Financial metrics created successfully', 201);
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Update an existing financial metrics record
 * @route PUT /api/v1/financial-metrics/:id
 */
export const updateFinancialMetrics = [
  authenticate,
  authorize('ADMIN'),
  validate([
    param('id').isUUID().withMessage('ID must be a valid UUID'),
    body('eps').optional({ nullable: true }).isFloat().withMessage('EPS must be a number or null'),
    body('epsIndustry').optional({ nullable: true }).isFloat().withMessage('EPSIndustry must be a number or null'),
    body('pe').optional({ nullable: true }).isFloat().withMessage('PE must be a number or null'),
    body('peIndustry').optional({ nullable: true }).isFloat().withMessage('PEIndustry must be a number or null'),
    body('roa').optional({ nullable: true }).isFloat().withMessage('ROA must be a number or null'),
    body('roe').optional({ nullable: true }).isFloat().withMessage('ROE must be a number or null'),
    body('roaIndustry').optional({ nullable: true }).isFloat().withMessage('ROAIndustry must be a number or null'),
    body('roeIndustry').optional({ nullable: true }).isFloat().withMessage('ROEIndustry must be a number or null'),
    body('revenue').optional({ nullable: true }).isFloat().withMessage('Revenue must be a number or null'),
    body('margin').optional({ nullable: true }).isFloat().withMessage('Margin must be a number or null'),
    body('totalDebtToEquity').optional({ nullable: true }).isFloat().withMessage('TotalDebtToEquity must be a number or null'),
    body('totalAssetsToEquity').optional({ nullable: true }).isFloat().withMessage('TotalAssetsToEquity must be a number or null'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const metrics = await financialMetricsService.updateFinancialMetrics(id, req.body);
      
      return successResponse(res, metrics, 'Financial metrics updated successfully');
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Delete a financial metrics record
 * @route DELETE /api/v1/financial-metrics/:id
 */
export const deleteFinancialMetrics = [
  authenticate,
  authorize('ADMIN'),
  validate([
    param('id').isUUID().withMessage('ID must be a valid UUID'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await financialMetricsService.deleteFinancialMetrics(id);
      
      return successResponse(res, { id }, 'Financial metrics deleted successfully');
    } catch (error) {
      next(error);
    }
  },
];

// Set up file upload configuration for importing
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'financial-metrics-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only CSV and Excel files
  if (
    file.mimetype === 'text/csv' || 
    file.mimetype === 'application/vnd.ms-excel' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Only CSV and Excel files are allowed'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper function to process CSV file
const processFinancialMetricsCsvFile = (filePath: string): Array<any> => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Kiểm tra xem file sử dụng dấu phân cách nào (phẩy hay chấm phẩy)
  // Lấy dòng đầu tiên (header) và kiểm tra
  const firstLineEnd = fileContent.indexOf('\n');
  const headerLine = fileContent.substring(0, firstLineEnd > 0 ? firstLineEnd : fileContent.length);
  
  // Kiểm tra số lượng dấu phẩy và dấu chấm phẩy trong header để xác định delimiter
  const commaCount = (headerLine.match(/,/g) || []).length;
  const semicolonCount = (headerLine.match(/;/g) || []).length;
  
  // Chọn delimiter phù hợp dựa trên số lượng xuất hiện
  const delimiter = semicolonCount > commaCount ? ';' : ',';
  
  console.log(`Detected CSV delimiter: "${delimiter}" (commas: ${commaCount}, semicolons: ${semicolonCount})`);
  
  const records = csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    delimiter: delimiter,
    relax_quotes: true, // Cho phép xử lý linh hoạt các dấu ngoặc kép
    relax_column_count: true // Cho phép số lượng cột không đều nhau
  });
  
  return records.map((record: any) => {
    // Hàm để chuyển đổi chuỗi số từ dấu , sang dấu . trước khi parse
    const parseNumberField = (value: string) => {
      if (!value) return null;
      // Chuyển đổi dấu phẩy thành dấu chấm và parse sang số
      const normalizedValue = value.replace(',', '.');
      return parseFloat(normalizedValue);
    };
    
    return {
      symbol: record.symbol,
      year: parseInt(record.year, 10),
      quarter: record.quarter ? parseInt(record.quarter, 10) : null,
      eps: parseNumberField(record.eps),
      epsIndustry: parseNumberField(record.epsIndustry),
      pe: parseNumberField(record.pe),
      peIndustry: parseNumberField(record.peIndustry),
      roa: parseNumberField(record.roa),
      roe: parseNumberField(record.roe),
      roaIndustry: parseNumberField(record.roaIndustry),
      roeIndustry: parseNumberField(record.roeIndustry),
      // Hỗ trợ cả định dạng tên trường có dấu gạch dưới và camelCase
      totalDebtToEquity: parseNumberField(record.totalDebtToEquity || record.total_debt_to_equity),
      totalAssetsToEquity: parseNumberField(record.totalAssetsToEquity || record.total_assets_to_equity),
      revenue: parseNumberField(record.revenue),
      margin: parseNumberField(record.margin)
    };
  });
};

// Helper function to process Excel file
const processFinancialMetricsExcelFile = (filePath: string): Array<any> => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const records = XLSX.utils.sheet_to_json(worksheet);
  
  return records.map((record: any) => {
    // Hàm để chuyển đổi chuỗi số từ dấu , sang dấu . trước khi parse
    const parseNumberField = (value: any) => {
      if (value === undefined || value === null) return null;
      
      // Nếu là chuỗi, chuyển đổi dấu phẩy thành dấu chấm
      if (typeof value === 'string') {
        const normalizedValue = value.replace(',', '.');
        return parseFloat(normalizedValue);
      }
      
      // Nếu đã là số thì trả về luôn
      return typeof value === 'number' ? value : null;
    };
    
    return {
      symbol: record.symbol,
      year: parseInt(record.year, 10),
      quarter: record.quarter ? parseInt(record.quarter, 10) : null,
      eps: parseNumberField(record.eps),
      epsIndustry: parseNumberField(record.epsIndustry),
      pe: parseNumberField(record.pe),
      peIndustry: parseNumberField(record.peIndustry),
      roa: parseNumberField(record.roa),
      roe: parseNumberField(record.roe),
      roaIndustry: parseNumberField(record.roaIndustry),
      roeIndustry: parseNumberField(record.roeIndustry),
      revenue: parseNumberField(record.revenue),
      margin: parseNumberField(record.margin),
      totalDebtToEquity: parseNumberField(record.totalDebtToEquity),
      totalAssetsToEquity: parseNumberField(record.totalAssetsToEquity),
    };
  });
};

/**
 * Bulk import financial metrics from CSV or Excel file
 * @route POST /api/v1/financial-metrics/import
 */
export const importFinancialMetrics = [
  authenticate,
  authorize('ADMIN'),
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }
      
      const filePath = req.file.path;
      let records: Array<any> = [];
      
      // Process based on file type
      if (req.file.mimetype === 'text/csv') {
        records = processFinancialMetricsCsvFile(filePath);
      } else {
        records = processFinancialMetricsExcelFile(filePath);
      }
      
      // Remove file after processing
      fs.unlinkSync(filePath);
      
      if (records.length === 0) {
        throw new BadRequestError('No valid records found in file');
      }
      
      const mode = (req.query.mode as string) || 'sync';
      const isLargeDataset = records.length > 1000;
      
      // For large datasets or async mode, create a background job
      if (isLargeDataset || mode === 'async') {
        const jobResult = await financialMetricsService.createFinancialMetricsImportJob(records);
        return successResponse(
          res, 
          jobResult, 
          `Job created to process ${jobResult.totalRecords} financial metrics records. Check status at /api/v1/financial-metrics/jobs/${jobResult.jobId}`, 
          202 // Accepted
        );
      }
      
      // For smaller datasets in sync mode, process directly
      const result = await financialMetricsService.bulkImportFinancialMetrics(records);
      
      return successResponse(
        res, 
        result, 
        `Import completed: ${result.created} created, ${result.skipped} skipped, ${result.errors.length} errors`
      );
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Get job status for financial metrics import
 * @route GET /api/v1/financial-metrics/jobs/:jobId
 */
export const getFinancialMetricsJobStatus = [
  authenticate,
  authorize('ADMIN'),
  validate([
    param('jobId').isString().notEmpty().withMessage('Job ID is required'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobId;
      const jobStatus = financialMetricsService.getFinancialMetricsJobStatus(jobId);
      
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
 * Get financial metrics reports by year or quarter for a specific stock
 * @route GET /api/v1/financial-metrics/stock/:symbol/reports
 */
export const getFinancialMetricsReports = [
  validate([
    param('symbol').isString().notEmpty().withMessage('Stock symbol is required'),
    query('type').isString().isIn(['year', 'quarter']).withMessage('Type must be either "year" or "quarter"'),
    query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be between 1 and 100'),
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { symbol } = req.params;
      const { 
        type,
        page = 1, 
        limit = 20
      } = req.query;
      
      const result = await financialMetricsService.getFinancialMetricsReports(
        symbol,
        type as string,
        Number(page),
        Number(limit)
      );
      
      return successResponse(
        res, 
        result, 
        `Financial metrics ${type === 'year' ? 'yearly' : 'quarterly'} reports retrieved successfully`
      );
    } catch (error) {
      next(error);
    }
  },
];

/**
 * Delete all financial metrics data
 * @route DELETE /api/v1/financial-metrics/delete-all
 */
export const deleteAllFinancialMetrics = [
  authenticate,
  authorize('ADMIN'),
  validate([
    // Yêu cầu tham số xác nhận để tránh xóa nhầm
    body('confirm')
      .isString()
      .equals('DELETE_ALL_FINANCIAL_METRICS')
      .withMessage('Confirmation string "DELETE_ALL_FINANCIAL_METRICS" is required')
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await financialMetricsService.deleteAllFinancialMetrics();
      
      return successResponse(
        res, 
        result, 
        'All financial metrics data has been deleted'
      );
    } catch (error) {
      next(error);
    }
  },
]; 