import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    console.warn('[EncryptionService] ENCRYPTION_KEY not set, using derived key from secrets');
    const fallback = process.env.DB_PASSWORD || process.env.JWT_SECRET || 'default-dev-key';
    return crypto.pbkdf2Sync(fallback, 'whitecaves-salt', ITERATIONS, KEY_LENGTH, 'sha256');
  }
  if (key.length === 64) {
    return Buffer.from(key, 'hex');
  }
  return crypto.pbkdf2Sync(key, 'whitecaves-salt', ITERATIONS, KEY_LENGTH, 'sha256');
};

export const encrypt = (plaintext) => {
  if (!plaintext) return null;
  
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('[EncryptionService] Encryption error:', error.message);
    throw new Error('Encryption failed');
  }
};

export const decrypt = (ciphertext) => {
  if (!ciphertext) return null;
  
  try {
    const parts = ciphertext.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid ciphertext format');
    }
    
    const [ivHex, authTagHex, encrypted] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('[EncryptionService] Decryption error:', error.message);
    throw new Error('Decryption failed');
  }
};

export const encryptObject = (obj, fieldsToEncrypt) => {
  if (!obj || !fieldsToEncrypt || !Array.isArray(fieldsToEncrypt)) return obj;
  
  const encrypted = { ...obj };
  
  for (const field of fieldsToEncrypt) {
    if (encrypted[field] !== undefined && encrypted[field] !== null) {
      encrypted[field] = encrypt(String(encrypted[field]));
    }
  }
  
  return encrypted;
};

export const decryptObject = (obj, fieldsToDecrypt) => {
  if (!obj || !fieldsToDecrypt || !Array.isArray(fieldsToDecrypt)) return obj;
  
  const decrypted = { ...obj };
  
  for (const field of fieldsToDecrypt) {
    if (decrypted[field] && typeof decrypted[field] === 'string' && decrypted[field].includes(':')) {
      try {
        decrypted[field] = decrypt(decrypted[field]);
      } catch (e) {
        console.warn(`[EncryptionService] Could not decrypt field: ${field}`);
      }
    }
  }
  
  return decrypted;
};

export const hashValue = (value, salt = null) => {
  const useSalt = salt || crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.pbkdf2Sync(value, useSalt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex');
  return `${useSalt}:${hash}`;
};

export const verifyHash = (value, storedHash) => {
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto.pbkdf2Sync(value, salt, ITERATIONS, KEY_LENGTH, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(originalHash));
};

export const maskValue = (value, visibleChars = 4, maskChar = '*') => {
  if (!value || value.length <= visibleChars) return value;
  const visible = value.slice(-visibleChars);
  const masked = maskChar.repeat(Math.min(value.length - visibleChars, 10));
  return masked + visible;
};

export const maskEmiratesId = (emiratesId) => {
  if (!emiratesId) return null;
  const parts = emiratesId.split('-');
  if (parts.length !== 4) return maskValue(emiratesId);
  return `${parts[0]}-****-*******-${parts[3]}`;
};

export const maskPassportNumber = (passport) => {
  if (!passport || passport.length < 3) return passport;
  return passport.slice(0, 2) + '*'.repeat(passport.length - 3) + passport.slice(-1);
};

export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

const SENSITIVE_FIELDS = [
  'emiratesIdNumber',
  'passportNumber',
  'bankAccountNumber',
  'sourceOfFunds',
  'occupation',
  'employerName',
  'annualIncome'
];

export const encryptKYCData = (data) => {
  return encryptObject(data, SENSITIVE_FIELDS);
};

export const decryptKYCData = (data) => {
  return decryptObject(data, SENSITIVE_FIELDS);
};

export default {
  encrypt,
  decrypt,
  encryptObject,
  decryptObject,
  hashValue,
  verifyHash,
  maskValue,
  maskEmiratesId,
  maskPassportNumber,
  generateSecureToken,
  encryptKYCData,
  decryptKYCData,
  SENSITIVE_FIELDS
};
