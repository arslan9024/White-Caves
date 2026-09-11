import { useState, useCallback } from 'react';
import en from './data/en.json';
import ar from './data/ar.json';
import { useLanguage } from '../../../context/LanguageContext';

export const useAMLReportLogic = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const t = language === 'ar' ? ar : en;

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // Dummy data for the report
  const riskScore = 65; // Medium-High risk score out of 100
  const riskLevel = riskScore > 75 ? 'High' : riskScore > 45 ? 'Medium' : 'Low';
  
  const typologies = [
    { id: 1, name: t.typology_1, score: 70, level: 'high' },
    { id: 2, name: t.typology_2, score: 40, level: 'low' },
    { id: 3, name: t.typology_3, score: 85, level: 'high' },
    { id: 4, name: t.typology_4, score: 55, level: 'medium' }
  ];

  const handleGenerateReport = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 2500);
  }, []);

  return {
    t,
    isRtl,
    isGenerating,
    reportGenerated,
    riskScore,
    riskLevel,
    typologies,
    handleGenerateReport
  };
};
