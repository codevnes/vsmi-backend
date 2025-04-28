import crypto from 'crypto';

/**
 * Hash a password using Node.js crypto (PBKDF2)
 * @param password plain text password
 * @returns hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');
    
    // Use PBKDF2 with 1000 iterations and SHA-512 hash
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) return reject(err);
      // Store salt and hash together
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
};

/**
 * Verify a password against a hash
 * @param password plain text password
 * @param storedHash stored hash from hashPassword
 * @returns whether the password matches the hash
 */
export const verifyPassword = async (
  password: string,
  storedHash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Extract salt and hash from stored value
    const [salt, hash] = storedHash.split(':');
    
    // Use same parameters as in hashPassword
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) return reject(err);
      resolve(hash === derivedKey.toString('hex'));
    });
  });
};

/**
 * Generate a random token
 * @param length token length
 * @returns random token
 */
export const generateRandomToken = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

/**
 * Mask a phone number
 * @param phone phone number to mask
 * @returns masked phone number
 */
export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if phone has enough digits to mask
  if (cleanPhone.length < 6) return cleanPhone;
  
  // Keep first 3 and last 2 digits, replace the rest with asterisks
  const firstPart = cleanPhone.slice(0, 3);
  const lastPart = cleanPhone.slice(-2);
  const middlePart = '*'.repeat(cleanPhone.length - 5);
  
  return `${firstPart}${middlePart}${lastPart}`;
};
