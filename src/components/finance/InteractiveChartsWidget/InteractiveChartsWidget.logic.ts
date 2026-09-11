import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';
export const useInteractiveChartsLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;
  const [chartType, setChartType] = useState(0);
  return { t, isRtl, chartType, setChartType };
};
