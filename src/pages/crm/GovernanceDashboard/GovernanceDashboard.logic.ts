import { useState, useEffect } from 'react';
import { getLicenseStatuses, LicenseStatus } from '../../../utils/licenseMonitors';

export const useGovernanceDashboardLogic = () => {
  const [statuses, setStatuses] = useState<LicenseStatus[]>([]);

  useEffect(() => {
    setStatuses(getLicenseStatuses());
  }, []);

  return {
    statuses,
  };
};
