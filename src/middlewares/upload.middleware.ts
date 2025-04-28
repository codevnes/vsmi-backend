import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../utils/error';

// Ensure upload directories exist
const originalDir = path.join(process.cwd(), 'uploads', 'original');
const processedDir = path.join(process.cwd(), 'uploads', 'processed');

// Create directories if they don't exist
[originalDir, processedDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, originalDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with UUID to prevent collisions
    const uniqueFilename = `${uuidv4()}_${path.parse(file.originalname).name}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Check file type
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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

// File size limits
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB limit
};

// Create the multer upload instance
export const upload = multer({
  storage,
  fileFilter,
  limits,
});

// Export a single file upload middleware
export const uploadSingleImage = upload.single('image');

// Export a multiple file upload middleware
export const uploadMultipleImages = upload.array('images', 10); // Max 10 images at once 