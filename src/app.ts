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

// Enable CORS - even if handled by Nginx, this ensures API works
// during development and acts as a fallback
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.set('trust proxy', 1);

app.use(apiRateLimiter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
