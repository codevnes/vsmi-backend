export { default as prisma } from './database';

// Export environment variables for easier access
export const env = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  API_URL: process.env.API_URL || 'http://localhost:3001',
  // Add other environment variables as needed
};
