import { useState, useMemo, useCallback, useContext } from 'react';
import { CurrencyCode, CurrencyContext, SUPPORTED_CURRENCIES } from '../../../context/CurrencyContext';

export function useMultiCurrencyConverterLogic(initialAmountAED = 18500000) {
  const context = useContext(CurrencyContext);
  const currency = context?.currency || 'AED';
  const currencies = context?.currencies || SUPPORTED_CURRENCIES;
  const convertFromAED = context?.convertFromAED || ((amt: number, code?: CurrencyCode) => amt / (SUPPORTED_CURRENCIES[code || 'AED']?.rateToAED || 1));
  const setCurrency = context?.setCurrency || (() => {});

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
