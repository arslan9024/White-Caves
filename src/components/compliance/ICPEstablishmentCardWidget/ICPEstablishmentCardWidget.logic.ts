import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useICPEstablishmentCardLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  // Hardcoded for issue specific number `2/1/1192499`
  const establishmentData = {
    icpCardNumber: '2/1/1192499',
    issueDate: '2025-10-01',
    expiryDate: '2026-10-01',
    status: 'expiring' as 'active' | 'expiring' | 'expired',
    daysRemaining: 45,
    mohreStatus: 'pending' as 'compliant' | 'pending',
    mohreLastFiled: '2026-03-15',
    recentActivity: [
      { id: 1, type: 'visa', desc: 'New Employment Visa (Agent)', date: '2026-08-10' },
      { id: 2, type: 'quota', desc: 'Quota increased to 120', date: '2026-07-22' },
      { id: 3, type: 'mohre', desc: 'Q2 Emiratisation Data Filed', date: '2026-06-30' },
    ]
  };

  const handleRenewICP = () => {
    window.alert('Redirecting to ICP Smart Services portal for establishment card renewal.');
  };

  const handleFileMoHRE = () => {
    window.alert('Redirecting to MoHRE portal for WPS and Emiratisation reporting.');
  };

  return {
    t,
    isRtl,
    data: establishmentData,
    handleRenewICP,
    handleFileMoHRE
  };
};
