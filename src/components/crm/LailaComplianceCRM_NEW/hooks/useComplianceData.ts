import { useState, useCallback } from 'react';
import { KYC_VERIFICATIONS, CONTRACTS, AML_ALERTS, KYCVerification, Contract, AMLAlert } from '../data/compliance';
import { COMPLIANCE_FEATURES } from '../data/features';

export const useComplianceData =() => {
  const [kycVerifications, setKycVerifications] = useState<KYCVerification[]>(KYC_VERIFICATIONS);
  const [contracts, setContracts] = useState<Contract[]>(CONTRACTS);
  const [amlAlerts, setAmlAlerts] = useState<AMLAlert[]>(AML_ALERTS);

  const complianceStats = {
    verified: 156,
    verifiedChange: 12,
    pending: 23,
    amlAlerts: 3,
    contracts: contracts.length
  };

  const handleApproveVerification = useCallback((verificationId: number) => {
    setKycVerifications(prev =>
      prev.map(v =>
        v.id === verificationId ? { ...v, status: 'verified' } : v
      )
    );
  }, []);

  const handleRejectVerification = useCallback((verificationId: number) => {
    setKycVerifications(prev =>
      prev.map(v =>
        v.id === verificationId ? { ...v, status: 'rejected' } : v
      )
    );
  }, []);

  const handleApproveContract = useCallback((contractId: number) => {
    setContracts(prev =>
      prev.map(c =>
        c.id === contractId ? { ...c, status: 'approved' } : c
      )
    );
  }, []);

  const handleAlertResolution = useCallback((alertId: number) => {
    setAmlAlerts(prev =>
      prev.map(a =>
        a.id === alertId ? { ...a, status: 'cleared' } : a
      )
    );
  }, []);

  return {
    kycVerifications,
    contracts,
    amlAlerts,
    complianceStats,
    handleApproveVerification,
    handleRejectVerification,
    handleApproveContract,
    handleAlertResolution,
    features: COMPLIANCE_FEATURES
  };
};
