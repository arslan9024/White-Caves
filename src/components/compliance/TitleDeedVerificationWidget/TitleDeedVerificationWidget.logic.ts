import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

interface VerificationResult {
  status: 'verified' | 'fraud' | 'mismatch';
  dldReference: string;
  propertyType: string;
  municipality: string;
  area: string;
  issueDate: string;
  sharePercentage: string;
}

export const useTitleDeedVerificationLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [certNumber, setCertNumber] = useState('');
  const [certYear, setCertYear] = useState(new Date().getFullYear().toString());
  const [ownerName, setOwnerName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleValidate = () => {
    if (!certNumber) return;
    
    setIsVerifying(true);
    setResult(null);

    setTimeout(() => {
      // Mock validation logic
      let status: 'verified' | 'fraud' | 'mismatch' = 'verified';
      
      if (certNumber.includes('FRAUD') || certNumber === '0000') {
        status = 'fraud';
      } else if (ownerName && ownerName.toLowerCase().includes('wrong')) {
        status = 'mismatch';
      }

      setResult({
        status,
        dldReference: `DLD-${Math.floor(Math.random() * 10000000)}`,
        propertyType: 'Apartment',
        municipality: 'Dubai',
        area: 'Downtown Dubai',
        issueDate: `${certYear}-05-12`,
        sharePercentage: '100%'
      });
      setIsVerifying(false);
    }, 1500);
  };

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCertNumber(`QR-${Math.floor(Math.random() * 100000)}`);
      setCertYear('2024');
      setOwnerName('Jane Doe');
      // Auto validate upon upload
      setTimeout(() => {
        handleValidate();
      }, 500);
    }
  };

  return {
    t,
    isRtl,
    certNumber,
    setCertNumber,
    certYear,
    setCertYear,
    ownerName,
    setOwnerName,
    isVerifying,
    result,
    handleValidate,
    handleQRUpload
  };
};
