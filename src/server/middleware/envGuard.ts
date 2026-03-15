import { Request, Response, NextFunction } from 'express';

interface EnvironmentValidation {
  valid: boolean;
  missing: string[];
  warnings: string[];
  isProduction: boolean;
}

interface EnvStatus {
  environment: string;
  valid: boolean;
  missingRequired: string[];
  missingOptional: string[];
  configured: {
    mongodb: boolean;
    firebase: boolean;
    stripe: boolean;
    jwt: boolean;
  };
}

interface RequiredSecrets {
  production: string[];
  optional: string[];
}

const requiredSecrets: RequiredSecrets = {
  production: ['MONGODB_URI', 'VITE_FIREBASE_API_KEY'],
  optional: [
    'STRIPE_SECRET_KEY',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
  ],
};

export function validateEnvironment(): EnvironmentValidation {
  const isProduction = process.env.NODE_ENV === 'production';
  const missing: string[] = [];
  const warnings: string[] = [];

  requiredSecrets.production.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (isProduction) {
    requiredSecrets.optional.forEach((key) => {
      if (!process.env[key]) {
        warnings.push(key);
      }
    });
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
    isProduction,
  };
}

export function envGuardMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.path === '/api/health' || req.path === '/api/env-check') {
    return next();
  }
  next();
}

export function getEnvStatus(): EnvStatus {
  const validation = validateEnvironment();

  return {
    environment: process.env.NODE_ENV || 'development',
    valid: validation.valid,
    missingRequired: validation.missing,
    missingOptional: validation.warnings,
    configured: {
      mongodb: !!process.env.MONGODB_URI,
      firebase: !!process.env.VITE_FIREBASE_API_KEY,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      jwt: !!process.env.JWT_SECRET,
    },
  };
}

export { requiredSecrets };
