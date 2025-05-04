import { Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../utils/error';
import { SelectedStocksData } from '../types';
import prisma from '../config/database';

// Convert Prisma SelectedStocks to SelectedStocksData
function convertToSelectedStocks(selectedStocks: any): SelectedStocksData {
  return {
    ...selectedStocks,
    close: selectedStocks.close !== null ? Number(selectedStocks.close) : undefined,
    return: selectedStocks.return !== null ? Number(selectedStocks.return) : undefined,
    qIndex: selectedStocks.qIndex !== null ? Number(selectedStocks.qIndex) : undefined,
    volume: selectedStocks.volume !== null ? Number(selectedStocks.volume) : undefined,
  };
}

// Parse date string to Date object
function parseDate(dateString: string | Date): Date {
  if (dateString instanceof Date) return dateString;
  
  // Handle format "M/D/YYYY"
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const month = parseInt(parts[0]) - 1; // Month is 0-indexed in JavaScript Date
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  }
  
  // Fallback to standard Date parsing
  return new Date(dateString);
}

/**
 * Get selected stocks by ID
 */
export const getSelectedStocksById = async (id: string): Promise<SelectedStocksData> => {
  const selectedStocks = await prisma.selectedStocks.findUnique({
    where: { id }
  });

  if (!selectedStocks) {
    throw new NotFoundError('Selected stocks not found');
  }

  return convertToSelectedStocks(selectedStocks);
};

/**
 * Get selected stocks with pagination and filtering
 */
export interface GetSelectedStocksParams {
  symbol?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortDirection?: 'asc' | 'desc';
}

export interface SelectedStocksResult {
  selectedStocks: SelectedStocksData[];
  total: number;
  page: number;
  limit: number | null;
  totalPages: number;
}

