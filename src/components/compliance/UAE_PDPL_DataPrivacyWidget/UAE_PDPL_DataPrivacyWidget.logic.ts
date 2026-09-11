import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useUAEPDPLDataPrivacyLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [thirdPartyConsent, setThirdPartyConsent] = useState(false);
  const [biometricConsent, setBiometricConsent] = useState(true); // Default true for KYC
  
  const [purpose, setPurpose] = useState('sales');
  const [retention, setRetention] = useState('5_years');
  
  const [isLogging, setIsLogging] = useState(false);
  const [pdplRef, setPdplRef] = useState<string | null>(null);

  const isFormValid = clientName.trim() !== '' && email.trim() !== '';

  const handleLogConsent = () => {
    if (!isFormValid) return;
    
    setIsLogging(true);
    setTimeout(() => {
      setIsLogging(false);
      setPdplRef(`PDPL-${Math.floor(Math.random() * 9000000) + 1000000}`);
    }, 2000);
  };

  const handleDownloadDPA = () => {
    window.alert('Downloading DPA Contract PDF...');
  };

  return {
    t,
    isRtl,
    clientName,
    setClientName,
    email,
    setEmail,
    phone,
    setPhone,
    marketingConsent,
    setMarketingConsent,
    thirdPartyConsent,
    setThirdPartyConsent,
    biometricConsent,
    setBiometricConsent,
    purpose,
    setPurpose,
    retention,
    setRetention,
    isLogging,
    pdplRef,
    isFormValid,
    handleLogConsent,
    handleDownloadDPA
  };
};
