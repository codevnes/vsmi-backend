import { PrismaClient, Currency, CurrencyPrice, Prisma } from '@prisma/client';
import { 
  CreateCurrencyDto, 
  UpdateCurrencyDto, 
  CreateCurrencyPriceDto, 
  UpdateCurrencyPriceDto,
  CurrencyPriceQueryParams
} from '../types';
import fs from 'fs';
import path from 'path';
import { parse as csvParse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export const getCurrencies = async (
  search?: string,
  limit = 10,
  offset = 0
): Promise<{ currencies: Currency[]; total: number }> => {
  const where: Prisma.CurrencyWhereInput = search 
    ? {
        OR: [
          { code: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      } 
    : {};

  const [currencies, total] = await Promise.all([
    prisma.currency.findMany({
      where,
      orderBy: { code: 'asc' },
      skip: offset,
      take: limit,
    }),
    prisma.currency.count({ where }),
  ]);

  return { currencies, total };
};

export const getCurrencyByCode = async (code: string): Promise<Currency | null> => {
  return prisma.currency.findUnique({
    where: { code },
  });
};

export const createCurrency = async (currencyData: CreateCurrencyDto): Promise<Currency> => {
  return prisma.currency.create({
    data: currencyData,
  });
};

export const updateCurrency = async (
  code: string,
  currencyData: UpdateCurrencyDto
): Promise<Currency | null> => {
  return prisma.currency.update({
    where: { code },
    data: currencyData,
  });
};

export const deleteCurrency = async (code: string): Promise<Currency | null> => {
  return prisma.currency.delete({
    where: { code },
  });
};

// Currency Price Services
export const getCurrencyPrices = async (
  params: CurrencyPriceQueryParams
): Promise<{ currencyPrices: CurrencyPrice[]; total: number }> => {
  const { currencyCode, startDate, endDate, limit = 100, offset = 0 } = params;

  const where = {
    ...(currencyCode && { currencyCode }),
    ...(startDate || endDate
      ? {
          date: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) }),
          },
        }
      : {}),
  };

  const [currencyPrices, total] = await Promise.all([
    prisma.currencyPrice.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: offset,
      take: limit,
    }),
    prisma.currencyPrice.count({ where }),
  ]);

  return { currencyPrices, total };
};

export const getCurrencyPriceById = async (id: string): Promise<CurrencyPrice | null> => {
  return prisma.currencyPrice.findUnique({
    where: { id },
  });
};

export const createCurrencyPrice = async (data: CreateCurrencyPriceDto): Promise<CurrencyPrice> => {
  return prisma.currencyPrice.create({
    data,
  });
};

export const createManyCurrencyPrices = async (data: CreateCurrencyPriceDto[]): Promise<{ count: number }> => {
  return prisma.currencyPrice.createMany({
    data,
    skipDuplicates: true,
  });
};

export const updateCurrencyPrice = async (
  id: string,
  data: UpdateCurrencyPriceDto
): Promise<CurrencyPrice | null> => {
  return prisma.currencyPrice.update({
    where: { id },
    data,
  });
};

export const deleteCurrencyPrice = async (id: string): Promise<CurrencyPrice | null> => {
  return prisma.currencyPrice.delete({
    where: { id },
  });
};

export const getLatestCurrencyPrices = async (limit = 20): Promise<CurrencyPrice[]> => {
  const latestPrices = await prisma.$queryRaw<CurrencyPrice[]>`
    SELECT DISTINCT ON ("currencyCode") *
    FROM "CurrencyPrice"
    ORDER BY "currencyCode", "date" DESC
    LIMIT ${limit}
  `;
  
  return latestPrices;
};

