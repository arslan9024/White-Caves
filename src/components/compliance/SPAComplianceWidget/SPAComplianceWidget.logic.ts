import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

type ClauseKey = 'clause_payment_plan' | 'clause_completion_date' | 'clause_dld_fees' | 'clause_dispute_resolution' | 'clause_escrow_account' | 'clause_force_majeure';

export const useSPAComplianceLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const [clauses, setClauses] = useState<Record<ClauseKey, boolean>>({
    clause_payment_plan: false,
    clause_completion_date: false,
    clause_dld_fees: false,
    clause_dispute_resolution: false,
    clause_escrow_account: false,
    clause_force_majeure: false,
  });

  const [isFiling, setIsFiling] = useState(false);
  const [fileSuccess, setFileSuccess] = useState(false);
  const [spaFile, setSpaFile] = useState<File | null>(null);

  const complianceScore = useMemo(() => {
    const total = Object.keys(clauses).length;
    const checked = Object.values(clauses).filter(Boolean).length;
    return Math.round((checked / total) * 100);
  }, [clauses]);

  const toggleClause = (key: ClauseKey) => {
    setClauses(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSpaFile(e.target.files[0]);
      // Simulate AI auto-checking some clauses based on PDF upload
      setTimeout(() => {
        setClauses(prev => ({
          ...prev,
          clause_payment_plan: true,
          clause_completion_date: true,
          clause_dld_fees: true,
        }));
      }, 800);
    }
  };

  const handleFiling = () => {
    if (complianceScore < 100 || !spaFile) return;
    setIsFiling(true);
    setTimeout(() => {
      setIsFiling(false);
      setFileSuccess(true);
    }, 2000);
  };

  const isReadyToFile = complianceScore === 100 && spaFile !== null;

  return {
    t,
    isRtl,
    clauses,
    toggleClause,
    complianceScore,
    handleFileUpload,
    spaFile,
    isFiling,
    fileSuccess,
    handleFiling,
    isReadyToFile
  };
};
