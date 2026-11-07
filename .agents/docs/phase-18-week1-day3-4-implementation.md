# Phase 18 Week 1, Day 3-4: Security Implementation
## Critical Vulnerabilities & Hardening Measures

**Date:** March 9-10, 2026  
**Phase:** 18 (Production Hardening)  
**Week:** 1 of 4  
**Days:** 3-4 (Implementation)  
**Status:** 🚀 READY TO EXECUTE

---

## 📋 Objective

Execute **4 critical security hardening measures** to address HIGH and MEDIUM severity vulnerabilities identified in Days 1-2 assessment.

### Priority Tasks (40 estimated hours)

```
Task 1: File Upload Security (xlsx validation)      [4 hours]
Task 2: Rate Limiting Implementation                [3 hours]
Task 3: Security Headers (Helmet)                   [2 hours]
Task 4: Logging Infrastructure (Winston)           [4 hours]
Task 5: Testing & Validation                       [2 hours]
                                    ─────────────────
                                    TOTAL: 15 hours Day 3-4
```

---

## 🎯 Task 1: xlsx File Upload Security (4 hours)

### Risk
```
Severity: HIGH (7/10)
Package: xlsx
CVEs: Prototype Pollution, ReDoS
Impact: Malicious file uploads could bypass validation
```

### Implementation Steps

#### Step 1.1: Install Validation Libraries
```powershell
cd "c:\Users\HP\Downloads\White Caves\White Caves Web App\White-Caves"
npm install --save file-type file-size file-extension --legacy-peer-deps
```

The `file-type` package will detect actual file type (not just extension).

#### Step 1.2: Create Upload Validator
```typescript
// src/utils/fileValidator.ts
import { fileTypeFromBuffer, fileTypeFromFile } from 'file-type';
import fs from 'fs';
import path from 'path';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  fileType?: string;
}

// Whitelist of allowed MIME types for file uploads
const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'text/csv': ['.csv'],
  // Add more as needed
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function validateUploadedFile(
  filePath: string,
  requestedFileName: string
): Promise<FileValidationResult> {
  try {
    // Check file exists
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'File not found' };
    }

    // Check file size
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File exceeds maximum size (10MB)' };
    }

    // Detect actual file type from content
    const fileType = await fileTypeFromFile(filePath);
    
    if (!fileType) {
      return { valid: false, error: 'Unable to determine file type' };
    }

    // Check if MIME type is allowed
    if (!Object.keys(ALLOWED_MIME_TYPES).includes(fileType.mime)) {
      return { 
        valid: false, 
        error: `File type ${fileType.mime} is not allowed` 
      };
    }

    // Verify filename extension matches actual file type
    const fileExtension = path.extname(requestedFileName).toLowerCase();
    const allowedExtensions = ALLOWED_MIME_TYPES[fileType.mime as keyof typeof ALLOWED_MIME_TYPES];
    
    if (!allowedExtensions.includes(fileExtension)) {
      return { 
        valid: false, 
        error: 'File extension does not match actual file type' 
      };
    }

    // For xlsx files specifically: implement additional validation
    if (fileType.mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return validateXlsxFile(filePath);
    }

    return { valid: true, fileType: fileType.mime };
  } catch (error) {
    return { 
      valid: false, 
      error: `File validation failed: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

/**
 * Additional validation specifically for xlsx files
 * Protects against xlsx package vulnerabilities
 */
