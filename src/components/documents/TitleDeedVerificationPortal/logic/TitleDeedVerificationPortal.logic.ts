/** TitleDeedVerificationPortal.logic.ts */
import { useState, useCallback } from 'react';

export type VerificationStatus = 'idle' | 'loading' | 'verified' | 'not_found' | 'encumbered';

export interface TitleDeedResult {
  titleDeedNumber: string; ownerName: string; propertyAddress: string;
  community: string; plotNumber: string; buaSqft: number;
  registrationDate: string; mortgageStatus: 'clear' | 'mortgaged';
  dldStatus: 'registered' | 'pending' | 'dispute';
}

const MOCK_DEEDS: Record<string, TitleDeedResult> = {
  '1234567890': {
    titleDeedNumber: '1234567890', ownerName: 'Ahmed Al Mansouri',
    propertyAddress: 'Unit 14C, Bloom Heights Tower 2, JVC', community: 'Jumeirah Village Circle (JVC)',
    plotNumber: 'JVC-P-0547', buaSqft: 1842,
    registrationDate: '2022-03-14', mortgageStatus: 'clear', dldStatus: 'registered',
  },
};

export function useTitleDeedVerificationPortalLogic() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [result, setResult] = useState<TitleDeedResult | null>(null);

  const handleVerify = useCallback(async () => {
    if (!query.trim()) return;
    setStatus('loading');
    setResult(null);
    await new Promise((r) => setTimeout(r, 1200));
    const found = MOCK_DEEDS[query.trim()];
    if (found) {
      setResult(found);
      setStatus(found.mortgageStatus === 'mortgaged' ? 'encumbered' : 'verified');
    } else {
      setStatus('not_found');
    }
  }, [query]);

  const handleReset = useCallback(() => { setQuery(''); setStatus('idle'); setResult(null); }, []);

  return { query, setQuery, status, result, handleVerify, handleReset };
}
