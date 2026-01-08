const requiredSecrets = {
  production: [
    'MONGODB_URI',
    'VITE_FIREBASE_API_KEY'
  ],
  optional: [
    'STRIPE_SECRET_KEY',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ]
};

const validateEnvironment = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const missing = [];
  const warnings = [];

  requiredSecrets.production.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (isProduction) {
    requiredSecrets.optional.forEach(key => {
      if (!process.env[key]) {
        warnings.push(key);
      }
    });
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
    isProduction
  };
};

const envGuardMiddleware = (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/api/env-check') {
    return next();
  }
  next();
};

const getEnvStatus = () => {
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
      jwt: !!process.env.JWT_SECRET
    }
  };
};

module.exports = {
  validateEnvironment,
  envGuardMiddleware,
  getEnvStatus,
  requiredSecrets
};
