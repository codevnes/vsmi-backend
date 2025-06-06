import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Declare global variable for PrismaClient
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a custom URL that uses a known database like 'postgres' which always exists
// This will be used as a fallback if the database in DATABASE_URL doesn't exist
const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  
  if (!envUrl) {
    logger.warn('DATABASE_URL not found in environment. Using default connection to postgres database.');
    return 'postgresql://postgres:postgres@localhost:5432/postgres';
  }
  
  // Use the provided DATABASE_URL but be prepared to handle connection errors
  return envUrl;
};

// Use a single PrismaClient instance throughout the application lifecycle
const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    }
  },
  log: ['error'],
});

// Add connection error handling
prisma.$connect()
  .then(() => {
    logger.info('Database connected successfully');
  })
  .catch((error: Error) => {
    logger.error('Database connection error:', error);
    
    // If the error is about database not existing, suggest creating it
    if (error.message && error.message.includes('does not exist on the database server')) {
      logger.error('Please create the database or update DATABASE_URL in .env file');
      logger.info('You can create the database using: npx prisma db push');
    }
  });

// In development, save the instance to global to prevent multiple instances during hot reload
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Handle application shutdown - ensure connections are closed
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
