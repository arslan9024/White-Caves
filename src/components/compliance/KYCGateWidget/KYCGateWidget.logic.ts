import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

type DocStatus = 'idle' | 'uploading' | 'scanning' | 'verified';

export const useKYCGateLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [emiratesIdStatus, setEmiratesIdStatus] = useState<DocStatus>('idle');
  const [passportStatus, setPassportStatus] = useState<DocStatus>('idle');
  const [sourceOfFundsStatus, setSourceOfFundsStatus] = useState<DocStatus>('idle');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const simulateScan = (setter: React.Dispatch<React.SetStateAction<DocStatus>>) => {
    setter('scanning');
    setTimeout(() => {
      setter('verified');
    }, 2500);
  };

  const handleEmiratesIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateScan(setEmiratesIdStatus);
    }
  };

  const handlePassportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateScan(setPassportStatus);
    }
  };

  const handleSourceOfFundsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSourceOfFundsStatus('uploading');
      setTimeout(() => {
        setSourceOfFundsStatus('verified');
      }, 1500);
    }
  };

  const isFormComplete = emiratesIdStatus === 'verified' && passportStatus === 'verified' && sourceOfFundsStatus === 'verified';

  const handleSubmit = () => {
    if (!isFormComplete) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return {
    t,
    isRtl,
    emiratesIdStatus,
    passportStatus,
    sourceOfFundsStatus,
    handleEmiratesIdUpload,
    handlePassportUpload,
    handleSourceOfFundsUpload,
    isFormComplete,
    isSubmitting,
    isSuccess,
    handleSubmit
  };
};
