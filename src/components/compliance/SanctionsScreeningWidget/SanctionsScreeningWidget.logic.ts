import { useState, useCallback } from 'react';
import en from './data/en.json';
import ar from './data/ar.json';
import { useLanguage } from '../../../context/LanguageContext';

export interface ScanResult {
  id: string;
  clientName: string;
  timestamp: string;
  risk: 'high' | 'low';
  details: string;
}

export const useSanctionsLogic = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const t = language === 'ar' ? ar : en;

  const [isScanning, setIsScanning] = useState(false);
  const [databasesStatus, setDatabasesStatus] = useState<{ [key: string]: 'clear' | 'flagged' | 'pending' }>({
    un: 'clear',
    ofac: 'clear',
    eu: 'clear',
    local: 'pending',
  });

  const recentScans: ScanResult[] = [
    {
      id: 'scan-1',
      clientName: 'Ahmed Al Mansoori',
      timestamp: '2026-08-30T10:15:00Z',
      risk: 'low',
      details: 'No matches across all configured databases.',
    },
    {
      id: 'scan-2',
      clientName: 'John Doe Entity LLC',
      timestamp: '2026-08-29T14:30:00Z',
      risk: 'high',
      details: 'Partial match on OFAC SDN List. Review required.',
    }
  ];

  const handleManualScan = useCallback(() => {
    setIsScanning(true);
    setDatabasesStatus({ un: 'pending', ofac: 'pending', eu: 'pending', local: 'pending' });

    // Simulate scan delay
    setTimeout(() => {
      setDatabasesStatus({ un: 'clear', ofac: 'flagged', eu: 'clear', local: 'clear' });
      setIsScanning(false);
    }, 2500);
  }, []);

  const getStatusLabel = (status: 'clear' | 'flagged' | 'pending') => {
    switch (status) {
      case 'clear': return t.status_clear;
      case 'flagged': return t.status_flagged;
      case 'pending': return t.status_pending;
    }
  };

  return {
    t,
    isRtl,
    isScanning,
    databasesStatus,
    recentScans,
    handleManualScan,
    getStatusLabel,
    formatDate: (dateString: string) => new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  };
};