export const getCurrencyPricesByDateRange = async (
  currencyCode: string,
  startDate: Date,
  endDate: Date
): Promise<CurrencyPrice[]> => {
  return prisma.currencyPrice.findMany({
    where: {
      currencyCode,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
};

/**
 * Helper function to parse numbers that handles both comma and dot decimal separators
 */
const parseNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  
  // Check if it's a string number with comma as decimal separator
  if (typeof value === 'string') {
    // Replace comma with dot for decimal separation
    const normalized = value.replace(/,/g, '.');
    return parseFloat(normalized);
  }
  
  return NaN;
};

/**
 * Normalize column names by mapping various possibilities to our standard format
 * for currency data
 */
const normalizeCurrencyColumnName = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  
  // Map of possible column names to standard format
  const columnMapping: Record<string, string> = {
    'code': 'code',
    'currency_code': 'code',
    'currencycode': 'code',
    'currency': 'code',
    'name': 'name',
    'currency_name': 'name',
    'currencyname': 'name',
    'description': 'name'
  };
  
  return columnMapping[normalized] || normalized;
};

/**
 * Normalize column names by mapping various possibilities to our standard format
 * for currency price data
 */
const normalizeCurrencyPriceColumnName = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  
  // Map of possible column names to standard format
  const columnMapping: Record<string, string> = {
    'date': 'date',
    'currencycode': 'currencyCode',
    'currency_code': 'currencyCode',
    'currency': 'currencyCode',
    'code': 'currencyCode',
    'open': 'open',
    'high': 'high',
    'low': 'low',
    'close': 'close',
    'trendq': 'trendQ',
    'trend_q': 'trendQ',
    'fq': 'fq',
    'f_q': 'fq'
  };
  
  return columnMapping[normalized] || normalized;
};

/**
 * Process CSV file and convert to currency data
 */
export const processCurrencyCsvFile = async (filePath: string): Promise<CreateCurrencyDto[]> => {
  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
    
    // Detect delimiter: check if file contains more semicolons or commas
    const commaCount = (fileContent.match(/,/g) || []).length;
    const semicolonCount = (fileContent.match(/;/g) || []).length;
    const delimiter = semicolonCount > commaCount ? ';' : ',';
    
    console.log(`Auto-detected delimiter: "${delimiter}" for CSV file`);
    
    // Parse CSV with auto-detected delimiter
    const records = csvParse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: delimiter,
      relax_quotes: true,
      relax_column_count: true
    });
    
    console.log(`Successfully parsed ${records.length} records from CSV`);
    
    // Track parsing errors
    const errors: Array<{ row: number, error: string }> = [];
    const validResults: CreateCurrencyDto[] = [];
    
    // Convert to currency format
    for (let index = 0; index < records.length; index++) {
      try {
        const record = records[index];
        
        // Normalize the record keys to handle case insensitivity and alternative names
        const normalizedRecord: Record<string, any> = {};
        Object.keys(record).forEach(key => {
          const normalizedKey = normalizeCurrencyColumnName(key);
          normalizedRecord[normalizedKey] = record[key];
        });
        
        // Check for required fields
        if (!normalizedRecord.code) {
          errors.push({ row: index + 2, error: 'Missing code field' });
          continue;
        }
        
        if (!normalizedRecord.name) {
          errors.push({ row: index + 2, error: 'Missing name field' });
          continue;
        }
        
        validResults.push({
          code: normalizedRecord.code,
          name: normalizedRecord.name
        });
      } catch (error) {
        errors.push({ row: index + 2, error: (error as Error).message });
      }
    }
    
    if (errors.length > 0) {
      console.warn(`Found ${errors.length} errors while processing currency CSV:`, errors);
    }
    
    return validResults;
  } catch (error) {
    console.error('Error processing currency CSV file:', error);
    throw error;
  }
};

/**
 * Process XLSX file and convert to currency data
 */
export const processCurrencyXlsxFile = async (filePath: string): Promise<CreateCurrencyDto[]> => {
  try {
    // Read file and get first sheet
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const records = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
    
    console.log(`Successfully parsed ${records.length} records from XLSX`);
    
    // Track parsing errors
    const errors: Array<{ row: number, error: string }> = [];
    const validResults: CreateCurrencyDto[] = [];
    
    // Convert to currency format
    for (let index = 0; index < records.length; index++) {
      try {
        const record = records[index] as Record<string, any>;
        
        // Normalize the record keys to handle case insensitivity and alternative names
        const normalizedRecord: Record<string, any> = {};
        Object.keys(record).forEach(key => {
          const normalizedKey = normalizeCurrencyColumnName(key);
          normalizedRecord[normalizedKey] = record[key];
        });
        
        // Check for required fields
        if (!normalizedRecord.code) {
          errors.push({ row: index + 2, error: 'Missing code field' });
          continue;
        }
        
        if (!normalizedRecord.name) {
          errors.push({ row: index + 2, error: 'Missing name field' });
          continue;
        }
        
        validResults.push({
          code: normalizedRecord.code,
          name: normalizedRecord.name
        });
      } catch (error) {
        errors.push({ row: index + 2, error: (error as Error).message });
      }
    }
    
    if (errors.length > 0) {
      console.warn(`Found ${errors.length} errors while processing currency XLSX:`, errors);
    }
    
    return validResults;
  } catch (error) {
    console.error('Error processing currency XLSX file:', error);
    throw error;
  }
};

