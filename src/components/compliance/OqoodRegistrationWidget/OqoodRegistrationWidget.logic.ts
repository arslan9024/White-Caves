import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useOqoodRegistrationLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [buyerName, setBuyerName] = useState('');
  const [buyerPassport, setBuyerPassport] = useState('');
  const [buyerNationality, setBuyerNationality] = useState('');
  
  const [developerName, setDeveloperName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  
  const [purchasePrice, setPurchasePrice] = useState('');
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<string | null>(null);

  const parsedPrice = parseFloat(purchasePrice) || 0;
  
  const oqoodFee = useMemo(() => {
    return parsedPrice * 0.04;
  }, [parsedPrice]);

  const adminFee = 1130; // AED 1130 standard admin fee + knowledge fee

  const totalPayable = oqoodFee + adminFee;

  const isFormValid = buyerName && buyerPassport && developerName && projectName && unitNumber && parsedPrice > 0;

  const handleRegister = () => {
    if (!isFormValid) return;
    
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      setSuccessReceipt(`${Math.floor(Math.random() * 10000000)}`);
    }, 2000);
  };

  return {
    t,
    isRtl,
    buyerName,
    setBuyerName,
    buyerPassport,
    setBuyerPassport,
    buyerNationality,
    setBuyerNationality,
    developerName,
    setDeveloperName,
    projectName,
    setProjectName,
    unitNumber,
    setUnitNumber,
    purchasePrice,
    setPurchasePrice,
    oqoodFee,
    adminFee,
    totalPayable,
    isFormValid,
    isRegistering,
    successReceipt,
    handleRegister
  };
};
