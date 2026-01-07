import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();

export const LANGUAGES = {
  EN: 'en',
  AR: 'ar'
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('whitecaves_language') || LANGUAGES.EN;
    }
    return LANGUAGES.EN;
  });

  const isRTL = language === LANGUAGES.AR;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
      document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      document.body.style.fontFamily = isRTL 
        ? "'Cairo', 'Noto Sans Arabic', sans-serif" 
        : "'Montserrat', 'Open Sans', sans-serif";
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('whitecaves_language', language);
    }
  }, [language, isRTL]);

  const setLanguage = useCallback((lang) => {
    if (lang === LANGUAGES.EN || lang === LANGUAGES.AR) {
      setLanguageState(lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === LANGUAGES.EN ? LANGUAGES.AR : LANGUAGES.EN);
  }, []);

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        const fallback = translations[LANGUAGES.EN];
        let fallbackValue = fallback;
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = fallbackValue[fk];
          } else {
            return key;
          }
        }
        value = fallbackValue;
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    let result = value;
    Object.keys(params).forEach(param => {
      result = result.replace(new RegExp(`{${param}}`, 'g'), params[param]);
    });

    return result;
  }, [language]);

  const formatNumber = useCallback((number) => {
    if (typeof number !== 'number') return number;
    return new Intl.NumberFormat(language === LANGUAGES.AR ? 'ar-AE' : 'en-AE').format(number);
  }, [language]);

  const formatCurrency = useCallback((amount, currency = 'AED') => {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat(language === LANGUAGES.AR ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, [language]);

  const formatDate = useCallback((date, options = {}) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(language === LANGUAGES.AR ? 'ar-AE' : 'en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(dateObj);
  }, [language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isRTL,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    translations: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