/**
 * Process CSV file and convert to currency price data
 */
export const processCurrencyPriceCsvFile = async (
  filePath: string,
  currencyCode?: string
): Promise<CreateCurrencyPriceDto[]> => {
  try {
    // Read file content
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
    
    // Detect delimiter: check if file contains more semicolons or commas
    const commaCount = (fileContent.match(/,/g) || []).length;
    const semicolonCount = (fileContent.match(/;/g) || []).length;
    const delimiter = semicolonCount > commaCount ? ';' : ',';
    
    console.log(`Auto-detected delimiter: "${delimiter}" for CSV file`);
    
    // Parse CSV with auto-detected delimiter
    const records = csvParse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: delimiter,
      relax_quotes: true,
      relax_column_count: true
    });
    
    console.log(`Successfully parsed ${records.length} records from CSV`);
    
    // Track parsing errors
    const errors: Array<{ row: number, error: string }> = [];
    const validResults: CreateCurrencyPriceDto[] = [];
    
    // Check if any record has a currency code field
    const hasCurrencyCodeColumn = records.some((record: Record<string, any>) => {
      const keys = Object.keys(record).map(key => normalizeCurrencyPriceColumnName(key));
      return keys.includes('currencyCode');
    });
    
    // Convert to currency price format
    for (let index = 0; index < records.length; index++) {
      try {
        const record = records[index];
        
        // Normalize the record keys to handle case insensitivity and alternative names
        const normalizedRecord: Record<string, any> = {};
        Object.keys(record).forEach(key => {
          const normalizedKey = normalizeCurrencyPriceColumnName(key);
          normalizedRecord[normalizedKey] = record[key];
        });
        
        // Check for required fields
        if (!normalizedRecord.date) {
          errors.push({ row: index + 2, error: 'Missing date field' });
          continue;
        }
        
        if (normalizedRecord.open === undefined || 
            normalizedRecord.high === undefined || 
            normalizedRecord.low === undefined || 
            normalizedRecord.close === undefined) {
          errors.push({ row: index + 2, error: 'Missing required price fields (open, high, low, or close)' });
          continue;
        }
        
        // Determine the currency code to use
        let recordCurrencyCode: string;
        
        if (hasCurrencyCodeColumn && normalizedRecord.currencyCode) {
          // Use currency code from file
          recordCurrencyCode = normalizedRecord.currencyCode;
        } else if (currencyCode) {
          // Use provided currency code parameter
          recordCurrencyCode = currencyCode;
        } else {
          errors.push({ row: index + 2, error: 'No currency code provided in file or as parameter' });
          continue;
        }
        
        // Verify that currency exists
        const currencyExists = await prisma.currency.findUnique({
          where: { code: recordCurrencyCode },
          select: { code: true }
        });
        
        if (!currencyExists) {
          errors.push({ row: index + 2, error: `Currency with code "${recordCurrencyCode}" not found` });
          continue;
        }
        
        // Parse numeric values
        const openPrice = parseNumber(normalizedRecord.open);
        const highPrice = parseNumber(normalizedRecord.high);
        const lowPrice = parseNumber(normalizedRecord.low);
        const closePrice = parseNumber(normalizedRecord.close);
        
        // Parse trendQ and fq values if present
        const trendQ = normalizedRecord.trendQ ? parseNumber(normalizedRecord.trendQ) : null;
        const fq = normalizedRecord.fq ? parseNumber(normalizedRecord.fq) : null;
        
        // Check for invalid numeric values
        if (isNaN(openPrice) || isNaN(highPrice) || isNaN(lowPrice) || isNaN(closePrice) || 
            (normalizedRecord.trendQ && isNaN(trendQ as number)) ||
            (normalizedRecord.fq && isNaN(fq as number))) {
          errors.push({ row: index + 2, error: 'Invalid price format' });
          continue;
        }
        
        // Parse date
        let parsedDate: Date;
        try {
          if (typeof normalizedRecord.date === 'string') {
            // Try to parse date with different formats
            if (normalizedRecord.date.includes('/')) {
              // MM/DD/YYYY or DD/MM/YYYY format
              const parts = normalizedRecord.date.split('/');
              if (parts.length === 3) {
                // Assume MM/DD/YYYY first
                parsedDate = new Date(`${parts[0]}/${parts[1]}/${parts[2]}`);
                if (isNaN(parsedDate.getTime())) {
                  // Try DD/MM/YYYY if MM/DD/YYYY failed
                  parsedDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
                }
              } else {
                throw new Error('Invalid date format');
              }
            } else if (normalizedRecord.date.includes('-')) {
              // YYYY-MM-DD format (ISO)
              parsedDate = new Date(normalizedRecord.date);
            } else {
              // Try direct parsing
              parsedDate = new Date(normalizedRecord.date);
            }
            
            if (isNaN(parsedDate.getTime())) {
              throw new Error('Invalid date format');
            }
          } else {
            parsedDate = new Date(normalizedRecord.date);
            if (isNaN(parsedDate.getTime())) {
              throw new Error('Invalid date');
            }
          }
        } catch (error) {
          errors.push({ row: index + 2, error: 'Invalid date format' });
          continue;
        }
        
        validResults.push({
          currencyCode: recordCurrencyCode,
          date: parsedDate,
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          close: closePrice,
          trendQ: trendQ,
          fq: fq
        });
      } catch (error) {
        errors.push({ row: index + 2, error: (error as Error).message });
      }
    }
    
    if (errors.length > 0) {
      console.warn(`Found ${errors.length} errors while processing currency price CSV:`, errors);
    }
    
    return validResults;
  } catch (error) {
    console.error('Error processing currency price CSV file:', error);
    throw error;
  }
};

