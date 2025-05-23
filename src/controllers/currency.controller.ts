import { Request, Response } from 'express';
import * as currencyService from '../services/currency.service';
import { 
  CreateCurrencyDto, 
  UpdateCurrencyDto, 
  CreateCurrencyPriceDto, 
  UpdateCurrencyPriceDto 
} from '../types';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter to validate file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.csv', '.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV, XLSX, and XLS files are allowed'));
  }
};

// Create multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Currency Controllers
export const getCurrencies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, limit, offset } = req.query;
    
    const { currencies, total } = await currencyService.getCurrencies(
      search as string,
      limit ? parseInt(limit as string, 20) : undefined,
      offset ? parseInt(offset as string, 10) : undefined
    );
    
    res.status(200).json({
      success: true,
      data: currencies,
      total,
      message: 'Currencies retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving currencies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve currencies',
      error: (error as Error).message,
    });
  }
};

export const getCurrencyByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const currency = await currencyService.getCurrencyByCode(code);
    
    if (!currency) {
      res.status(404).json({
        success: false,
        message: `Currency with code ${code} not found`,
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: currency,
      message: 'Currency retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving currency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve currency',
      error: (error as Error).message,
    });
  }
};

export const createCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const currencyData: CreateCurrencyDto = req.body;
    
    // Check if currency already exists
    const existingCurrency = await currencyService.getCurrencyByCode(currencyData.code);
    if (existingCurrency) {
      res.status(409).json({
        success: false,
        message: `Currency with code ${currencyData.code} already exists`,
      });
      return;
    }
    
    const newCurrency = await currencyService.createCurrency(currencyData);
    
    res.status(201).json({
      success: true,
      data: newCurrency,
      message: 'Currency created successfully',
    });
  } catch (error) {
    console.error('Error creating currency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create currency',
      error: (error as Error).message,
    });
  }
};

export const updateCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const currencyData = req.body;
    
    // Check if currency exists
    const existingCurrency = await currencyService.getCurrencyByCode(code);
    if (!existingCurrency) {
      res.status(404).json({
        success: false,
        message: `Currency with code ${code} not found`,
      });
      return;
    }
    
    // Bổ sung code vào dữ liệu để phù hợp với CurrencyDto
    const currencyDto = {
      ...currencyData,
      code
    };
    
    const updatedCurrency = await currencyService.updateCurrency(code, currencyDto);
    
    res.status(200).json({
      success: true,
      data: updatedCurrency,
      message: 'Currency updated successfully',
    });
  } catch (error) {
    console.error('Error updating currency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update currency',
      error: (error as Error).message,
    });
  }
};

export const deleteCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    
    // Check if currency exists
    const existingCurrency = await currencyService.getCurrencyByCode(code);
    if (!existingCurrency) {
      res.status(404).json({
        success: false,
        message: `Currency with code ${code} not found`,
      });
      return;
    }
    
    await currencyService.deleteCurrency(code);
    
    res.status(200).json({
      success: true,
      message: 'Currency deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting currency:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete currency',
      error: (error as Error).message,
    });
  }
};

// Currency Price Controllers
export const getCurrencyPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currencyCode, startDate, endDate, limit, offset } = req.query;
    
    const queryParams = {
      currencyCode: currencyCode as string,
      startDate: startDate as string,
      endDate: endDate as string,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    };
    
    const { currencyPrices, total } = await currencyService.getCurrencyPrices(queryParams);
    
    res.status(200).json({
      success: true,
      data: currencyPrices,
      total,
      message: 'Currency prices retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving currency prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve currency prices',
      error: (error as Error).message,
    });
  }
};

export const getCurrencyPriceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currencyPrice = await currencyService.getCurrencyPriceById(id);
    
    if (!currencyPrice) {
      res.status(404).json({
        success: false,
        message: `Currency price with ID ${id} not found`,
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: currencyPrice,
      message: 'Currency price retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving currency price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve currency price',
      error: (error as Error).message,
    });
  }
};

export const createCurrencyPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const priceData: CreateCurrencyPriceDto = req.body;
    
    // Validate if currency exists
    const currency = await currencyService.getCurrencyByCode(priceData.currencyCode);
    if (!currency) {
      res.status(404).json({
        success: false,
        message: `Currency with code ${priceData.currencyCode} not found`,
      });
      return;
    }
    
    const newPrice = await currencyService.createCurrencyPrice(priceData);
    
    res.status(201).json({
      success: true,
      data: newPrice,
      message: 'Currency price created successfully',
    });
  } catch (error) {
    console.error('Error creating currency price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create currency price',
      error: (error as Error).message,
    });
  }
};

