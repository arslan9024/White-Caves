import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useZakatCalculatorLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;
  const [assets, setAssets] = useState('');
  const nisab = 21000; // approx AED nisab
  const zakatRate = 0.025;
  const zakatDue = Number(assets) >= nisab ? Number(assets) * zakatRate : 0;
  return { t, isRtl, assets, setAssets, nisab, zakatRate, zakatDue };
};
