import { useState, useMemo, useCallback } from 'react';
import { CurrencyCode, useGlobalCurrency } from '../../../context/CurrencyContext';

export function useMultiCurrencyConverterLogic(initialAmountAED = 18500000) {
  const { currency, setCurrency, currencies, convertFromAED, convertToAED } = useGlobalCurrency();
  const [inputAmountAED, setInputAmountAED] = useState<number>(initialAmountAED);
  const [selectedTarget, setSelectedTarget] = useState<CurrencyCode>(currency);

  const conversionTable = useMemo(() => {
    return (Object.keys(currencies) as CurrencyCode[]).map(code => {
      const item = currencies[code];
      const convertedValue = convertFromAED(inputAmountAED, code);
      const isCrypto = code === 'BTC';

      const formatted = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: isCrypto ? 4 : 0,
        minimumFractionDigits: isCrypto ? 2 : 0,
      }).format(isCrypto ? convertedValue : Math.round(convertedValue));

      return {
        ...item,
        convertedValue,
        formattedString: `${item.symbol} ${formatted}`,
        rateDisplay: `1 ${code} = AED ${item.rateToAED.toLocaleString()}`,
      };
    });
  }, [currencies, convertFromAED, inputAmountAED]);

  const handleSelectActiveCurrency = useCallback(
    (code: CurrencyCode) => {
      setSelectedTarget(code);
      setCurrency(code);
    },
    [setCurrency]
  );

  return {
    inputAmountAED,
    setInputAmountAED,
    selectedTarget,
    conversionTable,
    handleSelectActiveCurrency,
  };
}
