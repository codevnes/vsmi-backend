import { Request, Response } from 'express';
import { SettingService } from '../services/setting.service';
import { logger } from '../utils/logger';

const settingService = new SettingService();

/**
 * Get all settings
 * @param req Request
 * @param res Response
 */
export const getAllSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await settingService.getAllSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    logger.error('Error getting all settings:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve settings' });
  }
};

/**
 * Get settings by group
 * @param req Request with group parameter
 * @param res Response
 */
export const getSettingsByGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { group } = req.params;
    
    if (!group) {
      res.status(400).json({ success: false, message: 'Group parameter is required' });
      return;
    }

    const settings = await settingService.getSettingsByGroup(group);
    res.json({ success: true, data: settings });
  } catch (error) {
    logger.error(`Error getting settings for group ${req.params.group}:`, error);
    res.status(500).json({ success: false, message: 'Failed to retrieve settings' });
  }
};

/**
 * Get setting by key
 * @param req Request with key parameter
 * @param res Response
 */
export const getSettingByKey = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    
    if (!key) {
      res.status(400).json({ success: false, message: 'Key parameter is required' });
      return;
    }

    const setting = await settingService.getSettingByKey(key);
    
    if (!setting) {
      res.status(404).json({ success: false, message: `Setting with key ${key} not found` });
      return;
    }

    res.json({ success: true, data: setting });
  } catch (error) {
    logger.error(`Error getting setting with key ${req.params.key}:`, error);
    res.status(500).json({ success: false, message: 'Failed to retrieve setting' });
  }
};

/**
 * Create a new setting
 * @param req Request with setting data
 * @param res Response
 */
export const createSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, value, description, type } = req.body;
    
    // Validate required fields
    if (!key || value === undefined || value === null) {
      res.status(400).json({
        success: false,
        message: 'Key and value are required fields'
      });
      return;
    }

    // Check if key already exists
    const existing = await settingService.getSettingByKey(key);
    if (existing) {
      res.status(409).json({
        success: false,
        message: `Setting with key '${key}' already exists. Use PUT to update.`
      });
      return;
    }

    // Validate type if provided
    if (type && !['text', 'number', 'boolean', 'json', 'image'].includes(type)) {
      res.status(400).json({
        success: false,
        message: "Type must be one of: 'text', 'number', 'boolean', 'json', or 'image'"
      });
      return;
    }

    const setting = await settingService.createSetting({
      key,
      value: String(value),
      description,
      type: type as any
    });

    res.status(201).json({ success: true, data: setting });
  } catch (error) {
    logger.error('Error creating setting:', error);
    res.status(500).json({ success: false, message: 'Failed to create setting' });
  }
};

/**
 * Update an existing setting
 * @param req Request with setting data
 * @param res Response
 */
export const updateSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    const { value, description, type } = req.body;
    
    if (!key) {
      res.status(400).json({ success: false, message: 'Key parameter is required' });
      return;
    }

    // Validate required fields
    if (value === undefined || value === null) {
      res.status(400).json({
        success: false,
        message: 'Value is required for updating a setting'
      });
      return;
    }

    // Validate type if provided
    if (type && !['text', 'number', 'boolean', 'json', 'image'].includes(type)) {
      res.status(400).json({
        success: false,
        message: "Type must be one of: 'text', 'number', 'boolean', 'json', or 'image'"
      });
      return;
    }

    // Check if setting exists
    const existing = await settingService.getSettingByKey(key);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: `Setting with key '${key}' not found`
      });
      return;
    }

    const updated = await settingService.updateSetting(key, {
      value: String(value),
      description,
      type: type as any
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    logger.error(`Error updating setting with key ${req.params.key}:`, error);
    res.status(500).json({ success: false, message: 'Failed to update setting' });
  }
};

/**
 * Delete a setting
 * @param req Request with key parameter
 * @param res Response
 */
export const deleteSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.params;
    
    if (!key) {
      res.status(400).json({ success: false, message: 'Key parameter is required' });
      return;
    }

    // Check if setting exists
    const existing = await settingService.getSettingByKey(key);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: `Setting with key '${key}' not found`
      });
      return;
    }

    await settingService.deleteSetting(key);
    res.json({ success: true, message: `Setting with key '${key}' deleted successfully` });
  } catch (error) {
    logger.error(`Error deleting setting with key ${req.params.key}:`, error);
    res.status(500).json({ success: false, message: 'Failed to delete setting' });
  }
};

/**
 * Upsert a setting (create if not exists, update if exists)
 * @param req Request with setting data
 * @param res Response
 */
export const upsertSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, value, description, type } = req.body;
    
    // Validate required fields
    if (!key || value === undefined || value === null) {
      res.status(400).json({
        success: false,
        message: 'Key and value are required fields'
      });
      return;
    }

    // Validate type if provided
    if (type && !['text', 'number', 'boolean', 'json', 'image'].includes(type)) {
      res.status(400).json({
        success: false,
        message: "Type must be one of: 'text', 'number', 'boolean', 'json', or 'image'"
      });
      return;
    }

    const setting = await settingService.upsertSetting({
      key,
      value: String(value),
      description,
      type: type as any
    });

    res.json({ success: true, data: setting });
  } catch (error) {
    logger.error('Error upserting setting:', error);
    res.status(500).json({ success: false, message: 'Failed to upsert setting' });
  }
};

/**
 * Bulk upsert settings
 * @param req Request with array of settings
 * @param res Response
 */
export const bulkUpsertSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { settings } = req.body;
    
    if (!Array.isArray(settings) || settings.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Request must include a non-empty array of settings'
      });
      return;
    }

    // Validate each setting
    for (const setting of settings) {
      if (!setting.key || setting.value === undefined || setting.value === null) {
        res.status(400).json({
          success: false,
          message: 'Each setting must have a key and value'
        });
        return;
      }

      if (setting.type && !['text', 'number', 'boolean', 'json', 'image'].includes(setting.type)) {
        res.status(400).json({
          success: false,
          message: "Type must be one of: 'text', 'number', 'boolean', 'json', or 'image'"
        });
        return;
      }
    }

    const result = await settingService.bulkUpsertSettings(settings.map((s: any) => ({
      key: s.key,
      value: String(s.value),
      description: s.description,
      type: s.type
    })));

    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error bulk upserting settings:', error);
    res.status(500).json({ success: false, message: 'Failed to bulk upsert settings' });
  }
};
