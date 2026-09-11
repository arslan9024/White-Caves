import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useComplianceArchitectureLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());

  const handleReindex = () => {
    window.alert('Re-indexing Regulatory Document Registry...');
    setTimeout(() => {
      setLastSyncTime(new Date().toLocaleTimeString());
    }, 1000);
  };

  const handleRunRules = () => {
    window.alert('Running AML Rules Engine against all active portfolios...');
  };

  return {
    t,
    isRtl,
    lastSyncTime,
    handleReindex,
    handleRunRules
  };
};
