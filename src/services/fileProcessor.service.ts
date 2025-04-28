import fs from 'fs';
import path from 'path';
import { parse as csvParse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { StockPriceData } from '../types';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../utils/error';

const prisma = new PrismaClient();

/**
 * Service to handle processing of CSV and XLSX files for stock price data
 */

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
 */
const normalizeColumnName = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  
  // Map of possible column names to standard format
  const columnMapping: Record<string, string> = {
    'date': 'date',
    'open': 'open',
    'high': 'high',
    'low': 'low',
    'close': 'close',
    'volume': 'volume',
    'trendq': 'trendQ',
    'trend_q': 'trendQ',
    'fq': 'fq',
    'banddown': 'bandDown',
    'band_down': 'bandDown',
    'bandup': 'bandUp',
    'band_up': 'bandUp',
    'symbol': 'symbol'
  };
  
  return columnMapping[normalized] || normalized;
};

type StockPriceWithoutIds = Omit<StockPriceData, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Process CSV file and convert to stock price data
 */
export const processCsvFile = async (
  filePath: string, 
  symbol?: string
): Promise<Array<StockPriceWithoutIds>> => {
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
    const validResults: StockPriceWithoutIds[] = [];
    
    // Check if Symbol column exists in the data
    const firstRecord = records[0];
    const hasSymbolColumn = Object.keys(firstRecord).some(key => 
      normalizeColumnName(key) === 'symbol'
    );
    
    // Convert to stock price format
    for (let index = 0; index < records.length; index++) {
      try {
        const record = records[index];
        
        // Normalize the record keys to handle case insensitivity and alternative names
        const normalizedRecord: Record<string, any> = {};
        Object.keys(record).forEach(key => {
          const normalizedKey = normalizeColumnName(key);
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
        
        // Determine the symbol to use
        let recordSymbol: string;
        
        if (hasSymbolColumn && normalizedRecord.symbol) {
          // Use symbol from file
          recordSymbol = normalizedRecord.symbol;
        } else if (symbol) {
          // Use provided symbol parameter
          recordSymbol = symbol;
        } else {
          errors.push({ row: index + 2, error: 'No symbol provided in file or as parameter' });
          continue;
        }
        
        // Verify that stock exists
        const stockExists = await prisma.stock.findUnique({
          where: { symbol: recordSymbol },
          select: { symbol: true }
        });
        
        if (!stockExists) {
          errors.push({ row: index + 2, error: `Stock with symbol "${recordSymbol}" not found` });
          continue;
        }
        
        // Tự động chuyển đổi dấu phẩy thành dấu chấm cho số thập phân
        const openPrice = parseNumber(normalizedRecord.open);
        const highPrice = parseNumber(normalizedRecord.high);
        const lowPrice = parseNumber(normalizedRecord.low);
        const closePrice = parseNumber(normalizedRecord.close);
        
        // Check for invalid numeric values
        if (isNaN(openPrice) || isNaN(highPrice) || isNaN(lowPrice) || isNaN(closePrice)) {
          errors.push({ row: index + 2, error: 'Invalid price format' });
          continue;
        }
        
        // Parse date
        let parsedDate: Date;
        try {
          // Try different date formats
          if (typeof normalizedRecord.date === 'string') {
            // Handle MM/DD/YYYY or DD/MM/YYYY formats
            const dateParts = normalizedRecord.date.split('/');
            if (dateParts.length === 3) {
              // Attempt both MM/DD/YYYY and DD/MM/YYYY
              const potentialDate1 = new Date(normalizedRecord.date); // MM/DD/YYYY
              
              // Swap day and month for DD/MM/YYYY
              const potentialDate2 = new Date(
                `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
              );
              
              // Use the one that seems valid
              if (!isNaN(potentialDate1.getTime())) {
                parsedDate = potentialDate1;
              } else if (!isNaN(potentialDate2.getTime())) {
                parsedDate = potentialDate2;
              } else {
                throw new Error('Invalid date format');
              }
            } else {
              // Try standard parsing
              parsedDate = new Date(normalizedRecord.date);
              if (isNaN(parsedDate.getTime())) {
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
          symbol: recordSymbol,
          date: parsedDate,
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          close: closePrice,
          volume: normalizedRecord.volume ? parseInt(normalizedRecord.volume, 10) : undefined,
          trendQ: normalizedRecord.trendQ ? parseNumber(normalizedRecord.trendQ) : undefined,
          fq: normalizedRecord.fq ? parseNumber(normalizedRecord.fq) : undefined,
          bandDown: normalizedRecord.bandDown ? parseNumber(normalizedRecord.bandDown) : undefined,
          bandUp: normalizedRecord.bandUp ? parseNumber(normalizedRecord.bandUp) : undefined,
        });
      } catch (error) {
        errors.push({ row: index + 2, error: `Unexpected error: ${(error as Error).message}` });
      }
    }
    
    // Log errors if any
    if (errors.length > 0) {
      console.warn(`Found ${errors.length} errors while parsing CSV file:`);
      errors.forEach(err => console.warn(`Row ${err.row}: ${err.error}`));
    }
    
    return validResults;
  } catch (error) {
    console.error('Error processing CSV file:', error);
    throw new Error(`Failed to process CSV file: ${(error as Error).message}`);
  }
};

/**
 * Process XLSX file and convert to stock price data
 */
export const processXlsxFile = async (
  filePath: string, 
  symbol?: string
): Promise<Array<StockPriceWithoutIds>> => {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Successfully parsed ${jsonData.length} records from Excel`);
    
    // Track parsing errors
    const errors: Array<{ row: number, error: string }> = [];
    const validResults: StockPriceWithoutIds[] = [];
    
    // Check if Symbol column exists in the data
    const firstRecord = jsonData[0] as Record<string, any>;
    const hasSymbolColumn = Object.keys(firstRecord).some(key => 
      normalizeColumnName(key) === 'symbol'
    );
    
    // Convert to stock price format
    for (let index = 0; index < jsonData.length; index++) {
      try {
        const record = jsonData[index] as Record<string, any>;
        
        // Normalize the record keys to handle case insensitivity and alternative names
        const normalizedRecord: Record<string, any> = {};
        Object.keys(record).forEach(key => {
          const normalizedKey = normalizeColumnName(key);
          normalizedRecord[normalizedKey] = record[key];
        });
        
        // Check for required fields
        if (normalizedRecord.date === undefined) {
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
        
        // Determine the symbol to use
        let recordSymbol: string;
        
        if (hasSymbolColumn && normalizedRecord.symbol) {
          // Use symbol from file
          recordSymbol = normalizedRecord.symbol;
        } else if (symbol) {
          // Use provided symbol parameter
          recordSymbol = symbol;
        } else {
          errors.push({ row: index + 2, error: 'No symbol provided in file or as parameter' });
          continue;
        }
        
        // Verify that stock exists
        const stockExists = await prisma.stock.findUnique({
          where: { symbol: recordSymbol },
          select: { symbol: true }
        });
        
        if (!stockExists) {
          errors.push({ row: index + 2, error: `Stock with symbol "${recordSymbol}" not found` });
          continue;
        }
        
        // Parse numeric values
        const openPrice = parseNumber(normalizedRecord.open);
        const highPrice = parseNumber(normalizedRecord.high);
        const lowPrice = parseNumber(normalizedRecord.low);
        const closePrice = parseNumber(normalizedRecord.close);
        
        // Check for invalid numeric values
        if (isNaN(openPrice) || isNaN(highPrice) || isNaN(lowPrice) || isNaN(closePrice)) {
          errors.push({ row: index + 2, error: 'Invalid price format' });
          continue;
        }
        
        // Handle different date formats
        const dateValue = normalizedRecord.date;
        let parsedDate;
        
        try {
          if (dateValue instanceof Date) {
            parsedDate = dateValue;
          } else if (typeof dateValue === 'number') {
            // Excel stores dates as numbers, need to convert
            parsedDate = XLSX.SSF.parse_date_code(dateValue);
            parsedDate = new Date(
              parsedDate.y, 
              parsedDate.m - 1, // Excel months are 1-indexed
              parsedDate.d,
              parsedDate.H,
              parsedDate.M,
              parsedDate.S
            );
          } else if (typeof dateValue === 'string') {
            // Try different date formats
            // Handle MM/DD/YYYY or DD/MM/YYYY formats
            const dateParts = dateValue.split('/');
            if (dateParts.length === 3) {
              // Attempt both MM/DD/YYYY and DD/MM/YYYY
              const potentialDate1 = new Date(dateValue); // MM/DD/YYYY
              
              // Swap day and month for DD/MM/YYYY
              const potentialDate2 = new Date(
                `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
              );
              
              // Use the one that seems valid
              if (!isNaN(potentialDate1.getTime())) {
                parsedDate = potentialDate1;
              } else if (!isNaN(potentialDate2.getTime())) {
                parsedDate = potentialDate2;
              } else {
                throw new Error('Invalid date format');
              }
            } else {
              // Try standard parsing
              parsedDate = new Date(dateValue);
            }
          } else {
            throw new Error('Invalid date format');
          }
          
          // Check if the date is valid
          if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date value');
          }
        } catch (error) {
          errors.push({ row: index + 2, error: `Invalid date: ${(error as Error).message}` });
          continue;
        }
        
        validResults.push({
          symbol: recordSymbol,
          date: parsedDate,
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          close: closePrice,
          volume: normalizedRecord.volume !== undefined ? parseInt(normalizedRecord.volume, 10) : undefined,
          trendQ: normalizedRecord.trendQ !== undefined ? parseNumber(normalizedRecord.trendQ) : undefined,
          fq: normalizedRecord.fq !== undefined ? parseNumber(normalizedRecord.fq) : undefined,
          bandDown: normalizedRecord.bandDown !== undefined ? parseNumber(normalizedRecord.bandDown) : undefined,
          bandUp: normalizedRecord.bandUp !== undefined ? parseNumber(normalizedRecord.bandUp) : undefined,
        });
      } catch (error) {
        errors.push({ row: index + 2, error: `Unexpected error: ${(error as Error).message}` });
      }
    }
    
    // Log errors if any
    if (errors.length > 0) {
      console.warn(`Found ${errors.length} errors while parsing Excel file:`);
      errors.forEach(err => console.warn(`Row ${err.row}: ${err.error}`));
    }
    
    return validResults;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    throw new Error(`Failed to process Excel file: ${(error as Error).message}`);
  }
};

/**
 * Process file based on extension (CSV or XLSX)
 */
export const processStockPriceFile = async (
  filePath: string,
  symbol: string | undefined,
  fileOriginalName: string
): Promise<Array<Omit<StockPriceData, 'id' | 'createdAt' | 'updatedAt'>>> => {
  const extension = path.extname(fileOriginalName).toLowerCase();
  
  if (extension === '.csv') {
    return processCsvFile(filePath, symbol);
  } else if (extension === '.xlsx' || extension === '.xls') {
    return processXlsxFile(filePath, symbol);
  } else {
    throw new Error('Unsupported file format. Only CSV and XLSX/XLS files are supported.');
  }
}; 