export const createManyCurrencyPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const pricesData: CreateCurrencyPriceDto[] = req.body;
    
    if (!Array.isArray(pricesData) || pricesData.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected an array of currency prices',
      });
      return;
    }
    
    // Validate if all currencies exist
    const uniqueCurrencyCodes = [...new Set(pricesData.map(price => price.currencyCode))];
    for (const code of uniqueCurrencyCodes) {
      const currency = await currencyService.getCurrencyByCode(code);
      if (!currency) {
        res.status(404).json({
          success: false,
          message: `Currency with code ${code} not found`,
        });
        return;
      }
    }
    
    const result = await currencyService.createManyCurrencyPrices(pricesData);
    
    res.status(201).json({
      success: true,
      data: { count: result.count },
      message: `${result.count} currency prices created successfully`,
    });
  } catch (error) {
    console.error('Error creating currency prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create currency prices',
      error: (error as Error).message,
    });
  }
};

export const updateCurrencyPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const priceData = req.body;
    
    // Check if currency price exists
    const existingPrice = await currencyService.getCurrencyPriceById(id);
    if (!existingPrice) {
      res.status(404).json({
        success: false,
        message: `Currency price with ID ${id} not found`,
      });
      return;
    }
    
    // Bổ sung id, currencyCode và date để phù hợp với CurrencyPriceDto
    const priceDtoData = {
      ...priceData,
      id,
      currencyCode: existingPrice.currencyCode,
      date: existingPrice.date
    };
    
    const updatedPrice = await currencyService.updateCurrencyPrice(id, priceDtoData);
    
    res.status(200).json({
      success: true,
      data: updatedPrice,
      message: 'Currency price updated successfully',
    });
  } catch (error) {
    console.error('Error updating currency price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update currency price',
      error: (error as Error).message,
    });
  }
};

export const deleteCurrencyPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if currency price exists
    const existingPrice = await currencyService.getCurrencyPriceById(id);
    if (!existingPrice) {
      res.status(404).json({
        success: false,
        message: `Currency price with ID ${id} not found`,
      });
      return;
    }
    
    await currencyService.deleteCurrencyPrice(id);
    
    res.status(200).json({
      success: true,
      message: 'Currency price deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting currency price:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete currency price',
      error: (error as Error).message,
    });
  }
};

export const getLatestCurrencyPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit } = req.query;
    const limitValue = limit ? parseInt(limit as string, 10) : undefined;
    
    const latestPrices = await currencyService.getLatestCurrencyPrices(limitValue);
    
    res.status(200).json({
      success: true,
      data: latestPrices,
      total: latestPrices.length,
      message: 'Latest currency prices retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving latest currency prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve latest currency prices',
      error: (error as Error).message,
    });
  }
};

