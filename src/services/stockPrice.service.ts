import { PrismaClient, Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../utils/error';
import { StockPriceData } from '../types';

const prisma = new PrismaClient();

// Convert Prisma StockPrice to StockPriceData
function convertToStockPrice(stockPrice: any): StockPriceData {
  return {
    ...stockPrice,
    volume: stockPrice.volume ? Number(stockPrice.volume) : undefined,
    trendQ: stockPrice.trendQ ? parseFloat(stockPrice.trendQ.toString()) : undefined,
    fq: stockPrice.fq ? parseFloat(stockPrice.fq.toString()) : undefined,
    bandDown: stockPrice.bandDown ? parseFloat(stockPrice.bandDown.toString()) : undefined,
    bandUp: stockPrice.bandUp ? parseFloat(stockPrice.bandUp.toString()) : undefined,
    open: parseFloat(stockPrice.open.toString()),
    high: parseFloat(stockPrice.high.toString()),
    low: parseFloat(stockPrice.low.toString()),
    close: parseFloat(stockPrice.close.toString()),
  };
}

/**
 * Get stock price by ID
 */
export const getStockPriceById = async (id: string): Promise<StockPriceData> => {
  const stockPrice = await prisma.stockPrice.findUnique({
    where: { id }
  });

  if (!stockPrice) {
    throw new NotFoundError('Stock price not found');
  }

  return convertToStockPrice(stockPrice);
};

/**
 * Get stock prices for a symbol with pagination and date filtering
 */
export interface GetStockPricesParams {
  symbol: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortDirection?: 'asc' | 'desc';
}

export interface StockPricesResult {
  stockPrices: StockPriceData[];
  total: number;
  page: number;
  limit: number | null;
  totalPages: number;
}

export const getStockPrices = async (params: GetStockPricesParams): Promise<StockPricesResult> => {
  const {
    symbol,
    startDate,
    endDate,
    page = 1,
    limit,
    sortDirection = 'desc'
  } = params;

  // Build where condition
  const where: Prisma.StockPriceWhereInput = { symbol };
  
  if (startDate || endDate) {
    where.date = {};
    
    if (startDate) {
      where.date.gte = startDate;
    }
    
    if (endDate) {
      where.date.lte = endDate;
    }
  }

  // Get total count
  const total = await prisma.stockPrice.count({ where });

  // Handle pagination
  const skip = limit ? (page - 1) * limit : 0;
  
  // Get stock prices with or without pagination
  const stockPricesData = await prisma.stockPrice.findMany({
    where,
    skip,
    ...(limit ? { take: limit } : {}), // Only apply limit if it's provided
    orderBy: { date: sortDirection },
  });

  // Convert to our type
  const stockPrices = stockPricesData.map(convertToStockPrice);

  return {
    stockPrices,
    total,
    page,
    limit: limit || null,
    totalPages: limit ? Math.ceil(total / limit) : 1
  };
};

/**
 * Get all stock prices with pagination and filtering
 */
export interface GetAllStockPricesParams {
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  symbol?: string;
}

export const getAllStockPrices = async (params: GetAllStockPricesParams): Promise<StockPricesResult> => {
  const {
    page = 1,
    limit,
    startDate,
    endDate,
    symbol
  } = params;

  // Build where condition
  const where: Prisma.StockPriceWhereInput = {};
  
  if (symbol) {
    where.symbol = { contains: symbol, mode: 'insensitive' as Prisma.QueryMode };
  }
  
  if (startDate || endDate) {
    where.date = {};
    
    if (startDate) {
      where.date.gte = startDate;
    }
    
    if (endDate) {
      where.date.lte = endDate;
    }
  }

  // Get total count
  const total = await prisma.stockPrice.count({ where });

  // Handle pagination
  const skip = limit ? (page - 1) * limit : 0;
  
  // Get stock prices with or without pagination
  const stockPricesData = await prisma.stockPrice.findMany({
    where,
    skip,
    ...(limit ? { take: limit } : {}), // Only apply limit if it's provided
    orderBy: { date: 'desc' },
  });

  // Convert to our type
  const stockPrices = stockPricesData.map(convertToStockPrice);

  return {
    stockPrices,
    total,
    page,
    limit: limit || null,
    totalPages: limit ? Math.ceil(total / limit) : 1
  };
};

/**
 * Create a new stock price
 */
export const createStockPrice = async (data: Omit<StockPriceData, 'id' | 'createdAt' | 'updatedAt'>): Promise<StockPriceData> => {
  const { symbol, date, open, high, low, close, volume, trendQ, fq, bandDown, bandUp } = data;

  // Check if stock exists
  const stock = await prisma.stock.findUnique({
    where: { symbol }
  });

  if (!stock) {
    throw new BadRequestError(`Stock with symbol "${symbol}" not found`);
  }

  // Check for existing stock price record for the same date
  const existingStockPrice = await prisma.stockPrice.findUnique({
    where: {
      symbol_date: {
        symbol,
        date
      }
    }
  });

  if (existingStockPrice) {
    throw new BadRequestError(`Stock price for symbol "${symbol}" on date "${date.toISOString().split('T')[0]}" already exists`);
  }

  // Create the stock price
  const stockPrice = await prisma.stockPrice.create({
    data: {
      symbol,
      date,
      open,
      high,
      low,
      close,
      volume: volume ? BigInt(volume) : null,
      trendQ,
      fq,
      bandDown,
      bandUp,
    }
  });

  return convertToStockPrice(stockPrice);
};

/**
 * Update a stock price
 */
export const updateStockPrice = async (
  id: string,
  data: Partial<Omit<StockPriceData, 'id' | 'symbol' | 'date' | 'createdAt' | 'updatedAt'>>
): Promise<StockPriceData> => {
  const { open, high, low, close, volume, trendQ, fq, bandDown, bandUp } = data;

  // Ensure stock price exists
  const existingStockPrice = await prisma.stockPrice.findUnique({
    where: { id }
  });

  if (!existingStockPrice) {
    throw new NotFoundError('Stock price not found');
  }

  // Update the stock price
  const stockPrice = await prisma.stockPrice.update({
    where: { id },
    data: {
      open: open !== undefined ? open : undefined,
      high: high !== undefined ? high : undefined,
      low: low !== undefined ? low : undefined,
      close: close !== undefined ? close : undefined,
      volume: volume !== undefined ? BigInt(volume) : undefined,
      trendQ: trendQ !== undefined ? trendQ : undefined,
      fq: fq !== undefined ? fq : undefined,
      bandDown: bandDown !== undefined ? bandDown : undefined,
      bandUp: bandUp !== undefined ? bandUp : undefined,
    }
  });

  return convertToStockPrice(stockPrice);
};

/**
 * Delete a stock price
 */
export const deleteStockPrice = async (id: string): Promise<void> => {
  // Ensure stock price exists
  const stockPrice = await prisma.stockPrice.findUnique({
    where: { id }
  });

  if (!stockPrice) {
    throw new NotFoundError('Stock price not found');
  }

  // Delete the stock price
  await prisma.stockPrice.delete({
    where: { id }
  });
};

/**
 * Bulk upsert stock prices
 */
export const bulkUpsertStockPrices = async (
  stockPrices: Array<Omit<StockPriceData, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<number> => {
  if (stockPrices.length === 0) {
    return 0;
  }

  // Group by symbol for more efficient validation
  const symbolsToCheck = [...new Set(stockPrices.map(sp => sp.symbol))];
  
  // Validate that all symbols exist
  const existingStocks = await prisma.stock.findMany({
    where: {
      symbol: {
        in: symbolsToCheck
      }
    },
    select: { symbol: true }
  });
  
  const existingSymbols = existingStocks.map(stock => stock.symbol);
  const missingSymbols = symbolsToCheck.filter(symbol => !existingSymbols.includes(symbol));
  
  if (missingSymbols.length > 0) {
    throw new BadRequestError(`Stocks with symbols ${missingSymbols.join(', ')} not found`);
  }

  // Process in batches for better performance
  const result = await prisma.$transaction(async (tx) => {
    let count = 0;
    
    for (const stockPrice of stockPrices) {
      const { symbol, date, open, high, low, close, volume, trendQ, fq, bandDown, bandUp } = stockPrice;
      
      await tx.stockPrice.upsert({
        where: {
          symbol_date: {
            symbol,
            date
          }
        },
        update: {
          open,
          high,
          low,
          close,
          volume: volume ? BigInt(volume) : null,
          trendQ,
          fq,
          bandDown,
          bandUp,
        },
        create: {
          symbol,
          date,
          open,
          high,
          low,
          close,
          volume: volume ? BigInt(volume) : null,
          trendQ,
          fq,
          bandDown,
          bandUp,
        }
      });
      
      count++;
    }
    
    return count;
  });
  
  return result;
};

// Job tracking for large uploads
interface JobStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  message?: string;
  error?: string;
  symbol?: string;
  fileName?: string;
}

const jobs = new Map<string, JobStatus>();

/**
 * Create a bulk upsert job for large datasets
 */
export const createBulkUpsertJob = async (
  stockPrices: Array<Omit<StockPriceData, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<{ jobId: string; totalRecords: number }> => {
  const jobId = Date.now().toString();
  
  jobs.set(jobId, {
    status: 'pending',
    progress: 0,
    totalRecords: stockPrices.length,
    processedRecords: 0
  });

  // Process job asynchronously
  setImmediate(async () => {
    try {
      jobs.set(jobId, {
        ...jobs.get(jobId)!,
        status: 'processing'
      });

      const BATCH_SIZE = 1000;
      let processedCount = 0;

      for (let i = 0; i < stockPrices.length; i += BATCH_SIZE) {
        const batch = stockPrices.slice(i, i + BATCH_SIZE);
        await bulkUpsertStockPrices(batch);
        
        processedCount += batch.length;
        
        jobs.set(jobId, {
          ...jobs.get(jobId)!,
          progress: Math.round((processedCount / stockPrices.length) * 100),
          processedRecords: processedCount
        });
      }

      jobs.set(jobId, {
        ...jobs.get(jobId)!,
        status: 'completed',
        progress: 100,
        processedRecords: stockPrices.length,
        message: `Processed ${stockPrices.length} records successfully`
      });
    } catch (error) {
      jobs.set(jobId, {
        ...jobs.get(jobId)!,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return { jobId, totalRecords: stockPrices.length };
};

/**
 * Get the status of a job
 */
export const getStockPriceJobStatus = (jobId: string): JobStatus | null => {
  const job = jobs.get(jobId);
  return job || null;
};

/**
 * Register a file upload job
 */
export const registerFileUploadJob = (
  jobId: string,
  symbol: string,
  fileName: string,
  totalRecords: number
): void => {
  jobs.set(jobId, {
    status: 'pending',
    progress: 0,
    totalRecords,
    processedRecords: 0,
    symbol,
    fileName
  });
};

/**
 * Update a file upload job status
 */
export const updateFileUploadJobStatus = (
  jobId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  processedRecords?: number,
  error?: string
): void => {
  const job = jobs.get(jobId);
  
  if (job) {
    jobs.set(jobId, {
      ...job,
      status,
      processedRecords: processedRecords !== undefined ? processedRecords : job.processedRecords,
      progress: processedRecords !== undefined ? Math.round((processedRecords / job.totalRecords) * 100) : job.progress,
      error
    });
  }
};

/**
 * Update job progress
 */
export const updateJobProgress = (
  jobId: string,
  processedRecords: number
): void => {
  const job = jobs.get(jobId);
  
  if (job) {
    const progress = Math.round((processedRecords / job.totalRecords) * 100);
    
    jobs.set(jobId, {
      ...job,
      processedRecords,
      progress: Math.min(progress, 99) // Keep at 99% until completed
    });
  }
};

/**
 * Update job total records
 */
export const updateJobTotalRecords = (
  jobId: string,
  totalRecords: number
): void => {
  const job = jobs.get(jobId);
  
  if (job) {
    const progress = totalRecords > 0 ? Math.round((job.processedRecords / totalRecords) * 100) : 0;
    
    jobs.set(jobId, {
      ...job,
      totalRecords,
      progress
    });
  }
};
