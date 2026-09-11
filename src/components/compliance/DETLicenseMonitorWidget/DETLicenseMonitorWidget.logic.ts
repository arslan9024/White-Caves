import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useDETLicenseMonitorLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  // Hardcoded for issue specific number `1388443`
  const licenseData = {
    licenseNumber: '1388443',
    issueDate: '2025-10-15',
    expiryDate: '2026-10-15',
    daysRemaining: 45, // Example value falling in the 60-day phase
  };

  const currentPhase = useMemo(() => {
    const d = licenseData.daysRemaining;
    if (d > 90) return 'active';
    if (d > 60) return 'phase_90';
    if (d > 30) return 'phase_60';
    if (d > 0) return 'phase_30';
    return 'expired';
  }, [licenseData.daysRemaining]);

  const handleRenew = () => {
    window.alert('Redirecting to DET / Invest in Dubai portal...');
  };

  return {
    t,
    isRtl,
    data: licenseData,
    currentPhase,
    handleRenew
  };
};
