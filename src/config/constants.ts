/**
 * Centralized Application Constants
 * ==================================
 * All environment-dependent values and hardcoded strings should be
 * referenced from here. This makes multi-environment deployment
 * (dev / staging / production) trivial.
 *
 * Usage:
 *   import { Config } from '@utils/constants';  // or relative path
 *   const url = `${Config.DOMAIN}/properties`;
 */

// ─── Runtime-safe URL fallbacks ───────────────────────────────────────
const FALLBACK_PUBLIC_ORIGIN = 'https://www.whitecaves.com';
const runtimeOrigin = typeof window !== 'undefined' && window.location?.origin
  ? window.location.origin
  : FALLBACK_PUBLIC_ORIGIN;

const resolvedApiUrl = import.meta.env.VITE_API_URL || '/api';
const resolvedAppUrl = import.meta.env.VITE_APP_URL || runtimeOrigin;

export const Config = {
  /** Public-facing domain (used in SEO, schema.org, Open Graph) */
  DOMAIN: import.meta.env.VITE_DOMAIN || FALLBACK_PUBLIC_ORIGIN,

  /** Backend API base URL (used by apiClient, fetch calls) */
  API_URL: resolvedApiUrl,

  /** Frontend base URL */
  APP_URL: resolvedAppUrl,

  /** Company information */
  COMPANY: {
    NAME: 'White Caves Real Estate LLC',
    SHORT_NAME: 'White Caves',
    PHONE: '+971 56 361 6136',
    EMAIL: 'info@whitecaves.ae',
    WHATSAPP: '971563616136',
    ADDRESS: 'Dubai, United Arab Emirates',
    RERA_LICENSE: '', // Add when available
  },

  /** API endpoints (relative — resolved by proxy or API_URL) */
  ENDPOINTS: {
    LEADS: '/api/leads',
    PROPERTIES: '/api/properties',
    AGENTS: '/api/users',
    DASHBOARD: '/api/dashboard/summary',
    CRM_DASHBOARD: '/api/crm/dashboard',
    CRM_ANALYTICS: '/api/crm/analytics',
    HEALTH: '/health',
  },

  /** Feature flags */
  FEATURES: {
    WHATSAPP_ENABLED: import.meta.env.VITE_WHATSAPP_ENABLED === 'true',
    STRIPE_ENABLED: import.meta.env.VITE_STRIPE_ENABLED === 'true',
    UAE_PASS_ENABLED: import.meta.env.VITE_UAE_PASS_ENABLED === 'true',
    ANALYTICS_ENABLED: import.meta.env.VITE_ANALYTICS_ENABLED !== 'false', // enabled by default
  },

  /** Pagination defaults */
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    GRID_PAGE_SIZE: 9,         // CRM property grid
    COMPACT_PAGE_SIZE: 5,      // Dashboard activity lists
    LARGE_PAGE_SIZE: 50,       // Inventory matrix
  },

  /** Dubai Land Department (DLD) fees — official government rates */
  DLD_FEES: {
    /** DLD transfer fee — 4% of property value (split buyer/seller) */
    TRANSFER_FEE_RATE: 0.04,
    /** DLD admin/processing fee in AED */
    ADMIN_FEE: 580,
    /** Trustee fee for mortgage transactions (AED) */
    TRUSTEE_FEE_MORTGAGE: 4200,
    /** Trustee fee for cash transactions (AED) */
    TRUSTEE_FEE_CASH: 2100,
    /** Mortgage registration fee rate (0.25% of loan amount) */
    MORTGAGE_REGISTRATION_RATE: 0.0025,
    /** Mortgage registration admin fee (AED) */
    MORTGAGE_ADMIN_FEE: 290,
    /** No Objection Certificate (NOC) fee (AED) */
    NOC_FEE: 5000,
    /** Property valuation fee (AED) */
    VALUATION_FEE: 3000,
  },

  /** Real estate business rates */
  REAL_ESTATE: {
    /** Standard agency/brokerage commission (2%) */
    AGENCY_COMMISSION_RATE: 0.02,
    /** UAE VAT rate (5%) */
    VAT_RATE: 0.05,
    /** Default property price for calculators (AED) */
    DEFAULT_PROPERTY_PRICE: 5_000_000,
    /** Property price slider range (AED) */
    PRICE_RANGE_MIN: 500_000,
    PRICE_RANGE_MAX: 50_000_000,
    PRICE_STEP: 100_000,
    /** Default currency */
    CURRENCY: 'AED',
  },

  /** UAE mortgage regulations */
  MORTGAGE: {
    /** Default down payment for expats (25%) */
    DEFAULT_DOWN_PAYMENT: 25,
    /** Minimum down payment for expats (20%) */
    MIN_DOWN_PAYMENT: 20,
    /** Maximum down payment (80%) */
    MAX_DOWN_PAYMENT: 80,
    /** Default interest rate (%) */
    DEFAULT_INTEREST_RATE: 4.99,
    /** Interest rate slider range */
    MIN_INTEREST_RATE: 2,
    MAX_INTEREST_RATE: 7,
    /** Default loan term (years) */
    DEFAULT_LOAN_TERM: 25,
    /** Maximum loan term (years) */
    MAX_LOAN_TERM: 25,
  },

  /** API & timing constants */
  TIMING: {
    /** Default API timeout (ms) */
    API_TIMEOUT: 30_000,
    /** Toast notification duration (ms) */
    TOAST_DURATION: 3_000,
    /** Autoplay interval for sliders (ms) */
    AUTOPLAY_INTERVAL: 5_000,
    /** 404 redirect countdown (seconds) */
    NOT_FOUND_REDIRECT: 5,
  },
} as const;

export default Config;
