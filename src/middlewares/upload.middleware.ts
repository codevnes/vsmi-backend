import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../utils/error';

// Ensure upload directories exist
const originalDir = path.join(process.cwd(), 'uploads', 'original');
const processedDir = path.join(process.cwd(), 'uploads', 'processed');
const documentsDir = path.join(process.cwd(), 'uploads', 'documents');

// Create directories if they don't exist
[originalDir, processedDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Set storage engine for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, originalDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with UUID to prevent collisions
    const uniqueFilename = `${uuidv4()}_${path.parse(file.originalname).name}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Set storage engine for document files (CSV, Excel)
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with UUID to prevent collisions
    const uniqueFilename = `${uuidv4()}_${path.parse(file.originalname).name}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Check file type for images
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Define allowed file types
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`Unsupported file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
  }
};

// Check file type for document files
const documentFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Define allowed file types
  const allowedMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/octet-stream' // For .csv files that might be detected as octet-stream
  ];
  
  const allowedExtensions = ['.csv', '.xls', '.xlsx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`Unsupported file type. Allowed types: CSV, XLS, XLSX`));
  }
};

// File size limits
const imageLimits = {
  fileSize: 5 * 1024 * 1024, // 5MB limit for images
};

const documentLimits = {
  fileSize: 10 * 1024 * 1024, // 10MB limit for documents
};

// Create the multer upload instances
export const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: imageLimits,
});

export const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: documentLimits,
});

// Export a single file upload middleware
export const uploadSingleImage = imageUpload.single('image');

// Export a multiple file upload middleware
export const uploadMultipleImages = imageUpload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'files', maxCount: 10 },
  { name: 'image', maxCount: 10 },
  { name: 'file', maxCount: 10 },
  { name: 'uploads', maxCount: 10 }
]); // Accept common field names with max 10 images at once

// Export document upload middlewares
export const uploadCSV = documentUpload.single('file');
export const uploadExcel = documentUpload.single('file'); 