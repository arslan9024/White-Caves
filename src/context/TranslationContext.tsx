import React, { createContext, useContext, useState, FC, ReactNode, memo } from 'react';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import es from '../locales/es.json';

export type SupportedLanguage = 'en' | 'ar' | 'es';

const dictionaryMap: Record<SupportedLanguage, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  ar: ar as Record<string, unknown>,
  es: es as Record<string, unknown>,
};

interface TranslationContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (keyPath: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: unknown = dictionaryMap[language] || dictionaryMap['en'];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return keyPath; // Fallback to key string if missing
      }
    }

    return typeof current === 'string' ? current : keyPath;
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
      t: (keyPath: string) => {
        const keys = keyPath.split('.');
        let current: unknown = en;
        for (const key of keys) {
          if (current && typeof current === 'object' && key in current) {
            current = (current as Record<string, unknown>)[key];
          } else {
            return keyPath;
          }
        }
        return typeof current === 'string' ? current : keyPath;
      },
    };
  }
  return context;
}

/**
 * Convenience JSX component for inline translated text.
 * Usage: <Text tid="key.path" />
 */
export const Text: FC<{ tid: string }> = memo(({ tid }) => {
  const { t } = useTranslation();
  return <>{t(tid)}</>;
});

Text.displayName = 'Text';

export default TranslationContext;
