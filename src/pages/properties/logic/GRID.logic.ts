import type { ChangeEvent } from 'react';
import { useGlobalCurrency } from '../../../context/CurrencyContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { GRID_CURRENCIES } from '../data/GRID.data';

export function useGridCurrency() {
  const { currency, setCurrency } = useGlobalCurrency();
  const { isRTL, t } = useTranslation();

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = GRID_CURRENCIES.find(code => code === event.currentTarget.value);
    if (selectedCurrency) setCurrency(selectedCurrency);
  };

  return {
    currency,
    currencies: GRID_CURRENCIES,
    currencyLabel: t('property.selectCurrency'),
    direction: isRTL ? 'rtl' : 'ltr',
    handleCurrencyChange,
  };
}