function validateXlsxFile(filePath: string): FileValidationResult {
  try {
    // Limits for xlsx parsing protection
    const MAX_SHEETS = 100;
    const MAX_ROWS_PER_SHEET = 100000;
    const MAX_COLUMNS_PER_SHEET = 1000;

    // Read file as buffer to check header signature (not actually parse with vulnerable parser)
    const buffer = fs.readFileSync(filePath);
    
    // XLSX files are ZIP archives with signature
    const ZIP_SIGNATURE = Buffer.from([0x50, 0x4b, 0x03, 0x04]); // 'PK\x03\x04'
    if (!buffer.slice(0, 4).equals(ZIP_SIGNATURE)) {
      return { valid: false, error: 'Invalid XLSX file format (not a valid ZIP archive)' };
    }

    // Additional checks (DO NOT use vulnerable xlsx parser here)
    // Just verify archive integrity and structure
    
    return { valid: true, fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
  } catch (error) {
    return { 
      valid: false, 
      error: `XLSX validation failed: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

export function sanitizeFileName(fileName: string): string {
  // Remove any path traversal attempts
  return path.basename(fileName);
}
```

#### Step 1.3: Update File Upload Endpoint
```typescript
// src/api/routes/upload.ts (or wherever file uploads are handled)
import express, { Request, Response } from 'express';
import multer from 'multer';
import { validateUploadedFile, sanitizeFileName } from '../utils/fileValidator';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const upload = multer({ 
  dest: '/tmp/uploads',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

/**
 * POST /api/upload
 * Upload file with security validation
 */
router.post('/upload', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Sanitize filename
    const sanitizedFileName = sanitizeFileName(req.file.originalname);

    // Validate file
    const validation = await validateUploadedFile(req.file.path, sanitizedFileName);
    
    if (!validation.valid) {
      // Clean up temp file
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: validation.error });
    }

    // File is valid, proceed with storage
    // Move to permanent storage, generate unique ID, etc.
    const fileId = generateUUID();
    const storagePath = `/uploads/${fileId}/${sanitizedFileName}`;
    
    // TODO: Move file from /tmp to permanent storage
    
    res.json({
      success: true,
      fileId,
      fileName: sanitizedFileName,
      fileType: validation.fileType,
      size: req.file.size,
      uploadedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'File upload failed',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
});

export default router;
```

#### Step 1.4: Add Tests for File Validation
```typescript
// src/__tests__/fileValidator.test.ts
import { validateUploadedFile } from '../utils/fileValidator';
import fs from 'fs';
import path from 'path';

describe('File Validators', () => {
  it('should reject files larger than 10MB', () => {
    // Test implementation
  });

  it('should reject files with mismatched extensions', () => {
    // Test implementation
  });

  it('should accept valid image files', () => {
    // Test implementation
  });

  it('should reject invalid xlsx files (ZIP signature check)', () => {
    // Test implementation
  });

  it('should sanitize filenames with path traversal', () => {
    // Test implementation
  });
});
```

#### Step 1.5: Configuration
```env
# .env.security
UPLOAD_MAX_SIZE=10485760  # 10MB
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/webp,application/pdf,text/csv
UPLOAD_TEMP_DIR=/tmp/uploads
UPLOAD_STORAGE_DIR=/var/uploads
```

---

## 🎯 Task 2: Rate Limiting Implementation (3 hours)

### Risk
```
Severity: MEDIUM (6/10)
Issue: No rate limiting on API endpoints
Impact: Brute force attacks, DoS attacks possible
```

### Implementation Steps

#### Step 2.1: Install Rate Limiting Package
```powershell
npm install express-rate-limit --legacy-peer-deps
npm install @types/express-rate-limit --save-dev --legacy-peer-deps
```

#### Step 2.2: Create Rate Limiter Middleware
```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

// Default rate limiters
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true, // don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 API calls per minute
  message: 'API rate limit exceeded, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // very strict for sensitive operations
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Redis-backed rate limiter for distributed systems
let redisClient: ReturnType<typeof createClient> | null = null;

export async function createRedisLimiter() {
  if (!redisClient) {
    redisClient = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
    await redisClient.connect();
  }

  return rateLimit({
    store: new RedisStore({
      client: redisClient,
      prefix: 'rate-limit:',
    }),
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
}
```

#### Step 2.3: Update Express Routes
```typescript
// src/api/routes/auth.ts
import express from 'express';
import { authLimiter } from '../middleware/rateLimiter';
import { login, register } from '../controllers/authController';

const router = express.Router();

// Apply auth limiter to login endpoint
router.post('/login', authLimiter, login);
router.post('/register', authLimiter, register);

export default router;
```

```typescript
// src/api/routes/commission.ts
import express from 'express';
import { apiLimiter, strictLimiter } from '../middleware/rateLimiter';
import { getCommissions, createCommission } from '../controllers/commissionController';

const router = express.Router();

// General API rate limit for read operations
router.get('/', apiLimiter, getCommissions);

// Strict limit for write operations
router.post('/', strictLimiter, createCommission);

export default router;
```

```typescript
// src/api/server.ts (main Express app)
import { generalLimiter, authLimiter } from './middleware/rateLimiter';

app.use(generalLimiter); // Apply general limiter to all routes
app.use('/auth', authLimiter); // More strict for auth
```

#### Step 2.4: Add Rate Limiter Configuration
```typescript
// src/config/rateLimiter.ts
export const RATE_LIMIT_CONFIG = {
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts',
  },
  api: {
    windowMs: 60 * 1000,
    max: 30,
    message: 'API rate limit exceeded',
  },
  general: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests',
  },
  strict: {
    windowMs: 60 * 1000,
    max: 3,
    message: 'Too many requests',
  },
};
```

#### Step 2.5: Tests for Rate Limiting
```typescript
// src/__tests__/rateLimiter.test.ts
import request from 'supertest';
import app from '../api/server';

describe('Rate Limiting', () => {
  it('should limit login attempts', async () => {
    for (let i = 0; i < 6; i++) {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });
      
      if (i < 5) {
        expect(response.status).toBe(401); // Unauthorized (wrong password)
      } else {
        expect(response.status).toBe(429); // Too Many Requests
      }
    }
  });

  it('should allow requests under rate limit', async () => {
    const response = await request(app)
      .get('/api/commissions')
      .set('Authorization', 'Bearer valid-token');
    
    expect(response.status).not.toBe(429);
  });
});
```

---

## 🎯 Task 3: Security Headers with Helmet (2 hours)

### Risk
```
Severity: MEDIUM (6/10)
Issue: Missing security headers
Impact: Vulnerable to clickjacking, XSS, etc.
```

### Implementation Steps

#### Step 3.1: Install Helmet
```powershell
npm install helmet --legacy-peer-deps
```

#### Step 3.2: Configure Security Headers
```typescript
// src/api/middleware/securityHeaders.ts
import helmet from 'helmet';

/**
 * Comprehensive security headers configuration
 */
export function securityHeadersMiddleware(): ReturnType<typeof helmet> {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // TODO: Remove after moving to inline scripts
          'https://cdn.jsdelivr.net',
          'https://unpkg.com',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", 'https:'],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        childSrc: ["'self'"],
      },
    },
    // Prevent clickjacking attacks
    frameguard: {
      action: 'deny',
    },
    // Prevent MIME type sniffing
    noSniff: true,
    // Enable XSS protection in older browsers
    xssFilter: true,
    // Ensure HTTPS
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    // Prevent referrer information leakage
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
    // Prevent using browser features not needed
    permissionsPolicy: {
      features: {
        geolocation: ["'none'"],
        microphone: ["'none'"],
        camera: ["'none'"],
        payment: ["'none'"],
      },
    },
  });
}
```

#### Step 3.3: Apply Middleware to Express
```typescript
// src/api/server.ts
import express from 'express';
import { securityHeadersMiddleware } from './middleware/securityHeaders';

const app = express();

// Apply security headers to all responses
app.use(securityHeadersMiddleware());

// Other middleware...
```

#### Step 3.4: Environment-Specific Configuration
```typescript
// src/api/middleware/securityHeaders.ts (updated)
export function securityHeadersMiddleware() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const config = {
    // ... base config
    hsts: {
      maxAge: isProduction ? 31536000 : 3600, // 1 year in prod, 1 hour in dev
      includeSubDomains: isProduction,
      preload: isProduction,
    },
  };

  return helmet(config);
}
```

#### Step 3.5: Tests for Security Headers
```typescript
// src/__tests__/securityHeaders.test.ts
import request from 'supertest';
import app from '../api/server';

describe('Security Headers', () => {
  it('should include Content-Security-Policy header', async () => {
    const response = await request(app).get('/');
    expect(response.headers['content-security-policy']).toBeDefined();
  });

  it('should set X-Frame-Options to deny', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-frame-options']).toBe('DENY');
  });

  it('should enable HSTS in production', async () => {
    const response = await request(app).get('/');
    expect(response.headers['strict-transport-security']).toBeDefined();
  });

  it('should set X-Content-Type-Options to nosniff', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
});
```

---

## 🎯 Task 4: Logging Infrastructure (4 hours)

### Risk
```
Severity: HIGH (8/10)
Issue: No centralized logging
Impact: No audit trail, incident response impossible
```

### Implementation Steps

#### Step 4.1: Install Logging Package
```powershell
npm install winston --legacy-peer-deps
npm install @google-cloud/logging-winston --legacy-peer-deps
npm install @types/express --save-dev --legacy-peer-deps
```

#### Step 4.2: Configure Winston Logger
```typescript
// src/services/logger.ts
import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

// Configure based on environment
const isProduction = process.env.NODE_ENV === 'production';

// Log formats
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  format: logFormat,
  defaultMeta: {
    service: 'white-caves',
    environment: process.env.NODE_ENV,
  },
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let metaStr = '';
          if (Object.keys(meta).length > 0 && meta.service !== 'white-caves') {
            metaStr = JSON.stringify(meta);
          }
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        }),
      ),
    }),

    // File output
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 30,
    }),
  ],
});

// Add Google Cloud Logging in production
if (isProduction && process.env.GCP_PROJECT_ID) {
  const loggingWinston = new LoggingWinston({
    projectId: process.env.GCP_PROJECT_ID,
  });
  logger.add(loggingWinston.express());
}

// Create audit logger for security events
export const auditLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { type: 'audit' },
  transports: [
    new winston.transports.File({
      filename: 'logs/audit.log',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 90, // Keep 90 days
    }),
    ...(isProduction && process.env.GCP_PROJECT_ID
      ? [
          new LoggingWinston({
            projectId: process.env.GCP_PROJECT_ID,
            logName: 'audit-log',
          }),
        ]
      : []),
  ],
});

export default logger;
```

#### Step 4.3: Logging Middleware
```typescript
// src/api/middleware/logging.ts
import { Request, Response, NextFunction } from 'express';
import logger, { auditLogger } from '../../services/logger';

/**
 * Request/Response logging middleware
 */
export function requestLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  // Log request
  logger.debug('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // Capture original send
  const originalSend = res.send;

  // Override send to log response
  res.send = function (data) {
    const duration = Date.now() - startTime;

    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    logger[logLevel as 'warn' | 'info']('Outgoing response', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });

    return originalSend.call(this, data);
  };

  next();
}

/**
 * Audit logging for security events
 */
export function auditLog(
  event: string,
  userId: string | undefined,
  action: string,
  resource: string,
  result: 'success' | 'failure',
  details?: Record<string, unknown>
) {
  auditLogger.info('Security event', {
    event,
    userId: userId || 'anonymous',
    action,
    resource,
    result,
    timestamp: new Date().toISOString(),
    ...details,
  });
}
```

#### Step 4.4: Integrate Logging into Express
```typescript
// src/api/server.ts
import express from 'express';
import { requestLoggingMiddleware } from './middleware/logging';
import logger from '../services/logger';

const app = express();

// Add request logging
app.use(requestLoggingMiddleware);

// Error handling with logging
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: 'Internal server error',
    requestId: req.id,
  });
});

// Log server startup
app.listen(process.env.PORT || 5000, () => {
  logger.info('Server started', {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV,
  });
});
```

#### Step 4.5: Use Audit Logging in Controllers
```typescript
// src/api/controllers/authController.ts
import { auditLog } from '../middleware/logging';

export async function login(req: express.Request, res: express.Response) {
  try {
    // ... login logic

    const user = await authenticateUser(email, password);

    // Log successful login
    auditLog('USER_LOGIN', user.id, 'login', 'authentication', 'success', {
      email,
      ipAddress: req.ip,
    });

    res.json({ token: generateToken(user) });
  } catch (error) {
    // Log failed login
    auditLog('USER_LOGIN', undefined, 'login', 'authentication', 'failure', {
      email: req.body.email,
      ipAddress: req.ip,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    res.status(401).json({ error: 'Invalid credentials' });
  }
}
```

#### Step 4.6: Environment Configuration
```env
# .env.logging
LOG_LEVEL=info
LOG_DIR=./logs
GCP_PROJECT_ID=your-project-id
AUDIT_LOG_RETENTION_DAYS=90
```

---

## 🎯 Task 5: Testing & Validation (2 hours)

### Comprehensive Test Execution

#### Step 5.1: Run Existing Test Suite
```powershell
cd "c:\Users\HP\Downloads\White Caves\White Caves Web App\White-Caves"

# Run all tests
npm test 2>&1 | Tee-Object -FilePath test-results-day3.txt

# Check test coverage
npm run coverage 2>&1 | Tee-Object -FilePath coverage-day3.txt
```

#### Step 5.2: Run New Security Tests
```powershell
# File upload validation tests
npm test -- fileValidator.test.ts

# Rate limiting tests
npm test -- rateLimiter.test.ts

# Security headers tests
npm test -- securityHeaders.test.ts

# Logging tests
npm test -- logging.test.ts
```

#### Step 5.3: Build Verification
```powershell
# Build the application
npm run build 2>&1 | Tee-Object -FilePath build-day3.txt

# Check for TypeScript errors
npx tsc --noEmit 2>&1 | Tee-Object -FilePath typescript-day3.txt
```

#### Step 5.4: ESLint Verification
```powershell
# Run ESLint without the problematic config (for safety)
npx eslint src --ext .ts,.tsx --max-warnings 0

# Capture results
npx eslint src --ext .ts,.tsx --format json > eslint-results-day3.json
```

#### Step 5.5: Manual Testing Checklist
```
Security Implementation Verification

File Upload:
  [ ] Large file rejected (>10MB)
  [ ] Wrong extension files rejected
  [ ] Valid files accepted
  [ ] Filename sanitization working
  [ ] xlsx files validated safely

Rate Limiting:
  [ ] Login endpoint rate limited (5 attempts)
  [ ] API endpoints rate limited (30/min)
  [ ] 429 status returned when exceeded
  [ ] X-RateLimit headers present

Security Headers:
  [ ] CSP header present
  [ ] X-Frame-Options set to DENY
  [ ] HSTS enabled
  [ ] X-Content-Type-Options set to nosniff

Logging:
  [ ] Requests logged
  [ ] Responses logged
  [ ] Errors logged with stack trace
  [ ] Audit events logged
  [ ] Log files created in ./logs
```

---

## 🚀 Day 3-4 Execution Guide

### Day 3 Schedule

```
08:00 - Kick off & task assignment (30 min)
  - Brief team on Day 1-2 findings
  - Assign tasks 1-4
  - Set up pair programming groups

08:30 - Task 1: File Upload Security (4 hours)
  - Create fileValidator.ts
  - Update upload endpoint
  - Add validation tests
  - Test with sample files

12:30 - Lunch break (1 hour)

13:30 - Task 2: Rate Limiting (3 hours)
  - Install express-rate-limit
  - Create middleware
  - Apply to routes
  - Test rate limit triggers

16:30 - Daily standup & progress check
  - Discuss blockers
  - Plan Day 4
  - Test results review
```

### Day 4 Schedule

```
08:00 - Standup & Day 3 review (30 min)
  - Complete any remaining Tasks 1-2
  - Discuss any issues
  - Plan Task 3-4

08:30 - Task 3: Security Headers (2 hours)
  - Install helmet
  - Configure CSP, HSTS, etc.
  - Apply middleware
  - Verify headers in responses

10:30 - Break (15 min)

10:45 - Task 4: Logging (4 hours)
  - Configure Winston logger
  - Create audit logger
  - Add request/response logging
  - Integrate into express server

14:45 - Task 5: Testing & Validation (2 hours)
  - Run full test suite
  - Verify all new features
  - Build verification
  - Documentation update

16:45 - Wrap-up & commits
  - Review all changes
  - Create comprehensive commit message
  - Push to main
  - Create summary document
```

---

## 📋 Deliverables Checklist - Days 3-4

### Code Implementation
- [ ] File upload validation utility (fileValidator.ts)
- [ ] Updated upload endpoint with validation
- [ ] Rate limiter middleware configured
- [ ] Applied rate limiting to all critical endpoints
- [ ] Helmet security headers middleware
- [ ] Applied security headers to all responses
- [ ] Winston logger configured
- [ ] Audit logger configured
- [ ] Request/response logging middleware
- [ ] Error logging integrated

### Tests & Validation
- [ ] File upload tests passing
- [ ] Rate limiter tests passing
- [ ] Security header tests passing
- [ ] Logging tests passing
- [ ] All existing tests still passing
- [ ] Build verification successful
- [ ] TypeScript compilation clean
- [ ] ESLint warnings addressed

### Documentation
- [ ] Implementation guide for file uploads
- [ ] Rate limiting configuration reference
- [ ] Security headers documentation
- [ ] Logging setup instructions
- [ ] Performance impact assessment
- [ ] Operational runbook (deployment, monitoring)

### Git & Version Control
- [ ] All changes committed with clear messages
- [ ] Pushed to main branch
- [ ] Build pipeline passing
- [ ] Deployment ready for current environment

---

## 📊 Success Criteria

### Day 3-4 Completion
```
✅ File upload validation: COMPLETE
✅ Rate limiting: ALL endpoints protected
✅ Security headers: FULLY configured
✅ Logging infrastructure: OPERATIONAL
✅ Tests: 100% passing
✅ Build: Zero errors
✅ Documentation: Complete
```

### Risk Reduction
```
Before Days 3-4:
├─ File upload vulnerability: HIGH
├─ Brute force attacks: MEDIUM
├─ Clickjacking: MEDIUM
├─ No audit trail: HIGH
└─ Overall Risk: 🔴 MEDIUM-HIGH

After Days 3-4:
├─ File upload vulnerability: MITIGATED
├─ Brute force attacks: LOW
├─ Clickjacking: LOW
├─ Audit trail: ESTABLISHED
└─ Overall Risk: 🟡 MEDIUM
```

---

## 🔗 Related Documentation

- `PHASE_18_STRATEGIC_ROADMAP.md` - Overall 4-week plan
- `PHASE_18_WEEK1_SECURITY_AUDIT_REPORT.md` - Security findings
- `PHASE_18_WEEK1_DAY1_EXECUTION.md` - Assessment methodology
- `security-audit-npm.json` - Dependency vulnerability details

---

## 📞 Support & Escalation

**Questions or Blockers?**
- Technical questions: Post to team slack #security-hardening
- Dependency conflicts: Reach out to DevOps team
- Security concerns: Direct Team Lead
- Performance impacts: Notify infrastructure team

**If Task Takes Longer:**
- Push overflow to Day 5-6 in Week 2
- Notify PM immediately
- Document blockers for future reference

---

**Status:** 🚀 READY FOR EXECUTION

**Timeline:** March 9-10, 2026 (2 days)

**Estimated Hours:** 15 hours of development

**Next Phase:** Week 1, Day 5 - Verification & Documentation

**Type "day3" to start Day 3 - File Upload Security!**

---

**Phase 18, Week 1, Days 3-4**  
**Security Hardening Implementation**  
**Generated:** March 8, 2026
