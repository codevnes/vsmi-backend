import { Role } from '@prisma/client';

/**
 * Stock data object
 */
export interface StockData {
  id: string;
  symbol: string;
  name: string;
  exchange?: string;
  industry?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a stock
 */
export interface CreateStockInput {
  symbol: string;
  name: string;
  exchange?: string;
  industry?: string;
  description?: string;
}

/**
 * Input for updating a stock
 */
export interface UpdateStockInput {
  name?: string;
  exchange?: string;
  industry?: string;
  description?: string;
}

/**
 * Parameters for listing stocks
 */
export interface StockListParams {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  exchange?: string;
  sortBy?: 'symbol' | 'name' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Result for listing stocks
 */
export interface StockListResult {
  stocks: StockData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Stock with related price data
 */
export interface StockWithPriceData extends StockData {
  stockPrices?: StockPriceData[];
}

/**
 * Stock price data object
 */
export interface StockPriceData {
  id: string;
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
  trendQ?: number;
  fq?: number;
  bandDown?: number;
  bandUp?: number;
  createdAt: Date;
  updatedAt: Date;
}
