import { Setting } from '@prisma/client';
import { prisma } from '../config';

type SettingType = 'text' | 'number' | 'boolean' | 'json' | 'image';

interface SettingInput {
  key: string;
  value: string;
  description?: string;
  type?: SettingType;
}

interface SettingUpdateInput {
  value: string;
  description?: string;
  type?: SettingType;
}

export class SettingService {
  // Get all settings
  async getAllSettings(): Promise<Setting[]> {
    return prisma.setting.findMany({
      orderBy: { key: 'asc' }
    });
  }

  // Get settings by group (using key prefix)
  async getSettingsByGroup(group: string): Promise<Setting[]> {
    return prisma.setting.findMany({
      where: {
        key: {
          startsWith: `${group}.`
        }
      },
      orderBy: { key: 'asc' }
    });
  }

  // Get a single setting by key
  async getSettingByKey(key: string): Promise<Setting | null> {
    return prisma.setting.findUnique({
      where: { key }
    });
  }

  // Get multiple settings by keys
  async getSettingsByKeys(keys: string[]): Promise<Setting[]> {
    return prisma.setting.findMany({
      where: {
        key: {
          in: keys
        }
      }
    });
  }

  // Create a new setting
  async createSetting(data: SettingInput): Promise<Setting> {
    return prisma.setting.create({
      data: {
        key: data.key,
        value: data.value,
        description: data.description,
        type: data.type || 'text'
      }
    });
  }

  // Update a setting by key
  async updateSetting(key: string, data: SettingUpdateInput): Promise<Setting> {
    // Increment the version when updating
    const currentSetting = await prisma.setting.findUnique({
      where: { key }
    });

    if (!currentSetting) {
      throw new Error(`Setting with key ${key} not found`);
    }

    return prisma.setting.update({
      where: { key },
      data: {
        value: data.value,
        description: data.description,
        type: data.type,
        version: currentSetting.version + 1
      }
    });
  }

  // Delete a setting
  async deleteSetting(key: string): Promise<Setting> {
    return prisma.setting.delete({
      where: { key }
    });
  }

  // Upsert a setting (create if not exists, update if exists)
  async upsertSetting(data: SettingInput): Promise<Setting> {
    const existing = await prisma.setting.findUnique({
      where: { key: data.key }
    });

    if (existing) {
      return this.updateSetting(data.key, {
        value: data.value,
        description: data.description,
        type: data.type
      });
    } else {
      return this.createSetting(data);
    }
  }

  // Bulk upsert settings
  async bulkUpsertSettings(settings: SettingInput[]): Promise<Setting[]> {
    const results: Setting[] = [];
    
    for (const setting of settings) {
      const result = await this.upsertSetting(setting);
      results.push(result);
    }
    
    return results;
  }

  // Helper to validate and parse setting values based on their type
  validateAndParseValue(setting: Setting): any {
    try {
      switch (setting.type) {
        case 'number':
          return parseFloat(setting.value);
        case 'boolean':
          return setting.value.toLowerCase() === 'true';
        case 'json':
          return JSON.parse(setting.value);
        case 'text':
        case 'image':
        default:
          return setting.value;
      }
    } catch (error) {
      console.error(`Error parsing setting ${setting.key} with type ${setting.type}:`, error);
      return setting.value; // Return raw value if parsing fails
    }
  }

  // Get parsed setting value by key
  async getSettingValue(key: string, defaultValue: any = null): Promise<any> {
    const setting = await this.getSettingByKey(key);
    
    if (!setting) {
      return defaultValue;
    }
    
    return this.validateAndParseValue(setting);
  }
}
