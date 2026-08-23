import React, { createContext, useContext, useState, FC, ReactNode, memo } from 'react';
import { dictionaries, supportedLocales, SupportedLanguageCode } from '../locales';

export type SupportedLanguage = SupportedLanguageCode;

interface TranslationContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  const t = (keyPath: string, params?: Record<string, string | number>): string => {
    if (!keyPath) return '';
    const keys = keyPath.split('.');
    const dict = dictionaries[language] || dictionaries.en;
    let current: Record<string, unknown> | unknown = dict;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        // Fallback to English dictionary
        let fallback: Record<string, unknown> | unknown = dictionaries.en;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in (fallback as Record<string, unknown>)) {
            fallback = (fallback as Record<string, unknown>)[fk];
          } else {
            return keyPath;
          }
        }
        current = fallback;
        break;
      }
    }

    if (typeof current !== 'string') {
      return keyPath;
    }

    let result = current;
    if (params) {
      Object.keys(params).forEach(param => {
        const escaped = param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = result.replace(new RegExp(`{${escaped}}`, 'g'), String(params[param]));
      });
    }

    return result;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    // Fallback if component is rendered outside TranslationProvider
    return {
      language: 'en' as SupportedLanguage,
      setLanguage: () => {},
      t: (keyPath: string, params?: Record<string, string | number>) => {
        if (!keyPath) return '';
        const keys = keyPath.split('.');
        let current: any = dictionaries.en;
        for (const key of keys) {
          if (current && typeof current === 'object' && key in current) {
            current = current[key];
          } else {
            return keyPath;
          }
        }
        if (typeof current !== 'string') {
          return keyPath;
        }
        let result = current;
        if (params) {
          Object.keys(params).forEach(param => {
            const escaped = param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            result = result.replace(new RegExp(`{${escaped}}`, 'g'), String(params[param]));
          });
        }
        return result;
      },
    };
  }
  return context;
}

export interface TextProps {
  tid?: string;
  k?: string;
  fallback?: string;
  params?: Record<string, string | number>;
}

export const Text: FC<TextProps> = memo(({ tid, k, fallback, params }) => {
  const { t } = useTranslation();
  const keyPath = tid || k || '';
  if (!keyPath) return <>{fallback || ''}</>;
  const value = t(keyPath, params);
  return <>{value === keyPath && fallback ? fallback : value}</>;
});

export default TranslationContext;
