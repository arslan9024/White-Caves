import { useState } from 'react';
import en from './data/en.json';
import ar from './data/ar.json';
import { useLanguage } from '../../../context/LanguageContext';

export const useNOCDeveloperLogic = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const t = language === 'ar' ? ar : en;

  const [formData, setFormData] = useState({
    developerName: '',
    projectName: '',
    unitNumber: '',
    buyerName: '',
    sellerName: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [trackerStatus, setTrackerStatus] = useState(0); 
  // 0: Initial, 1: Drafted, 2: Sent, 3: Pending, 4: Approved

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setTrackerStatus(1);

      // Simulate the tracker moving forward automatically for demo purposes
      setTimeout(() => setTrackerStatus(2), 2000);
      setTimeout(() => setTrackerStatus(3), 4000);
      setTimeout(() => setTrackerStatus(4), 8000);
    }, 1500);
  };

  return {
    t,
    isRtl,
    formData,
    handleInputChange,
    handleGenerate,
    isGenerating,
    trackerStatus
  };
};
