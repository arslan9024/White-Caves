/**
 * Centralized Application Constants
 * ==================================
 * Official Corporate Master Config for White Caves Real Estate LLC
 */

// ─── Runtime-safe URL fallbacks ───────────────────────────────────────
const FALLBACK_PUBLIC_ORIGIN = 'https://www.whitecaves.com';
const runtimeOrigin = typeof window !== 'undefined' && window.location?.origin
  ? window.location.origin
  : FALLBACK_PUBLIC_ORIGIN;

const resolvedApiUrl = import.meta.env.VITE_API_URL || '/api';
const resolvedAppUrl = import.meta.env.VITE_APP_URL || runtimeOrigin;

export const Config = {
  /** Public-facing domain */
  DOMAIN: import.meta.env.VITE_DOMAIN || FALLBACK_PUBLIC_ORIGIN,

  /** Backend API base URL */
  API_URL: resolvedApiUrl,

  /** Frontend base URL */
  APP_URL: resolvedAppUrl,

  /** Authoritative Company Information */
  COMPANY: {
    NAME: 'WHITE CAVES REAL ESTATE L.L.C',
    SHORT_NAME: 'White Caves',
    TRADE_LICENSE_NUMBER: '1388443',
    LICENSE_EXPIRY: '30-07-2026',
    LEGAL_TYPE: 'Limited Liability Company - Single Owner (LLC-SO)',
    CAPITAL_AED: 100000,
    REGISTERED_ADDRESS: 'Office D-72, Port Saeed, Dubai, United Arab Emirates',
    ADDRESS: 'Office D-72, Port Saeed, Dubai, United Arab Emirates',
    OFFICE_PHONE: '+971 4 335 0592',
    PHONE: '+971 56 361 6136',
    MOBILE: '+971 56 361 6136',
    WHATSAPP: '971563616136',
    EMAIL: 'admin@whitecaves.com',
    SUPPORT_EMAIL: 'admin@whitecaves.com',
    WEBSITE: 'www.whitecaves.com',
    RERA_ORN: '44483',
    RERA_LICENSE: '44483',
    ACTIVITIES: [
      'Real Estate Buying & Selling Brokerage',
      'Leasing Property Brokerage Agents',
    ],
    BANK: {
      NAME: 'Mashreq Bank',
      ACCOUNT_TITLE: 'WHITE CAVES REAL ESTATE L.L.C',
      CIF_NUMBER: '015251084',
      ACCOUNT_NUMBER: '019101501006',
      IBAN: 'AE960330000019101501006',
      ACCOUNT_TYPE: 'NEOBiz Lite',
      MONTHLY_FEE_AED: 200,
      ROUTING_CODE: '203320101',
      SWIFT: 'BOMLAEAD',
    },
    SIGNATORY: {
      NAME: 'ARSLAN MALIK BASHIR AHMAD',
      ROLE: 'Managing Director',
      EMIRATES_ID: '784-1993-1805733-0',
      PASSPORT: 'DR07601431',
      NATIONALITY: 'Pakistani',
      MOBILE: '+971 56 361 6136',
      EMAIL: 'admin@whitecaves.com',
      IS_SOLE_SIGNATORY: true,
    },
    CORPORATE_EJARI: {
      CONTRACT_NUMBER: '0120260721003974',
      REGISTRATION_DATE: '21-07-2026',
      START_DATE: '21-07-2026',
      END_DATE: '20-07-2027',
      PROPERTY_ADDRESS: 'PROPERTY INVESTMENT OFFICE 4 - F1, Dubai Investment Park First',
      OWNER_NAME: 'NIAZ AHMED MEMON MOHAMMED HASHIM MEMON',
      TENANT_NAME: 'WHITE CAVES REAL ESTATE L.L.C',
      ANNUAL_RENT_AED: 20000,
      OFFICE_SIZE: '20 sq.m',
      DEWA_PREMISE: '598996249',
    },
  },

  /** API endpoints */
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
    ANALYTICS_ENABLED: import.meta.env.VITE_ANALYTICS_ENABLED !== 'false',
  },

  /** Pagination defaults */
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    GRID_PAGE_SIZE: 9,
    COMPACT_PAGE_SIZE: 5,
    LARGE_PAGE_SIZE: 50,
  },

  /** Dubai Land Department (DLD) fees */
  DLD_FEES: {
    TRANSFER_FEE_RATE: 0.04,
    ADMIN_FEE: 580,
    TRUSTEE_FEE_MORTGAGE: 4200,
    TRUSTEE_FEE_CASH: 2100,
    MORTGAGE_REGISTRATION_RATE: 0.0025,
    MORTGAGE_ADMIN_FEE: 290,
    NOC_FEE: 5000,
    VALUATION_FEE: 3000,
  },

  /** Real estate business rates */
  REAL_ESTATE: {
    AGENCY_COMMISSION_RATE: 0.02,
    VAT_RATE: 0.05,
    DEFAULT_PROPERTY_PRICE: 5_000_000,
    PRICE_RANGE_MIN: 500_000,
    PRICE_RANGE_MAX: 100_000_000,
  },

  /** Mortgage defaults */
  MORTGAGE: {
    DEFAULT_DOWN_PAYMENT: 1_000_000,
    DEFAULT_INTEREST_RATE: 4.5,
    DEFAULT_LOAN_TERM: 25,
    MIN_DOWN_PAYMENT_RATE: 0.2,
    MAX_LOAN_TERM: 30,
  },
};

export default Config;
