import { useState, useCallback } from 'react';
import en from '../locales/en.json';

type LocaleDict = Record<string, any>;

export const useTranslation = () => {
  // Hardcoded to EN for now, easily extendable to switch AR based on context
  const [locale] = useState<LocaleDict>(en);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let result = locale;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        console.warn(`[useTranslation] Missing key: ${key}`);
        return key;
      }
    }
    return typeof result === 'string' ? result : key;
  }, [locale]);

  return { t };
};

export default useTranslation;
