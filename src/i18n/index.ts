/**
 * i18n & RTL Layout Configuration — Wave 45 (NFR-USAB-001, NFR-USAB-002)
 *
 * Support for English (en) and Arabic (ar) with automated RTL direction toggle.
 */

import arTranslations from './locales/ar.json' assert { type: 'json' };

export type SupportedLanguage = 'en' | 'ar';

export interface I18nConfig {
  currentLanguage: SupportedLanguage;
  isRtl: boolean;
}

let activeLanguage: SupportedLanguage = 'en';

export const enTranslations = {
  common: {
    welcome: 'Welcome to White Caves Real Estate',
    dashboard: 'Dashboard',
    properties: 'Properties',
    leads: 'Leads',
    contracts: 'Contracts & Ejari',
    maintenance: 'Maintenance',
    reports: 'Financial Reports',
    settings: 'Settings',
    logout: 'Logout',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    search: 'Search...',
    status: 'Status',
    actions: 'Actions',
  },
  crm: {
    newLead: 'Add New Lead',
    leadScoring: 'AI Lead Scoring',
    whatsappBroadcast: 'WhatsApp Broadcast',
    kycVerification: 'KYC Verification',
    amlScreening: 'AML Screening',
    totalRevenue: 'Total Revenue (AED)',
  },
};

export function setLanguage(lang: SupportedLanguage): I18nConfig {
  activeLanguage = lang;
  const isRtl = lang === 'ar';

  if (typeof document !== 'undefined') {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  return {
    currentLanguage: activeLanguage,
    isRtl,
  };
}

export function getCurrentLanguage(): SupportedLanguage {
  return activeLanguage;
}

export function translate(keyPath: string, lang: SupportedLanguage = activeLanguage): string {
  const parts = keyPath.split('.');
  const dict = lang === 'ar' ? arTranslations : enTranslations;

  let current: Record<string, unknown> | string | undefined = dict as unknown as Record<string, unknown>;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part] as Record<string, unknown> | string | undefined;
    } else {
      return keyPath;
    }
  }

  return typeof current === 'string' ? current : keyPath;
}
