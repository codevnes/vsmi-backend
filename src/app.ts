import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorMiddleware, apiRateLimiter } from './middlewares';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const app = express();

// Create necessary directories
const uploadsDir = path.join(process.cwd(), 'uploads');
const tempDir = path.join(uploadsDir, 'temp');
const dataDir = path.join(process.cwd(), 'data', 'jobs');

// Ensure directories exist
[uploadsDir, tempDir, dataDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Log environment configuration for debugging
console.log('CORS Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  CORS_MODE: process.env.CORS_MODE || 'not set',
});

// CORS handling
// Set CORS_MODE to one of:
// - 'disabled' = No CORS headers from Express (for use behind Nginx/proxy that sets CORS)
// - 'development' = Allow all origins (*)
// - 'production' = Restrict to specific origin
const corsMode = process.env.CORS_MODE || 'disabled';

if (corsMode === 'development') {
  // Development mode - permissive CORS
  console.log('Setting up permissive CORS for development');
  app.use(cors());
} else if (corsMode === 'production') {
  // Production mode - restrictive CORS
  console.log('Setting up restrictive CORS for production');
  const origin = process.env.CORS_ORIGIN || 'https://admin.vsmi.vn';
  app.use(cors({
    origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
} else {
  // Disabled - no CORS headers from Express
  console.log('CORS headers disabled in Express (should be handled by proxy)');
}

app.use(express.json({ limit: '50mb' }));
app.set('trust proxy', 1);

app.use(apiRateLimiter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Add diagnostic route to check CORS settings (remove in production)
app.get('/api/v1/env-check', (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    corsMode: process.env.CORS_MODE, 
    corsOrigin: process.env.CORS_ORIGIN,
    headers: req.headers,
  });
});

app.use('/api/v1', routes);

// Try to load Swagger documentation if it exists
try {
  const swaggerPath = path.join(__dirname, '..', 'docs', 'swagger.yaml');
  if (fs.existsSync(swaggerPath)) {
    const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, 'utf8')) as any;
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
} catch (error) {
  console.warn('Could not load Swagger documentation:', error);
}

app.use(errorMiddleware);

export default app;