export const getCurrencyPricesByDateRange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currencyCode } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
      });
      return;
    }
    
    // Check if currency exists
    const currency = await currencyService.getCurrencyByCode(currencyCode);
    if (!currency) {
      res.status(404).json({
        success: false,
        message: `Currency with code ${currencyCode} not found`,
      });
      return;
    }
    
    const prices = await currencyService.getCurrencyPricesByDateRange(
      currencyCode,
      new Date(startDate as string),
      new Date(endDate as string)
    );
    
    res.status(200).json({
      success: true,
      data: prices,
      total: prices.length,
      message: 'Currency prices by date range retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving currency prices by date range:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve currency prices by date range',
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Import currencies from a file
 * @access Private (ADMIN only)
 */
export const importCurrenciesFromFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    const { path: filePath, originalname } = req.file;

    try {
      // Process file based on its extension
      const currencies = await currencyService.processCurrencyFile(filePath, originalname);
      
      if (currencies.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No valid currency data found in the file',
        });
        return;
      }
      
      // Import currencies to database
      const result = await currencyService.importCurrencies(currencies);
      
      // Clean up temporary file
      fs.unlinkSync(filePath);
      
      res.status(200).json({
        success: true,
        message: `Successfully imported ${result.count} currencies`,
        data: { 
          processed: currencies.length, 
          imported: result.count 
        },
      });
    } catch (error) {
      // Clean up temporary file if exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error importing currencies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import currencies',
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Import currency prices from a file
 * @access Private (ADMIN only)
 */
export const importCurrencyPricesFromFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    const { path: filePath, originalname } = req.file;
    const { currencyCode } = req.body;

    try {
      // If currencyCode is provided, check if it exists
      if (currencyCode) {
        const currency = await currencyService.getCurrencyByCode(currencyCode);
        if (!currency) {
          res.status(404).json({
            success: false,
            message: `Currency with code ${currencyCode} not found`,
          });
          return;
        }
      }
      
      // Process file based on its extension
      const currencyPrices = await currencyService.processCurrencyPriceFile(
        filePath, 
        currencyCode,
        originalname
      );
      
      if (currencyPrices.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No valid currency price data found in the file',
        });
        return;
      }
      
      // Import currency prices to database
      const result = await currencyService.importCurrencyPrices(currencyPrices);
      
      // Clean up temporary file
      fs.unlinkSync(filePath);
      
      res.status(200).json({
        success: true,
        message: `Successfully imported ${result.count} currency prices`,
        data: { 
          processed: currencyPrices.length, 
          imported: result.count 
        },
      });
    } catch (error) {
      // Clean up temporary file if exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error importing currency prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import currency prices',
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Import currencies from JSON data
 * @access Private (ADMIN only)
 */
export const importCurrenciesFromJson = async (req: Request, res: Response): Promise<void> => {
  try {
    const currencyData = req.body.currencies as CreateCurrencyDto[];
    
    if (!Array.isArray(currencyData) || currencyData.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid or empty currency data',
      });
      return;
    }
    
    // Validate currency data
    const validData: CreateCurrencyDto[] = [];
    const errors: Array<{ index: number, error: string }> = [];
    
    for (let i = 0; i < currencyData.length; i++) {
      const item = currencyData[i];
      if (!item.code || !item.name) {
        errors.push({ index: i, error: 'Missing required fields (code or name)' });
        continue;
      }
      
      validData.push({
        code: item.code,
        name: item.name,
      });
    }
    
    if (validData.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No valid currency data found',
        errors,
      });
      return;
    }
    
    // Import currencies to database
    const result = await currencyService.importCurrencies(validData);
    
    res.status(200).json({
      success: true,
      message: `Successfully imported ${result.count} currencies`,
      data: { 
        processed: validData.length, 
        imported: result.count,
        errors: errors.length > 0 ? errors : undefined
      },
    });
  } catch (error) {
    console.error('Error importing currencies from JSON:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import currencies from JSON',
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Import currency prices from JSON data
 * @access Private (ADMIN only)
 */
export const importCurrencyPricesFromJson = async (req: Request, res: Response): Promise<void> => {
  try {
    const priceData = req.body.prices as CreateCurrencyPriceDto[];
    
    if (!Array.isArray(priceData) || priceData.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid or empty currency price data',
      });
      return;
    }
    
    // Validate currency price data
    const validData: CreateCurrencyPriceDto[] = [];
    const errors: Array<{ index: number, error: string }> = [];
    
    for (let i = 0; i < priceData.length; i++) {
      const item = priceData[i];
      
      // Check required fields
      if (!item.currencyCode || !item.date || 
          item.open === undefined || item.high === undefined || 
          item.low === undefined || item.close === undefined) {
        errors.push({ index: i, error: 'Missing required fields' });
        continue;
      }
      
      // Verify that currency exists
      const currencyExists = await currencyService.getCurrencyByCode(item.currencyCode);
      if (!currencyExists) {
        errors.push({ index: i, error: `Currency with code "${item.currencyCode}" not found` });
        continue;
      }
      
      // Parse date if it's a string
      let date: Date;
      if (typeof item.date === 'string') {
        date = new Date(item.date);
        if (isNaN(date.getTime())) {
          errors.push({ index: i, error: 'Invalid date format' });
          continue;
        }
      } else {
        date = item.date;
      }
      
      validData.push({
        currencyCode: item.currencyCode,
        date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      });
    }
    
    if (validData.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No valid currency price data found',
        errors,
      });
      return;
    }
    
    // Import currency prices to database
    const result = await currencyService.importCurrencyPrices(validData);
    
    res.status(200).json({
      success: true,
      message: `Successfully imported ${result.count} currency prices`,
      data: { 
        processed: validData.length, 
        imported: result.count,
        errors: errors.length > 0 ? errors : undefined
      },
    });
  } catch (error) {
    console.error('Error importing currency prices from JSON:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import currency prices from JSON',
      error: (error as Error).message,
    });
  }
};

/**
 * Get all prices for a specific currency code without limit
 */
export const getAllCurrencyPricesByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currencyCode } = req.params;
    
    // Check if currency exists
    const currency = await currencyService.getCurrencyByCode(currencyCode);
    if (!currency) {
      res.status(404).json({
        success: false,
        message: `Currency with code ${currencyCode} not found`,
      });
      return;
    }
    
    const { currencyPrices, total } = await currencyService.getAllCurrencyPricesByCode(currencyCode);
    
    res.status(200).json({
      success: true,
      data: currencyPrices,
      total,
      message: 'All currency prices retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving all currency prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve currency prices',
      error: (error as Error).message,
    });
  }
};

/**
 * Get all prices for a specific currency code without limit using query parameter
 * This handles currency codes with slashes like "AUD/USD"
 */
export const getAllCurrencyPricesByCodeQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    
    if (!code) {
      res.status(400).json({
        success: false,
        message: 'Currency code is required as a query parameter',
      });
      return;
    }
    
    const currencyCode = code as string;
    
    // Check if currency exists
    const currency = await currencyService.getCurrencyByCode(currencyCode);
    if (!currency) {
      res.status(404).json({
        success: false,
        message: `Currency with code ${currencyCode} not found`,
      });
      return;
    }
    
    const { currencyPrices, total } = await currencyService.getAllCurrencyPricesByCode(currencyCode);
    
    res.status(200).json({
      success: true,
      data: currencyPrices,
      total,
      message: 'All currency prices retrieved successfully',
    });
  } catch (error) {
    console.error('Error retrieving all currency prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve currency prices',
      error: (error as Error).message,
    });
  }
};
