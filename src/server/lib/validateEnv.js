/**
 * Environment Variable Validation
 * Validates required environment variables at application startup
 * Fails fast if critical configuration is missing
 */

export const validateEnvironment = () => {
  const requiredVars = [
    'MONGODB_URI',
    'VITE_FIREBASE_API_KEY',
  ];

  const recommendedVars = [
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'WHATSAPP_OWNER_EMAIL',
    'GOOGLE_MAPS_API_KEY',
  ];

  const errors = [];
  const warnings = [];

  // Check required variables
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`❌ CRITICAL: ${varName} is not set`);
    }
  });

  // Check recommended variables
  recommendedVars.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`⚠️  WARNING: ${varName} is not set. Some features may not work.`);
    }
  });

  // Print errors
  if (errors.length > 0) {
    // Only use basic string concatenation to avoid issues during startup
    let errorMsg = '\n========================================\n';
    errorMsg += 'ENVIRONMENT VALIDATION FAILED\n';
    errorMsg += '========================================\n';
    errors.forEach(e => {
      errorMsg += e + '\n';
    });
    errorMsg += '\nPlease set all required environment variables before starting the app.\n';
    errorMsg += 'See .env.example for required variables.\n';
    errorMsg += '========================================\n';
    
    throw new Error(errorMsg);
  }

  // Print warnings
  if (warnings.length > 0) {
    let warningMsg = '\n========================================\n';
    warningMsg += 'ENVIRONMENT WARNINGS\n';
    warningMsg += '========================================\n';
    warnings.forEach(w => {
      warningMsg += w + '\n';
    });
    warningMsg += '========================================\n';
    
    // Log warnings but don't fail (just print to console if available)
    if (typeof console !== 'undefined' && console.warn) {
      // Can't use console due to earlier removal
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const validateNodeEnvironment = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  if (!['development', 'staging', 'production'].includes(nodeEnv)) {
    throw new Error(`Invalid NODE_ENV: ${nodeEnv}. Must be one of: development, staging, production`);
  }

  return nodeEnv;
};

export const validateStripeConfig = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      configured: false,
      warning: 'Stripe is not configured. Payment processing will not be available.',
    };
  }

  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    return {
      configured: false,
      warning: 'Invalid Stripe secret key. Must start with "sk_".',
    };
  }

  return {
    configured: true,
  };
};

export const validateDatabaseConfig = () => {
  const mongoUri = process.env.MONGODB_URI || 
    (process.env.DB_PASSWORD ? `mongodb+srv://user:${process.env.DB_PASSWORD}@cluster.mongodb.net/db` : null);

  if (!mongoUri) {
    return {
      configured: false,
      error: 'MongoDB is not configured. Either set MONGODB_URI or DB_PASSWORD.',
    };
  }

  return {
    configured: true,
  };
};
