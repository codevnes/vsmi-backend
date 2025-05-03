import { PrismaClient } from "@prisma/client";
import { prisma } from '../config';
import * as xlsx from 'xlsx';
import fs from 'fs';
import { parse } from 'csv-parse';

export class StockProfileService {
  /**
   * Get all stock profiles
   */
  async getAllStockProfiles() {
    return prisma.stockProfile.findMany({
      orderBy: {
        symbol: 'asc'
      }
    });
  }

  /**
   * Get stock profile by id
   */
  async getStockProfileById(id: string) {
    return prisma.stockProfile.findUnique({
      where: { id }
    });
  }

  /**
   * Get stock profile by symbol
   */
  async getStockProfileBySymbol(symbol: string) {
    return prisma.stockProfile.findUnique({
      where: { symbol }
    });
  }

  /**
   * Create a new stock profile
   */
  async createStockProfile(data: {
    symbol: string;
    price?: number | null;
    profit?: number | null;
    volume?: number | null;
    pe?: number | null;
    eps?: number | null;
    roa?: number | null;
    roe?: number | null;
  }) {
    return prisma.stockProfile.create({
      data
    });
  }

  /**
   * Update a stock profile
   */
  async updateStockProfile(id: string, data: {
    price?: number | null;
    profit?: number | null;
    volume?: number | null;
    pe?: number | null;
    eps?: number | null;
    roa?: number | null;
    roe?: number | null;
  }) {
    return prisma.stockProfile.update({
      where: { id },
      data
    });
  }

  /**
   * Delete a stock profile
   */
  async deleteStockProfile(id: string) {
    return prisma.stockProfile.delete({
      where: { id }
    });
  }

  /**
   * Upsert a stock profile by symbol
   */
  async upsertStockProfile(symbol: string, data: {
    price?: number | null;
    profit?: number | null;
    volume?: number | null;
    pe?: number | null;
    eps?: number | null;
    roa?: number | null;
    roe?: number | null;
  }) {
    return prisma.stockProfile.upsert({
      where: { symbol },
      update: data,
      create: { ...data, symbol }
    });
  }

  /**
   * Get multiple stock profiles by symbols
   */
  async getStockProfilesBySymbols(symbols: string[]) {
    return prisma.stockProfile.findMany({
      where: {
        symbol: {
          in: symbols
        }
      }
    });
  }

  /**
   * Process CSV file and import stock profiles
   */
  async importFromCSV(filePath: string): Promise<{
    total: number;
    imported: number;
    failed: number;
    results: Array<{
      symbol: string;
      status: 'success' | 'failed';
      message: string;
      row?: number;
    }>;
  }> {
    try {
      const results = {
        total: 0,
        imported: 0,
        failed: 0,
        results: [] as Array<{
          symbol: string;
          status: 'success' | 'failed';
          message: string;
          row?: number;
        }>
      };

      // Read CSV file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Parse CSV
      const records: any[] = await new Promise((resolve, reject) => {
        parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        }, (err, records) => {
          if (err) reject(err);
          else resolve(records);
        });
      });
      
      results.total = records.length;

      // Import each record
      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        try {
          if (!record.symbol) {
            results.failed++;
            results.results.push({
              symbol: 'unknown',
              status: 'failed',
              message: 'Symbol is required',
              row: i + 2 // +2 because row 1 is header and we're 0-indexed
            });
            continue;
          }

          // Convert string values to numbers
          const profile = {
            price: record.price ? parseFloat(record.price) : null,
            profit: record.profit ? parseFloat(record.profit) : null,
            volume: record.volume ? parseFloat(record.volume) : null,
            pe: record.pe ? parseFloat(record.pe) : null,
            eps: record.eps ? parseFloat(record.eps) : null,
            roa: record.roa ? parseFloat(record.roa) : null,
            roe: record.roe ? parseFloat(record.roe) : null,
          };

          // Upsert the profile
          await this.upsertStockProfile(record.symbol, profile);

          results.imported++;
          results.results.push({
            symbol: record.symbol,
            status: 'success',
            message: 'Imported successfully',
            row: i + 2
          });
        } catch (error) {
          results.failed++;
          results.results.push({
            symbol: record.symbol || 'unknown',
            status: 'failed',
            message: (error as Error).message,
            row: i + 2
          });
        }
      }

      return results;
    } finally {
      // Clean up the file
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  }

  /**
   * Process Excel file and import stock profiles
   */
  async importFromExcel(filePath: string): Promise<{
    total: number;
    imported: number;
    failed: number;
    results: Array<{
      symbol: string;
      status: 'success' | 'failed';
      message: string;
      row?: number;
    }>;
  }> {
    try {
      const results = {
        total: 0,
        imported: 0,
        failed: 0,
        results: [] as Array<{
          symbol: string;
          status: 'success' | 'failed';
          message: string;
          row?: number;
        }>
      };

      // Read Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const records = xlsx.utils.sheet_to_json(worksheet);
      results.total = records.length;

      // Import each record
      for (let i = 0; i < records.length; i++) {
        const record = records[i] as any;
        try {
          if (!record.symbol) {
            results.failed++;
            results.results.push({
              symbol: 'unknown',
              status: 'failed',
              message: 'Symbol is required',
              row: i + 2 // +2 because row 1 is header and we're 0-indexed
            });
            continue;
          }

          // Convert any non-number values to numbers
          const profile = {
            price: typeof record.price === 'number' ? record.price : (record.price ? parseFloat(record.price) : null),
            profit: typeof record.profit === 'number' ? record.profit : (record.profit ? parseFloat(record.profit) : null),
            volume: typeof record.volume === 'number' ? record.volume : (record.volume ? parseFloat(record.volume) : null),
            pe: typeof record.pe === 'number' ? record.pe : (record.pe ? parseFloat(record.pe) : null),
            eps: typeof record.eps === 'number' ? record.eps : (record.eps ? parseFloat(record.eps) : null),
            roa: typeof record.roa === 'number' ? record.roa : (record.roa ? parseFloat(record.roa) : null),
            roe: typeof record.roe === 'number' ? record.roe : (record.roe ? parseFloat(record.roe) : null),
          };

          // Upsert the profile
          await this.upsertStockProfile(record.symbol, profile);

          results.imported++;
          results.results.push({
            symbol: record.symbol,
            status: 'success',
            message: 'Imported successfully',
            row: i + 2
          });
        } catch (error) {
          results.failed++;
          results.results.push({
            symbol: record.symbol || 'unknown',
            status: 'failed',
            message: (error as Error).message,
            row: i + 2
          });
        }
      }

      return results;
    } finally {
      // Clean up the file
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  }

  /**
   * Get full stock profile data with stock information
   * @returns Array of combined stock and profile data
   */
  async getFullProfiles() {
    return prisma.stock.findMany({
      select: {
        id: true,
        symbol: true,
        name: true,
        exchange: true,
        industry: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            price: true,
            profit: true,
            volume: true,
            pe: true,
            eps: true,
            roa: true,
            roe: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
      orderBy: {
        symbol: 'asc'
      }
    });
  }

  /**
   * Get full stock profile by symbol
   * @param symbol Stock symbol
   * @returns Combined stock and profile data
   */
  async getFullProfileBySymbol(symbol: string) {
    return prisma.stock.findUnique({
      where: { symbol },
      select: {
        id: true,
        symbol: true,
        name: true,
        exchange: true,
        industry: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            id: true,
            price: true,
            profit: true,
            volume: true,
            pe: true,
            eps: true,
            roa: true,
            roe: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });
  }
}

// Export an instance of the service
export const stockProfileService = new StockProfileService(); 