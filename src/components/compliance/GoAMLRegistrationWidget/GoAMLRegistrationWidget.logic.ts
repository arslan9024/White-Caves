import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

type PaymentMethod = 'cash' | 'bank_transfer' | 'crypto' | 'cheque';
type ReportType = 'str' | 'sar' | 'dpmir';

export const useGoAMLRegistrationLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [reportType, setReportType] = useState<ReportType>('str');
  const [reason, setReason] = useState('');
  
  const [isFiling, setIsFiling] = useState(false);
  const [goAmlRef, setGoAmlRef] = useState<string | null>(null);

  const parsedAmount = parseFloat(amount) || 0;
  
  // Rule: Cash transactions >= 55,000 AED trigger mandatory reporting
  const isThresholdMet = paymentMethod === 'cash' && parsedAmount >= 55000;

  const isFormValid = clientName.trim() !== '' && parsedAmount > 0 && reason.trim() !== '';

  const handleFile = () => {
    if (!isFormValid) return;
    
    setIsFiling(true);
    setTimeout(() => {
      setIsFiling(false);
      setGoAmlRef(`FIU-${Math.floor(Math.random() * 900000) + 100000}-${new Date().getFullYear()}`);
    }, 2500);
  };

  return {
    t,
    isRtl,
    clientName,
    setClientName,
    amount,
    setAmount,
    paymentMethod,
    setPaymentMethod,
    reportType,
    setReportType,
    reason,
    setReason,
    isThresholdMet,
    isFiling,
    goAmlRef,
    isFormValid,
    handleFile
  };
};
