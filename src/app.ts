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

// NOTE: CORS handling is completely disabled in Express in production
// because it's being handled by Nginx
// In development, we enable CORS to allow localhost connections
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', /\.vsmi\.vn$/],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
}

// Ensure CORS headers are present for OPTIONS requests (preflight)
app.options('*', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    const origin = req.headers.origin;
    if (origin && (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000' || /\.vsmi\.vn$/.test(origin))) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).send();
  } else {
    res.status(204).send();
  }
});

app.use(express.json({ limit: '50mb' }));
app.set('trust proxy', 1);

app.use(apiRateLimiter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Add diagnostic route to check CORS settings (remove in production)
app.get('/api/v1/env-check', (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    message: process.env.NODE_ENV === 'production' 
      ? 'CORS is handled by Nginx, not Express' 
      : 'CORS is handled by Express for local development',
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
