import app from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global unhandled rejection handler
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  logger.error('Unhandled Promise Rejection', {
    error: {
      name: reason?.name || 'UnknownError',
      message: reason?.message || String(reason),
      stack: reason?.stack
    },
    rejection: true
  });
  
  // In development, show the full error
  if (process.env.NODE_ENV !== 'production') {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(reason);
  }
  
  // In a real production scenario, you might want to:
  // 1. Log the error to a monitoring service
  // 2. Gracefully shut down to prevent hanging processes
  // 3. Notify operations team
  
  // Optional: graceful shutdown
  // process.exit(1);
});

// Global uncaught exception handler
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception', {
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    },
    uncaught: true
  });
  
  if (process.env.NODE_ENV !== 'production') {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err);
  }
  
  // For uncaught exceptions, it's usually best to exit and let a process manager restart
  // since the application might be in an unstable state
  process.exit(1);
});
