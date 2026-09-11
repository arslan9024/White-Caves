import { useState } from 'react';
import en from './data/en.json';
import ar from './data/ar.json';
import { useLanguage } from '../../../context/LanguageContext';

const MOCK_MORTGAGES = [
  { id: 'MTG-8812', client: 'Ahmed Al Maktoum', propertyId: 'PRP-9844-DXB', amount: 3500000 },
  { id: 'MTG-8813', client: 'Sarah Johnson', propertyId: 'PRP-7721-DXB', amount: 1500000 },
  { id: 'MTG-8814', client: 'Mikhail Ivanov', propertyId: 'PRP-3390-DXB', amount: 5000000 }
];

const DLD_FEE_RATE = 0.0025; // 0.25%
const KNOWLEDGE_INNOVATION_FEE = 290; // Standard fixed fee AED 290

export const useMortgageRegistrationLogic = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const t = language === 'ar' ? ar : en;

  const [selectedMortgageId, setSelectedMortgageId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackerStatus, setTrackerStatus] = useState(0); 
  // 0: Initial, 1: Submitted, 2: Payment Pending, 3: Registered

  const selectedMortgage = MOCK_MORTGAGES.find(m => m.id === selectedMortgageId);
  
  const dldFee = selectedMortgage ? selectedMortgage.amount * DLD_FEE_RATE : 0;
  const grandTotal = dldFee > 0 ? dldFee + KNOWLEDGE_INNOVATION_FEE : 0;

  const handleSubmit = () => {
    if (!selectedMortgageId) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setTrackerStatus(1);
      
      // Auto advance for demo purposes
      setTimeout(() => setTrackerStatus(2), 2000);
      setTimeout(() => setTrackerStatus(3), 6000);
    }, 1500);
  };

  return {
    t,
    isRtl,
    selectedMortgageId,
    setSelectedMortgageId,
    selectedMortgage,
    mortgages: MOCK_MORTGAGES,
    dldFee,
    knowledgeFee: KNOWLEDGE_INNOVATION_FEE,
    grandTotal,
    handleSubmit,
    isSubmitting,
    trackerStatus
  };
};
