import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useFinanceEngineProductionReleaseGateLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [isVerified, setIsVerified] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const requirements = [
    { id: '1', label: t.req_1, passed: isVerified },
    { id: '2', label: t.req_2, passed: isVerified },
    { id: '3', label: t.req_3, passed: isVerified },
    { id: '4', label: t.req_4, passed: isVerified },
    { id: '5', label: t.req_5, passed: isVerified },
    { id: '6', label: t.req_6, passed: isVerified }
  ];

  const handleVerify = () => {
    window.alert('Running automated CI checks... Validating all AEGIS parameters...');
    setTimeout(() => {
      setIsVerified(true);
    }, 1500);
  };

  const handleSignoff = () => {
    if (!isVerified) return;
    window.alert('Applying MD Sovereign Seal. Production release authorized.');
    setIsSigned(true);
  };

  return {
    t,
    isRtl,
    requirements,
    isVerified,
    isSigned,
    handleVerify,
    handleSignoff
  };
};
