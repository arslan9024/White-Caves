import { useMemo } from 'react';
import { calculatePredictiveROI, PredictiveROIParams, PredictiveROIMetrics } from '../utils/PredictiveROIMatrix';

export function usePredictiveROI(params: PredictiveROIParams): PredictiveROIMetrics {
  return useMemo(() => calculatePredictiveROI(params), [
    params.purchasePriceAED,
    params.expectedAnnualRentAED,
    params.community,
    params.holdingPeriodYears,
  ]);
}

export default usePredictiveROI;
