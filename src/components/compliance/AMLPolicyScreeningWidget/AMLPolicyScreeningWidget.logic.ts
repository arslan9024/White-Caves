import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useAMLPolicyScreeningLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [clientName, setClientName] = useState('');
  const [nationality, setNationality] = useState('');
  const [screeningType, setScreeningType] = useState<'cdd' | 'edd'>('cdd');
  const [enablePep, setEnablePep] = useState(true);
  const [enableSanctions, setEnableSanctions] = useState(true);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'clear' | 'flagged' | null>(null);
  const [riskScore, setRiskScore] = useState(0);

  const isFormValid = clientName.trim() !== '' && nationality.trim() !== '';

  const handleScan = () => {
    if (!isFormValid) return;
    
    setIsScanning(true);
    setScanResult(null);
    setRiskScore(0);
    
    setTimeout(() => {
      setIsScanning(false);
      // Simulate random result for demo purposes (mostly clear)
      const isFlagged = Math.random() > 0.8 || (screeningType === 'edd' && Math.random() > 0.5);
      setScanResult(isFlagged ? 'flagged' : 'clear');
      setRiskScore(isFlagged ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 20));
    }, 2500);
  };

  return {
    t,
    isRtl,
    clientName,
    setClientName,
    nationality,
    setNationality,
    screeningType,
    setScreeningType,
    enablePep,
    setEnablePep,
    enableSanctions,
    setEnableSanctions,
    isScanning,
    scanResult,
    riskScore,
    isFormValid,
    handleScan
  };
};
