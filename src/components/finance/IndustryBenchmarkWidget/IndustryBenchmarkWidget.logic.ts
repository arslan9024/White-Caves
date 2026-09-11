import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useIndustryBenchmarkLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;
  const benchmarks = t.metric_labels.map((label: string, i: number) => ({
    label, yours: t.your_values[i], market: t.market_values[i],
    diff: t.your_values[i] - t.market_values[i],
    status: t.your_values[i] > t.market_values[i] ? t.above : t.your_values[i] < t.market_values[i] ? t.below : t.at_par,
  }));
  return { t, isRtl, benchmarks };
};
