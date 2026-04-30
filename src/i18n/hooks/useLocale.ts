import { useMemo } from 'react';
import { useLanguage, type LanguageType } from '../../context/LanguageContext';

export interface UseLocaleReturn {
  locale: LanguageType;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  switchLocale: (next: LanguageType) => void;
}

/**
 * Phase 6 locale abstraction for future i18n provider migration.
 * Keeps a stable API while internally reusing LanguageContext.
 */
export const useLocale = (): UseLocaleReturn => {
  const { language, isRTL, setLanguage } = useLanguage();

  return useMemo(
    () => ({
      locale: language,
      isRTL,
      dir: isRTL ? 'rtl' : 'ltr',
      switchLocale: setLanguage,
    }),
    [language, isRTL, setLanguage]
  );
};
