import { useState, useEffect } from 'react';
import en from './data/en.json';
import ar from './data/ar.json';
import { useLanguage } from '../../../context/LanguageContext';

export interface Course {
  id: string;
  title: string;
  date: string;
  hours: number;
  status: 'available' | 'completed';
}

export const useTrainingTrackerLogic = () => {
  const { language } = useLanguage();
  const isRtl = language === 'ar';
  const t = language === 'ar' ? ar : en;

  // Mock data for the demo
  const [completedHours, setCompletedHours] = useState(8);
  const targetHours = 12;
  const deadline = new Date(new Date().getFullYear(), 11, 31); // Dec 31st of current year

  const percentage = Math.min(100, Math.round((completedHours / targetHours) * 100));
  
  let status: 'compliant' | 'at_risk' | 'non_compliant' = 'compliant';
  if (percentage < 100) {
    const daysUntilDeadline = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (daysUntilDeadline < 30) {
      status = 'non_compliant';
    } else if (daysUntilDeadline < 90) {
      status = 'at_risk';
    } else {
      status = 'at_risk'; // Still at risk if not 100%
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'compliant': return t.status_compliant;
      case 'at_risk': return t.status_at_risk;
      case 'non_compliant': return t.status_non_compliant;
      default: return t.status_at_risk;
    }
  };

  const upcomingCourses: Course[] = [
    {
      id: 'c1',
      title: 'UAE Anti-Money Laundering (AML) Compliance 2026',
      date: '2026-10-15',
      hours: 4,
      status: 'available'
    },
    {
      id: 'c2',
      title: 'Dubai Real Estate Law Updates',
      date: '2026-11-05',
      hours: 2,
      status: 'available'
    }
  ];

  const handleRegister = (courseId: string) => {
    console.log(`Registering for course ${courseId}...`);
    // Logic to register for course
  };

  return {
    t,
    isRtl,
    completedHours,
    targetHours,
    percentage,
    status,
    getStatusText,
    deadline: deadline.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    upcomingCourses,
    handleRegister
  };
};
