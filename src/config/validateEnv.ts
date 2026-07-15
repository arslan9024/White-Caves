import { createLogger } from '../utils/logger';

const log = createLogger('Env');

/**
 * Environment Validation — White Caves CRM
 * Validates required environment variables at startup.
 * Warns about missing optional features.
 */

interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

const REQUIRED_VARS: string[] = [
  // Core app
  'VITE_API_URL',
];

const OPTIONAL_VARS: Record<string, string> = {
  VITE_FIREBASE_API_KEY: `Firebase Auth`,
  VITE_FIREBASE_PROJECT_ID: `Firebase Auth`,
  VITE_STRIPE_PUBLIC_KEY: `Stripe Payments`,
  VITE_GOOGLE_MAPS_API_KEY: `Google Maps`,
  VITE_WHATSAPP_ENABLED: 'WhatsApp Integration',
};

export function validateEnvironment(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required (also catches empty strings)
  for (const key of REQUIRED_VARS) {
    const value = import.meta.env[key];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missing.push(key);
    }
  }

  // Check optional (warn only)
  for (const [key, feature] of Object.entries(OPTIONAL_VARS)) {
    if (!import.meta.env[key]) {
      warnings.push(`${feature} disabled (${key} not set)`);
    }
  }

  if (import.meta.env.DEV) {
    if (missing.length > 0) {
      log.warn(`Missing required vars: ${missing.join(', ')}`);
    }
    for (const w of warnings) {
      log.info(w);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

export default validateEnvironment;