/**
 * Process XLSX file and convert to currency price data
 */
export const processCurrencyPriceXlsxFile = async (
  filePath: string,
  currencyCode?: string
): Promise<CreateCurrencyPriceDto[]> => {
  try {
    // Read file and get first sheet
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const records = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
    
    console.log(`Successfully parsed ${records.length} records from XLSX`);
    
    // Track parsing errors
    const errors: Array<{ row: number, error: string }> = [];
    const validResults: CreateCurrencyPriceDto[] = [];
    
    // Check if currencyCode column exists in the data
    const firstRecord = records[0] as Record<string, any>;
    const hasCurrencyCodeColumn = Object.keys(firstRecord).some(key => 
      normalizeCurrencyPriceColumnName(key) === 'currencyCode'
    );
    
    // Convert to currency price format
    for (let index = 0; index < records.length; index++) {
      try {
        const record = records[index] as Record<string, any>;
        
        // Normalize the record keys to handle case insensitivity and alternative names
        const normalizedRecord: Record<string, any> = {};
        Object.keys(record).forEach(key => {
          const normalizedKey = normalizeCurrencyPriceColumnName(key);
          normalizedRecord[normalizedKey] = record[key];
        });
        
        // Check for required fields
        if (!normalizedRecord.date) {
          errors.push({ row: index + 2, error: 'Missing date field' });
          continue;
        }
        
        if (normalizedRecord.open === undefined || 
            normalizedRecord.high === undefined || 
            normalizedRecord.low === undefined || 
            normalizedRecord.close === undefined) {
          errors.push({ row: index + 2, error: 'Missing required price fields (open, high, low, or close)' });
          continue;
        }
        
        // Determine the currency code to use
        let recordCurrencyCode: string;
        
        if (hasCurrencyCodeColumn && normalizedRecord.currencyCode) {
          // Use currency code from file
          recordCurrencyCode = normalizedRecord.currencyCode;
        } else if (currencyCode) {
          // Use provided currency code parameter
          recordCurrencyCode = currencyCode;
        } else {
          errors.push({ row: index + 2, error: 'No currency code provided in file or as parameter' });
          continue;
        }
        
        // Verify that currency exists
        const currencyExists = await prisma.currency.findUnique({
          where: { code: recordCurrencyCode },
          select: { code: true }
        });
        
        if (!currencyExists) {
          errors.push({ row: index + 2, error: `Currency with code "${recordCurrencyCode}" not found` });
          continue;
        }
        
        // Parse numeric values
        const openPrice = parseNumber(normalizedRecord.open);
        const highPrice = parseNumber(normalizedRecord.high);
        const lowPrice = parseNumber(normalizedRecord.low);
        const closePrice = parseNumber(normalizedRecord.close);
        
        // Parse trendQ and fq values if present
        const trendQ = normalizedRecord.trendQ ? parseNumber(normalizedRecord.trendQ) : null;
        const fq = normalizedRecord.fq ? parseNumber(normalizedRecord.fq) : null;
        
        // Check for invalid numeric values
        if (isNaN(openPrice) || isNaN(highPrice) || isNaN(lowPrice) || isNaN(closePrice) || 
            (normalizedRecord.trendQ && isNaN(trendQ as number)) ||
            (normalizedRecord.fq && isNaN(fq as number))) {
          errors.push({ row: index + 2, error: 'Invalid price format' });
          continue;
        }
        
        // Parse date
        let parsedDate: Date;
        try {
          if (typeof normalizedRecord.date === 'string') {
            // Excel stores dates as serial numbers, but XLSX converts to strings
            // Try different date formats
            parsedDate = new Date(normalizedRecord.date);
            if (isNaN(parsedDate.getTime())) {
              // Try European format DD/MM/YYYY
              const dateParts = normalizedRecord.date.split('/');
              if (dateParts.length === 3) {
                parsedDate = new Date(`${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`);
              } else {
                throw new Error('Invalid date');
              }
            }
          } else {
            parsedDate = new Date(normalizedRecord.date);
            if (isNaN(parsedDate.getTime())) {
              throw new Error('Invalid date');
            }
          }
        } catch (error) {
          errors.push({ row: index + 2, error: 'Invalid date format' });
          continue;
        }
        
        validResults.push({
          currencyCode: recordCurrencyCode,
          date: parsedDate,
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          close: closePrice,
          trendQ: trendQ,
          fq: fq
        });
      } catch (error) {
        errors.push({ row: index + 2, error: (error as Error).message });
      }
    }
    
    if (errors.length > 0) {
      console.warn(`Found ${errors.length} errors while processing currency price XLSX:`, errors);
    }
    
    return validResults;
  } catch (error) {
    console.error('Error processing currency price XLSX file:', error);
    throw error;
  }
};

