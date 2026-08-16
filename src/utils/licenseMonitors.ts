export type LicenseName = 'DET' | 'RERA' | 'EJARI' | 'ICP';

export interface LicenseStatus {
  name: LicenseName;
  idNumber: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'ACTIVE' | 'WARNING_90' | 'WARNING_30' | 'EXPIRED';
}

const LICENSES = [
  { name: 'DET' as LicenseName, idNumber: '1388443', expiryDate: '2026-07-31' },
  { name: 'RERA' as LicenseName, idNumber: '44483', expiryDate: '2026-08-15' },
  { name: 'EJARI' as LicenseName, idNumber: '0120250814005322', expiryDate: '2026-10-01' },
  { name: 'ICP' as LicenseName, idNumber: '2/1/1192499', expiryDate: '2026-11-20' },
];

export const getLicenseStatuses = (currentDate: Date = new Date()): LicenseStatus[] => {
  return LICENSES.map(license => {
    const expiry = new Date(license.expiryDate);
    const timeDiff = expiry.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let status: LicenseStatus['status'] = 'ACTIVE';
    if (daysRemaining <= 0) {
      status = 'EXPIRED';
    } else if (daysRemaining <= 30) {
      status = 'WARNING_30';
    } else if (daysRemaining <= 90) {
      status = 'WARNING_90';
    }

    return {
      ...license,
      daysRemaining,
      status
    };
  });
};

export const hasExpiringLicenses = (statuses: LicenseStatus[]): boolean => {
  return statuses.some(s => s.status !== 'ACTIVE');
};