export const getSelectedStocks = async (params: GetSelectedStocksParams): Promise<SelectedStocksResult> => {
  const {
    symbol,
    startDate,
    endDate,
    page = 1,
    limit,
    sortDirection = 'desc'
  } = params;

  // Build where condition
  const where: Prisma.SelectedStocksWhereInput = {};
  
  if (symbol) {
    where.symbol = symbol;
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
  const total = await prisma.selectedStocks.count({ where });

  // Handle pagination
  const skip = limit ? (page - 1) * limit : 0;
  
  // Get selected stocks with or without pagination
  const selectedStocksData = await prisma.selectedStocks.findMany({
    where,
    skip,
    ...(limit ? { take: limit } : {}),
    orderBy: { date: sortDirection },
    include: {
      stock: {
        select: {
          name: true,
          exchange: true,
          industry: true
        }
      }
    }
  });

  // Convert to our type
  const selectedStocks = selectedStocksData.map(convertToSelectedStocks);

  return {
    selectedStocks,
    total,
    page,
    limit: limit || null,
    totalPages: limit ? Math.ceil(total / limit) : 1
  };
};

/**
 * Create a new selected stocks entry
 */
export const createSelectedStocks = async (
  data: Omit<SelectedStocksData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SelectedStocksData> => {
  const { symbol, date, close, return: returnValue, qIndex, volume } = data;

  // Check if stock exists
  const stock = await prisma.stock.findUnique({
    where: { symbol }
  });

  if (!stock) {
    throw new BadRequestError(`Stock with symbol "${symbol}" not found`);
  }

  // Check for existing entry for the same date and symbol
  const existingEntry = await prisma.selectedStocks.findUnique({
    where: {
      symbol_date: {
        symbol,
        date
      }
    }
  });

  if (existingEntry) {
    throw new BadRequestError(`Selected stocks entry for symbol "${symbol}" on date "${date.toISOString().split('T')[0]}" already exists`);
  }

  // Create a new selected stocks entry
  const selectedStocks = await prisma.selectedStocks.create({
    data: {
      symbol,
      date,
      close,
      return: returnValue,
      qIndex,
      volume
    }
  });

  return convertToSelectedStocks(selectedStocks);
};

/**
 * Update a selected stocks entry
 */
export const updateSelectedStocks = async (
  id: string,
  data: Partial<Omit<SelectedStocksData, 'id' | 'symbol' | 'date' | 'createdAt' | 'updatedAt'>>
): Promise<SelectedStocksData> => {
  // Check if selected stocks entry exists
  const existingEntry = await prisma.selectedStocks.findUnique({
    where: { id }
  });

  if (!existingEntry) {
    throw new NotFoundError('Selected stocks entry not found');
  }

  // Update the selected stocks entry
  const selectedStocks = await prisma.selectedStocks.update({
    where: { id },
    data: {
      close: data.close,
      return: data.return,
      qIndex: data.qIndex,
      volume: data.volume
    }
  });

  return convertToSelectedStocks(selectedStocks);
};

/**
 * Delete a selected stocks entry
 */
export const deleteSelectedStocks = async (id: string): Promise<void> => {
  // Check if selected stocks entry exists
  const existingEntry = await prisma.selectedStocks.findUnique({
    where: { id }
  });

  if (!existingEntry) {
    throw new NotFoundError('Selected stocks entry not found');
  }

  // Delete the selected stocks entry
  await prisma.selectedStocks.delete({
    where: { id }
  });
};

/**
 * Bulk upsert selected stocks entries
 */
export const bulkUpsertSelectedStocks = async (
  selectedStocksEntries: Array<Omit<SelectedStocksData, 'id' | 'createdAt' | 'updatedAt'> | {
    symbol: string;
    date: string | Date;
    close?: number;
    return?: number;
    qIndex?: number;
    volume?: number;
  }>
): Promise<number> => {
  let insertedCount = 0;

  // Process in batches of 100
  const batchSize = 100;
  const batches = [];

  // Format entries to ensure dates are Date objects
  const formattedEntries = selectedStocksEntries.map(entry => ({
    ...entry,
    date: parseDate(entry.date)
  }));

  // Split the entries into batches
  for (let i = 0; i < formattedEntries.length; i += batchSize) {
    batches.push(formattedEntries.slice(i, i + batchSize));
  }

  // Process each batch
  for (const batch of batches) {
    const operations = batch.map(entry => {
      return prisma.selectedStocks.upsert({
        where: {
          symbol_date: {
            symbol: entry.symbol,
            date: entry.date
          }
        },
        update: {
          close: entry.close,
          return: entry.return,
          qIndex: entry.qIndex,
          volume: entry.volume
        },
        create: {
          symbol: entry.symbol,
          date: entry.date,
          close: entry.close,
          return: entry.return,
          qIndex: entry.qIndex,
          volume: entry.volume
        }
      });
    });

    const results = await Promise.all(operations);
    insertedCount += results.length;
  }

  return insertedCount;
};

/**
 * Get selected stocks with their price history for the last 6 months
 */
export interface SelectedStocksWithPriceHistoryParams {
  page?: number;
  limit?: number;
  date?: Date; // Date to get selected stocks from (defaults to latest date)
}

export interface SelectedStocksWithPriceHistory {
  symbol: string;
  stockName: string | null;
  exchange: string | null;
  industry: string | null;
  latestSelectedStocks: {
    date: Date;
    close: number | null;
    return: number | null;
    qIndex: number | null;
    volume: number | null;
  };
  priceHistory: Array<{
    date: Date;
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
    volume: number | null;
  }>;
}

export interface SelectedStocksWithPriceHistoryResult {
  stocks: SelectedStocksWithPriceHistory[];
  total: number;
  page: number;
  limit: number | null;
  totalPages: number;
}

export const getSelectedStocksWithPriceHistory = async (
  params: SelectedStocksWithPriceHistoryParams
): Promise<SelectedStocksWithPriceHistoryResult> => {
  const { page = 1, limit, date } = params;
  
  // Get the latest date in the selectedStocks table if not provided
  let selectedDate = date;
  if (!selectedDate) {
    const latestDateRecord = await prisma.selectedStocks.findFirst({
      orderBy: { date: 'desc' },
      select: { date: true },
    });
    selectedDate = latestDateRecord?.date;
    
    if (!selectedDate) {
      return {
        stocks: [],
        total: 0,
        page,
        limit: limit || null,
        totalPages: 0
      };
    }
  }
  
  // Calculate date 6 months ago
  const sixMonthsAgo = new Date(selectedDate);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  // Get selected stocks for the given date
  const selectedStocksResult = await prisma.selectedStocks.findMany({
    where: { date: selectedDate },
    select: {
      symbol: true,
      date: true,
      close: true,
      return: true,
      qIndex: true,
      volume: true,
      stock: {
        select: {
          name: true,
          exchange: true,
          industry: true,
        }
      }
    },
  });
  
  // Get total count
  const total = selectedStocksResult.length;
  
  // Apply pagination
  const skip = limit ? (page - 1) * limit : 0;
  const paginatedSelectedStocks = limit 
    ? selectedStocksResult.slice(skip, skip + limit)
    : selectedStocksResult;
  
  // For each stock, get the price history for the last 6 months
  const selectedStocksWithPriceHistory = await Promise.all(
    paginatedSelectedStocks.map(async (selectedStock) => {
      const priceHistory = await prisma.stockPrice.findMany({
        where: {
          symbol: selectedStock.symbol,
          date: {
            gte: sixMonthsAgo,
            lte: selectedDate
          }
        },
        select: {
          date: true,
          open: true,
          high: true,
          low: true,
          close: true,
          volume: true,
        },
        orderBy: { date: 'asc' }
      });
      
      return {
        symbol: selectedStock.symbol,
        stockName: selectedStock.stock?.name || null,
        exchange: selectedStock.stock?.exchange || null,
        industry: selectedStock.stock?.industry || null,
        latestSelectedStocks: {
          date: selectedStock.date,
          close: selectedStock.close ? Number(selectedStock.close) : null,
          return: selectedStock.return ? Number(selectedStock.return) : null,
          qIndex: selectedStock.qIndex ? Number(selectedStock.qIndex) : null,
          volume: selectedStock.volume ? Number(selectedStock.volume) : null,
        },
        priceHistory: priceHistory.map(price => ({
          date: price.date,
          open: price.open ? Number(price.open) : null,
          high: price.high ? Number(price.high) : null,
          low: price.low ? Number(price.low) : null,
          close: price.close ? Number(price.close) : null,
          volume: price.volume ? Number(price.volume) : null,
        }))
      };
    })
  );
  
  return {
    stocks: selectedStocksWithPriceHistory,
    total,
    page,
    limit: limit || null,
    totalPages: limit ? Math.ceil(total / limit) : 1
  };
}; 