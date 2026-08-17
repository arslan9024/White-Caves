/**
 * White Caves Real Estate LLC — Universal Locale Aggregator & Registry
 * Strict Architecture Separation: Data Layer for Internationalization
 */

import { en } from './en';
import { ar } from './ar';
import { es } from './es';
import { ru } from './ru';

export { en, ar, es, ru };

export const supportedLocales = {
  en: { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇦🇪' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', flag: '🇷🇺' },
} as const;

export type SupportedLanguageCode = keyof typeof supportedLocales;

export const dictionaries: Record<SupportedLanguageCode, typeof en> = {
  en,
  ar,
  es,
  ru,
};

export default dictionaries;
