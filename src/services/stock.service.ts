import { PrismaClient, Prisma } from '@prisma/client';
import { NotFoundError, BadRequestError } from '../utils/error';
import { 
  StockData, 
  CreateStockInput, 
  UpdateStockInput, 
  StockListParams, 
  StockListResult 
} from '../types';

const prisma = new PrismaClient();

/**
 * Convert Prisma Stock to StockData
 */
function convertToStock(stock: any): StockData {
  return {
    ...stock,
    exchange: stock.exchange || undefined,
    industry: stock.industry || undefined,
    description: stock.description || undefined,
  };
}

/**
 * Create a new stock
 */
export const createStock = async (data: CreateStockInput): Promise<StockData> => {
  const { symbol, name, exchange, industry, description } = data;

  // Check if stock with the symbol already exists
  const existingStock = await prisma.stock.findUnique({
    where: { symbol }
  });

  if (existingStock) {
    throw new BadRequestError(`A stock with symbol "${symbol}" already exists`);
  }

  // Create the stock
  const stock = await prisma.stock.create({
    data: {
      symbol,
      name,
      exchange,
      industry,
      description,
    }
  });

  return convertToStock(stock);
};

/**
 * Get stock by ID
 */
export const getStockById = async (id: string): Promise<StockData> => {
  const stock = await prisma.stock.findUnique({
    where: { id },
  });

  if (!stock) {
    throw new NotFoundError('Stock not found');
  }

  return convertToStock(stock);
};

/**
 * Get stock by symbol
 */
export const getStockBySymbol = async (symbol: string): Promise<StockData> => {
  const stock = await prisma.stock.findUnique({
    where: { symbol },
  });

  if (!stock) {
    throw new NotFoundError('Stock not found');
  }

  return convertToStock(stock);
};

/**
 * Get stock by symbol without throwing error if not found
 */
export const getStockBySymbolSafe = async (symbol: string): Promise<StockData | null> => {
  const stock = await prisma.stock.findUnique({
    where: { symbol },
  });

  if (!stock) {
    return null;
  }

  return convertToStock(stock);
};

/**
 * List stocks with pagination and filtering
 */
export const listStocks = async (params: StockListParams): Promise<StockListResult> => {
  const {
    page = 1,
    limit = 20,
    search = '',
    industry,
    exchange,
    sortBy = 'createdAt',
    sortDirection = 'desc'
  } = params;

  const skip = (page - 1) * limit;

  // Build search conditions
  const where: Prisma.StockWhereInput = {};

  // Add search condition if provided
  if (search) {
    where.OR = [
      { symbol: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
      { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } }
    ];
  }

  // Filter by industry if provided
  if (industry) {
    where.industry = { contains: industry, mode: 'insensitive' as Prisma.QueryMode };
  }

  // Filter by exchange if provided
  if (exchange) {
    where.exchange = { contains: exchange, mode: 'insensitive' as Prisma.QueryMode };
  }

  // Get total count
  const total = await prisma.stock.count({ where });

  // Get stocks
  const stocksResult = await prisma.stock.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortDirection },
  });

  // Convert to our type
  const stocks = stocksResult.map(convertToStock);

  return {
    stocks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Update a stock
 */
export const updateStock = async (id: string, data: UpdateStockInput): Promise<StockData> => {
  const { name, exchange, industry, description } = data;

  // Ensure stock exists
  const existingStock = await prisma.stock.findUnique({
    where: { id }
  });

  if (!existingStock) {
    throw new NotFoundError('Stock not found');
  }

  // Update the stock
  const stock = await prisma.stock.update({
    where: { id },
    data: {
      name: name !== undefined ? name : existingStock.name,
      exchange: exchange !== undefined ? exchange : existingStock.exchange,
      industry: industry !== undefined ? industry : existingStock.industry,
      description: description !== undefined ? description : existingStock.description,
    }
  });

  return convertToStock(stock);
};

/**
 * Update a stock by symbol
 */
export const updateStockBySymbol = async (symbol: string, data: UpdateStockInput): Promise<StockData> => {
  const { name, exchange, industry, description } = data;

  // Ensure stock exists
  const existingStock = await prisma.stock.findUnique({
    where: { symbol }
  });

  if (!existingStock) {
    throw new NotFoundError('Stock not found');
  }

  // Update the stock
  const stock = await prisma.stock.update({
    where: { symbol },
    data: {
      name: name !== undefined ? name : existingStock.name,
      exchange: exchange !== undefined ? exchange : existingStock.exchange,
      industry: industry !== undefined ? industry : existingStock.industry,
      description: description !== undefined ? description : existingStock.description,
    }
  });

  return convertToStock(stock);
};

/**
 * Delete a stock
 */
export const deleteStock = async (id: string): Promise<void> => {
  // Ensure stock exists
  const existingStock = await prisma.stock.findUnique({
    where: { id }
  });

  if (!existingStock) {
    throw new NotFoundError('Stock not found');
  }

  // Check for related records
  const relatedPrices = await prisma.stockPrice.count({
    where: { symbol: existingStock.symbol }
  });

  if (relatedPrices > 0) {
    throw new BadRequestError('Cannot delete stock with related price history');
  }

  // Delete the stock
  await prisma.stock.delete({
    where: { id }
  });
};

/**
 * Delete a stock by symbol
 */
export const deleteStockBySymbol = async (symbol: string): Promise<void> => {
  // Ensure stock exists
  const existingStock = await prisma.stock.findUnique({
    where: { symbol }
  });

  if (!existingStock) {
    throw new NotFoundError('Stock not found');
  }

  // Check for related records
  const relatedPrices = await prisma.stockPrice.count({
    where: { symbol }
  });

  if (relatedPrices > 0) {
    throw new BadRequestError('Cannot delete stock with related price history');
  }

  // Delete the stock
  await prisma.stock.delete({
    where: { symbol }
  });
};

/**
 * Get unique exchanges
 */
export const getUniqueExchanges = async (): Promise<string[]> => {
  const result = await prisma.stock.findMany({
    select: { exchange: true },
    where: { exchange: { not: null } },
    distinct: ['exchange'],
  });
  
  return result
    .map(item => item.exchange as string)
    .filter(Boolean)
    .sort();
};

/**
 * Get unique industries
 */
export const getUniqueIndustries = async (): Promise<string[]> => {
  const result = await prisma.stock.findMany({
    select: { industry: true },
    where: { industry: { not: null } },
    distinct: ['industry'],
  });
  
  return result
    .map(item => item.industry as string)
    .filter(Boolean)
    .sort();
};
