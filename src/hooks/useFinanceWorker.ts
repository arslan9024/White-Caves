import { useState, useCallback } from 'react';
import {
  calculateMortgage,
  calculateROI,
  MortgageInput,
  MortgageResult,
  ROIInput,
  ROIResult,
} from '../workers/financeWorker';

export interface UseFinanceWorkerReturn {
  computeMortgage: (input: MortgageInput) => Promise<MortgageResult>;
  computeROI: (input: ROIInput) => Promise<ROIResult>;
  isComputing: boolean;
}

/**
 * Hook providing async calculation for Mortgage and ROI calculations with instant synchronous fallback
 */
export function useFinanceWorker(): UseFinanceWorkerReturn {
  const [isComputing, setIsComputing] = useState(false);

  const computeMortgage = useCallback(async (input: MortgageInput): Promise<MortgageResult> => {
    setIsComputing(true);
    try {
      // Direct high-efficiency compute (runs synchronously in microtask)
      return calculateMortgage(input);
    } finally {
      setIsComputing(false);
    }
  }, []);

  const computeROI = useCallback(async (input: ROIInput): Promise<ROIResult> => {
    setIsComputing(true);
    try {
      return calculateROI(input);
    } finally {
      setIsComputing(false);
    }
  }, []);

  return {
    computeMortgage,
    computeROI,
    isComputing,
  };
}

export default useFinanceWorker;
