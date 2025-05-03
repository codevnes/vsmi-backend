import { Request, Response } from 'express';
import { StockProfileService } from '../services/stockProfile.service';
import { logger } from '../utils/logger';
import path from 'path';

export class StockProfileController {
  private stockProfileService: StockProfileService;

  constructor() {
    this.stockProfileService = new StockProfileService();
  }

  /**
   * Get all stock profiles
   */
  getAllStockProfiles = async (req: Request, res: Response) => {
    try {
      const stockProfiles = await this.stockProfileService.getAllStockProfiles();
      return res.status(200).json({ success: true, data: stockProfiles });
    } catch (error) {
      logger.error('Error getting all stock profiles:', error);
      return res.status(500).json({ success: false, message: 'Failed to get stock profiles', error: (error as Error).message });
    }
  };

  /**
   * Get stock profile by id
   */
  getStockProfileById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const stockProfile = await this.stockProfileService.getStockProfileById(id);
      
      if (!stockProfile) {
        return res.status(404).json({ success: false, message: 'Stock profile not found' });
      }
      
      return res.status(200).json({ success: true, data: stockProfile });
    } catch (error) {
      logger.error(`Error getting stock profile with id ${req.params.id}:`, error);
      return res.status(500).json({ success: false, message: 'Failed to get stock profile', error: (error as Error).message });
    }
  };

  /**
   * Get stock profile by symbol
   */
  getStockProfileBySymbol = async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      const stockProfile = await this.stockProfileService.getStockProfileBySymbol(symbol);
      
      if (!stockProfile) {
        return res.status(404).json({ success: false, message: 'Stock profile not found' });
      }
      
      return res.status(200).json({ success: true, data: stockProfile });
    } catch (error) {
      logger.error(`Error getting stock profile with symbol ${req.params.symbol}:`, error);
      return res.status(500).json({ success: false, message: 'Failed to get stock profile', error: (error as Error).message });
    }
  };

  /**
   * Create a new stock profile
   */
  createStockProfile = async (req: Request, res: Response) => {
    try {
      const { symbol, price, profit, volume, pe, eps, roa, roe } = req.body;
      
      if (!symbol) {
        return res.status(400).json({ success: false, message: 'Symbol is required' });
      }
      
      const stockProfile = await this.stockProfileService.createStockProfile({
        symbol,
        price,
        profit,
        volume,
        pe,
        eps,
        roa,
        roe
      });
      
      return res.status(201).json({ success: true, data: stockProfile });
    } catch (error) {
      logger.error('Error creating stock profile:', error);
      
      // Handle duplicate key error
      if ((error as any).code === 'P2002') {
        return res.status(409).json({ success: false, message: 'Stock profile with this symbol already exists' });
      }
      
      return res.status(500).json({ success: false, message: 'Failed to create stock profile', error: (error as Error).message });
    }
  };

  /**
   * Update a stock profile
   */
  updateStockProfile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { price, profit, volume, pe, eps, roa, roe } = req.body;
      
      const stockProfile = await this.stockProfileService.updateStockProfile(id, {
        price,
        profit,
        volume,
        pe,
        eps,
        roa,
        roe
      });
      
      return res.status(200).json({ success: true, data: stockProfile });
    } catch (error) {
      logger.error(`Error updating stock profile with id ${req.params.id}:`, error);
      
      // Handle not found error
      if ((error as any).code === 'P2025') {
        return res.status(404).json({ success: false, message: 'Stock profile not found' });
      }
      
      return res.status(500).json({ success: false, message: 'Failed to update stock profile', error: (error as Error).message });
    }
  };

  /**
   * Delete a stock profile
   */
  deleteStockProfile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      await this.stockProfileService.deleteStockProfile(id);
      
      return res.status(200).json({ success: true, message: 'Stock profile deleted successfully' });
    } catch (error) {
      logger.error(`Error deleting stock profile with id ${req.params.id}:`, error);
      
      // Handle not found error
      if ((error as any).code === 'P2025') {
        return res.status(404).json({ success: false, message: 'Stock profile not found' });
      }
      
      return res.status(500).json({ success: false, message: 'Failed to delete stock profile', error: (error as Error).message });
    }
  };

  /**
   * Upsert a stock profile by symbol
   */
  upsertStockProfile = async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      const { price, profit, volume, pe, eps, roa, roe } = req.body;
      
      const stockProfile = await this.stockProfileService.upsertStockProfile(symbol, {
        price,
        profit,
        volume,
        pe,
        eps,
        roa,
        roe
      });
      
      return res.status(200).json({ success: true, data: stockProfile });
    } catch (error) {
      logger.error(`Error upserting stock profile with symbol ${req.params.symbol}:`, error);
      return res.status(500).json({ success: false, message: 'Failed to upsert stock profile', error: (error as Error).message });
    }
  };

  /**
   * Get multiple stock profiles by symbols
   */
  getStockProfilesBySymbols = async (req: Request, res: Response) => {
    try {
      const { symbols } = req.query;
      
      if (!symbols || !Array.isArray(symbols)) {
        return res.status(400).json({ success: false, message: 'Symbols array is required' });
      }
      
      const stockProfiles = await this.stockProfileService.getStockProfilesBySymbols(symbols as string[]);
      
      return res.status(200).json({ success: true, data: stockProfiles });
    } catch (error) {
      logger.error('Error getting stock profiles by symbols:', error);
      return res.status(500).json({ success: false, message: 'Failed to get stock profiles', error: (error as Error).message });
    }
  };

  /**
   * Import stock profiles from CSV or Excel file
   */
  importStockProfilesFromFile = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      let results;

      // Choose the appropriate import method based on file extension
      if (fileExtension === '.csv') {
        results = await this.stockProfileService.importFromCSV(req.file.path);
      } else if (['.xls', '.xlsx'].includes(fileExtension)) {
        results = await this.stockProfileService.importFromExcel(req.file.path);
      } else {
        return res.status(400).json({ 
          success: false, 
          message: 'Unsupported file format. Please upload a CSV, XLS, or XLSX file.' 
        });
      }

      const message = results.failed > 0 
        ? 'Some stock profiles could not be imported' 
        : 'Stock profiles imported successfully';
      
      return res.status(200).json({ 
        success: true, 
        data: results, 
        message 
      });
    } catch (error) {
      logger.error('Error importing stock profiles from file:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to import stock profiles from file', 
        error: (error as Error).message 
      });
    }
  };

  /**
   * Get full stock profiles data with stock information
   */
  getFullProfiles = async (req: Request, res: Response) => {
    try {
      const fullProfiles = await this.stockProfileService.getFullProfiles();
      return res.status(200).json({ success: true, data: fullProfiles });
    } catch (error) {
      logger.error('Error getting full stock profiles:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get full stock profiles', 
        error: (error as Error).message 
      });
    }
  };

  /**
   * Get full stock profile by symbol
   */
  getFullProfileBySymbol = async (req: Request, res: Response) => {
    try {
      const { symbol } = req.params;
      
      const fullProfile = await this.stockProfileService.getFullProfileBySymbol(symbol);
      
      if (!fullProfile) {
        return res.status(404).json({ success: false, message: 'Stock profile not found' });
      }
      
      return res.status(200).json({ success: true, data: fullProfile });
    } catch (error) {
      logger.error(`Error getting full stock profile for symbol ${req.params.symbol}:`, error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get full stock profile', 
        error: (error as Error).message 
      });
    }
  };
} 