import { useState, useEffect } from 'react';
import { calculateLeadSLADecay, LeadSLADecayResult } from '../utils/LeadSLADecayEngine';

export function useLeadSLADecay(ingestionTimestamp: string | Date): LeadSLADecayResult {
  const [decayResult, setDecayResult] = useState<LeadSLADecayResult>(() =>
    calculateLeadSLADecay(ingestionTimestamp)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setDecayResult(calculateLeadSLADecay(ingestionTimestamp));
    }, 60000); // Recalculate every minute

    return () => clearInterval(timer);
  }, [ingestionTimestamp]);

  return decayResult;
}

export default useLeadSLADecay;
