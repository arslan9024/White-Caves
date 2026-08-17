import { useState, useEffect } from 'react';
import companyLedger from '../mocks/companyMasterLedger.json';

export interface DocumentExpiryAlert {
  docType: string;
  docNo: string;
  authority: string;
  expiryDate: string;
  daysRemaining: number;
  thresholdLevel: '30_DAYS_CRITICAL' | '60_DAYS_WARNING' | '90_DAYS_NOTICE' | 'HEALTHY';
  message: string;
}

export interface ProfileSchedulerState {
  alerts: DocumentExpiryAlert[];
  highestSeverity: 'CRITICAL' | 'WARNING' | 'NOTICE' | 'CLEAR';
  primaryTickerMessage: string | null;
  managingDirectorName: string;
}

export function useProfileScheduler(): ProfileSchedulerState {
  const [state, setState] = useState<ProfileSchedulerState>({
    alerts: [],
    highestSeverity: 'CLEAR',
    primaryTickerMessage: null,
    managingDirectorName: 'Arsalan Malik Bashir Ahmad',
  });

  useEffect(() => {
    const mdUser = companyLedger.find((p: any) => p.email === 'arslanmalikgoraha@gmail.com');
    const mdDocs = (mdUser as any)?.documents || [];
    const now = new Date();

    const activeAlerts: DocumentExpiryAlert[] = [];

    mdDocs.forEach((doc: Record<string, string>) => {
      const expDateStr = doc.expiryDate || doc.expiry_date;
      if (!expDateStr) return;

      // Handle DD-MM-YYYY or YYYY-MM-DD
      let expDate: Date;
      if (expDateStr.includes('-') && expDateStr.split('-')[0].length === 2) {
        const [day, month, year] = expDateStr.split('-');
        expDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      } else {
        expDate = new Date(expDateStr);
      }

      const diffMs = expDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      let thresholdLevel: DocumentExpiryAlert['thresholdLevel'] = 'HEALTHY';
      if (daysRemaining <= 30) {
        thresholdLevel = '30_DAYS_CRITICAL';
      } else if (daysRemaining <= 60) {
        thresholdLevel = '60_DAYS_WARNING';
      } else if (daysRemaining <= 90) {
        thresholdLevel = '90_DAYS_NOTICE';
      }

      if (thresholdLevel !== 'HEALTHY') {
        const docName = doc.type || doc.type_name || 'Corporate Document';
        const docNo = doc.docNo || doc.documentNo || 'N/A';
        const authority = doc.authority || 'Government Authority';

        activeAlerts.push({
          docType: docName,
          docNo,
          authority,
          expiryDate: expDateStr,
          daysRemaining,
          thresholdLevel,
          message: `🚨 RENEWAL ALERT: ${docName} (${docNo}) expires in ${daysRemaining} days on ${expDateStr} [${authority}]`,
        });
      }
    });

    let highestSeverity: ProfileSchedulerState['highestSeverity'] = 'CLEAR';
    if (activeAlerts.some((a) => a.thresholdLevel === '30_DAYS_CRITICAL')) {
      highestSeverity = 'CRITICAL';
    } else if (activeAlerts.some((a) => a.thresholdLevel === '60_DAYS_WARNING')) {
      highestSeverity = 'WARNING';
    } else if (activeAlerts.some((a) => a.thresholdLevel === '90_DAYS_NOTICE')) {
      highestSeverity = 'NOTICE';
    }

    const primaryTickerMessage =
      activeAlerts.length > 0
        ? activeAlerts.map((a) => a.message).join('  ///  ')
        : '✓ White Caves Corporate Credentials Fully Verified — DET License #1388443 | RERA ORN #44483 | Ejari #0120250814005322';

    setState({
      alerts: activeAlerts,
      highestSeverity,
      primaryTickerMessage,
      managingDirectorName: mdUser?.name || 'Arsalan Malik Bashir Ahmad',
    });
  }, []);

  return state;
}
