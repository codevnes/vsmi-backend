import { logger } from '../utils/logger';
import { prisma } from '../config';

/**
 * Checks the database connection and provides initialization utilities
 */
export const databaseService = {
  /**
   * Check if the database connection is working
   * @returns True if connected, false otherwise
   */
  async checkConnection(): Promise<boolean> {
    try {
      // Try a simple query to verify connection
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database connection check failed:', error);
      return false;
    }
  },

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    try {
      await prisma.$disconnect();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
    }
  },

  /**
   * Get database connection status and information
   * @returns Database information
   */
  async getStatus(): Promise<{
    connected: boolean;
    provider: string;
    url: string | null;
  }> {
    const connected = await this.checkConnection();
    const url = process.env.DATABASE_URL || null;
    let safeUrl = null;
    
    // Create a safe URL without credentials for logging/display
    if (url) {
      try {
        const urlObj = new URL(url);
        urlObj.password = '****';
        safeUrl = urlObj.toString();
      } catch {
        safeUrl = 'Invalid database URL format';
      }
    }

    return {
      connected,
      provider: 'postgresql',
      url: safeUrl,
    };
  },

  /**
   * Log database connection errors in a friendly format
   * @param error Error to log
   */
  logConnectionError(error: any): void {
    if (!error) return;

    const message = error.message || 'Unknown database error';
    logger.error(`Database connection error: ${message}`);

    // Check for common errors and provide helpful messages
    if (message.includes('does not exist')) {
      logger.info('Please create the database or check your DATABASE_URL in .env file');
      logger.info('See DATABASE_SETUP.md for instructions');
    } else if (message.includes('ECONNREFUSED')) {
      logger.info('Could not connect to PostgreSQL server. Make sure it is running.');
    } else if (message.includes('password authentication failed')) {
      logger.info('Database credentials are incorrect. Check your DATABASE_URL in .env file');
    }
  }
};

// Export a function to initialize the database connection
export const initDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
    
    // Output some helpful information
    const status = await databaseService.getStatus();
    logger.info(`Connected to ${status.provider} database at ${status.url || 'unknown URL'}`);
  } catch (error) {
    databaseService.logConnectionError(error);
  }
};

// Initialize on import
initDatabase().catch(error => {
  logger.error('Failed to initialize database on startup', error);
}); 