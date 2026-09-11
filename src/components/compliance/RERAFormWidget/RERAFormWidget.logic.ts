import { useState } from 'react';
import en from './data/en.json';
import ar from './data/ar.json';
import { useLanguage } from '../../../context/LanguageContext';

const MOCK_DEALS = [
  { id: 'DL-10023', value: '4,500,000', client: 'Ahmed Al Maktoum', propertyId: 'PRP-9844-DXB' },
  { id: 'DL-10024', value: '2,150,000', client: 'Sarah Johnson', propertyId: 'PRP-7721-DXB' },
  { id: 'DL-10025', value: '8,900,000', client: 'Mikhail Ivanov', propertyId: 'PRP-3390-DXB' }
];

export const useRERAFormLogic = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const t = language === 'ar' ? ar : en;

  const [selectedDealId, setSelectedDealId] = useState('');
  const [selectedForm, setSelectedForm] = useState('form_a');
  const [isGenerating, setIsGenerating] = useState(false);
  const [trackerStatus, setTrackerStatus] = useState(0); 
  // 0: Initial, 1: Populated, 2: Sent, 3: Signed

  const selectedDeal = MOCK_DEALS.find(d => d.id === selectedDealId);

  const handleGenerate = () => {
    if (!selectedDealId) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setTrackerStatus(1);
    }, 1500);
  };

  const handleESign = () => {
    setTrackerStatus(2);
    setTimeout(() => setTrackerStatus(3), 3000);
  };

  return {
    t,
    isRtl,
    selectedDealId,
    setSelectedDealId,
    selectedForm,
    setSelectedForm,
    selectedDeal,
    deals: MOCK_DEALS,
    handleGenerate,
    handleESign,
    isGenerating,
    trackerStatus,
    setTrackerStatus
  };
};