/**
 * Process currency file and convert to currency data
 */
export const processCurrencyFile = async (
  filePath: string,
  fileOriginalName: string
): Promise<CreateCurrencyDto[]> => {
  try {
    // Determine file type from extension
    const extension = path.extname(fileOriginalName).toLowerCase();
    
    if (extension === '.csv') {
      return processCurrencyCsvFile(filePath);
    } else if (extension === '.xlsx' || extension === '.xls') {
      return processCurrencyXlsxFile(filePath);
    } else {
      throw new Error(`Unsupported file format: ${extension}. Only CSV, XLSX, and XLS are supported.`);
    }
  } catch (error) {
    console.error('Error processing currency file:', error);
    throw error;
  }
};

/**
 * Process currency price file and convert to currency price data
 */
export const processCurrencyPriceFile = async (
  filePath: string,
  currencyCode: string | undefined,
  fileOriginalName: string
): Promise<CreateCurrencyPriceDto[]> => {
  try {
    // Determine file type from extension
    const extension = path.extname(fileOriginalName).toLowerCase();
    
    if (extension === '.csv') {
      return processCurrencyPriceCsvFile(filePath, currencyCode);
    } else if (extension === '.xlsx' || extension === '.xls') {
      return processCurrencyPriceXlsxFile(filePath, currencyCode);
    } else {
      throw new Error(`Unsupported file format: ${extension}. Only CSV, XLSX, and XLS are supported.`);
    }
  } catch (error) {
    console.error('Error processing currency price file:', error);
    throw error;
  }
};

/**
 * Import currencies from processed data
 */
export const importCurrencies = async (
  currencies: CreateCurrencyDto[]
): Promise<{ count: number }> => {
  // Create currencies with skipDuplicates to handle existing codes
  return prisma.currency.createMany({
    data: currencies,
    skipDuplicates: true,
  });
};

/**
 * Import currency prices from processed data
 */
export const importCurrencyPrices = async (
  currencyPrices: CreateCurrencyPriceDto[]
): Promise<{ count: number }> => {
  // Create currency prices with skipDuplicates to handle existing dates for same currency
  return prisma.currencyPrice.createMany({
    data: currencyPrices.map(price => ({
      currencyCode: price.currencyCode,
      date: price.date,
      open: price.open,
      high: price.high,
      low: price.low,
      close: price.close,
      trendQ: price.trendQ,
      fq: price.fq
    })),
    skipDuplicates: true,
  });
};

/**
 * Get all currency prices for a specific currency code with no pagination limit
 */
export const getAllCurrencyPricesByCode = async (
  currencyCode: string
): Promise<{ currencyPrices: CurrencyPrice[]; total: number }> => {
  const where = {
    currencyCode
  };

  const [currencyPrices, total] = await Promise.all([
    prisma.currencyPrice.findMany({
      where,
      orderBy: { date: 'desc' },
    }),
    prisma.currencyPrice.count({ where }),
  ]);

  return { currencyPrices, total };
};
