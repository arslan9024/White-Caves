import React, { FC, useMemo } from 'react';
import { useTranslation } from '../../context/TranslationContext';

interface CurrencyViewerProps {
  value: number;
  currency?: string;
  fractionDigits?: number;
}

export const CurrencyViewer: FC<CurrencyViewerProps> = ({
  value,
  currency,
  fractionDigits = 0,
}) => {
  const { language } = useTranslation();

  const formattedValue = useMemo(() => {
    // If language is Arabic, we can use ar-AE locale for correct number formatting
    const locale = language === 'ar' ? 'ar-AE' : 'en-AE';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'AED',
      maximumFractionDigits: fractionDigits,
    }).format(value);
  }, [value, currency, fractionDigits, language]);

  return <span className="currency-viewer">{formattedValue}</span>;
};
