import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useRERAORNAutoRenewalLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  // Hardcoded for issue specific number `44483`
  const ornData = {
    ornNumber: '44483',
    tradeLicense: '891044',
    issueDate: '2025-11-20',
    expiryDate: '2026-11-20',
    status: 'expiring' as 'active' | 'expiring' | 'expired',
    daysRemaining: 20,
    steps: [
      { id: 'ded', label: t.step_1, status: 'completed' as 'completed' | 'pending' },
      { id: 'ejari', label: t.step_2, status: 'completed' as 'completed' | 'pending' },
      { id: 'trakheesi', label: t.step_3, status: 'pending' as 'completed' | 'pending' },
      { id: 'final', label: t.step_4, status: 'pending' as 'completed' | 'pending' },
    ]
  };

  const handleSync = () => {
    window.alert('Syncing data with RERA Trakheesi API...');
  };

  const handleAutoRenew = () => {
    window.alert('Initiating automated renewal workflow. Approvals will be routed to the compliance officer.');
  };

  return {
    t,
    isRtl,
    data: ornData,
    handleSync,
    handleAutoRenew
  };
};
