import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import en from './data/en.json';
import ar from './data/ar.json';

export const useFinanceEngineFTAComplianceLogic = () => {
  const isRtl = useSelector((state: RootState) => state.language.isRtl);
  const t = isRtl ? ar : en;

  const coaData = [
    { id: 'assets', label: t.coa_asset, value: '1000 - 1999', iconColor: 'var(--color-3b82f6, #3B82F6)' },
    { id: 'liabilities', label: t.coa_liability, value: '2000 - 2999', iconColor: 'var(--accent-red, #EF4444)' },
    { id: 'equity', label: t.coa_equity, value: '3000 - 3999', iconColor: 'var(--accent-gold, #D4AF37)' },
    { id: 'revenue', label: t.coa_revenue, value: '4000 - 4999', iconColor: 'var(--color-10b981, #10B981)' },
    { id: 'expense', label: t.coa_expense, value: '5000 - 5999', iconColor: 'var(--color-f97316, #F97316)' }
  ];

  const handleExport = () => {
    const json = JSON.stringify(coaData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart_of_accounts_schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    t,
    isRtl,
    coaData,
    handleExport
  };
};
