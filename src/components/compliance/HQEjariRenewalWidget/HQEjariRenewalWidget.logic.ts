import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useHQEjariRenewalLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  // Hardcoded for issue specific number `0120250814005322` and location `D-72 El Shaye-4, Deira`
  const ejariData = {
    ejariNumber: '0120250814005322',
    location: 'D-72 El Shaye-4, Deira, Dubai',
    landlord: 'Dubai Real Estate Corporation (DREC)',
    issueDate: '2025-08-14',
    expiryDate: '2026-08-13',
    status: 'expiring' as 'active' | 'expiring' | 'expired',
    daysRemaining: 15,
    dewaPremise: '381920045',
    makaniNumber: '30491 85930',
    documentsReady: {
      tradeLicense: true,
      emiratesId: true,
      titleDeed: false,
      dewaBill: true
    }
  };

  const handleRenew = () => {
    window.alert('Redirecting to Dubai REST App / DLD Portal for Ejari renewal.');
  };

  const handleUpload = () => {
    window.alert('Opening document upload dialog for new Ejari contract.');
  };

  return {
    t,
    isRtl,
    data: ejariData,
    handleRenew,
    handleUpload
  };
};
