import React from 'react';
import { useTranslation } from '../context/TranslationContext';

interface CurrencyViewerProps {
  value: number;
  currency?: string;
  decimals?: number;
}

export const CurrencyViewer: React.FC<CurrencyViewerProps> = ({
  value,
  currency,
  decimals = 0,
}) => {
  const { t, language } = useTranslation();

  const displayCurrency = currency || t('common.currency');

  const formattedValue = new Intl.NumberFormat(language === 'ar' ? 'ar-AE' : 'en-AE', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return (
    <span className="currency-viewer" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {language === 'ar'
        ? `${displayCurrency} ${formattedValue}`
        : `${formattedValue} ${displayCurrency}`}
    </span>
  );
};
