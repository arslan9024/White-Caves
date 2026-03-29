import { useState, useCallback, useMemo } from 'react';
import { KYC_VERIFICATIONS, CONTRACTS, AML_ALERTS, KYCVerification, Contract, AMLAlert } from '../data/compliance';
import { COMPLIANCE_FEATURES } from '../data/features';

export const useComplianceData =() => {
  const [kycVerifications, setKycVerifications] = useState<KYCVerification[]>(KYC_VERIFICATIONS);
  const [contracts, setContracts] = useState<Contract[]>(CONTRACTS);
  const [amlAlerts, setAmlAlerts] = useState<AMLAlert[]>(AML_ALERTS);

  // Derive stats from actual data instead of hardcoded values
  const complianceStats = useMemo(() => ({
    verified: kycVerifications.filter(v => v.status === 'verified').length,
    pending: kycVerifications.filter(v => v.status === 'pending').length,
    amlAlerts: amlAlerts.filter(a => a.status !== 'cleared').length,
    contracts: contracts.length,
  }), [kycVerifications, amlAlerts, contracts]);

  const handleApproveVerification = useCallback((verificationId: string | number) => {
    setKycVerifications(prev =>
      prev.map(v =>
        v.id === verificationId ? { ...v, status: 'verified' } : v
      )
    );
  }, []);

  const handleRejectVerification = useCallback((verificationId: string | number) => {
    setKycVerifications(prev =>
      prev.map(v =>
        v.id === verificationId ? { ...v, status: 'rejected' } : v
      )
    );
  }, []);

  const handleApproveContract = useCallback((contractId: string | number) => {
    setContracts(prev =>
      prev.map(c =>
        c.id === contractId ? { ...c, status: 'approved' } : c
      )
    );
  }, []);

  const handleAlertResolution = useCallback((alertId: string | number) => {
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
