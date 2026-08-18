/** LeadImportCsvWizard.logic.ts */
import { useState, useCallback } from 'react';

export type WizardStep = 1 | 2 | 3;

export interface FieldMapping { csvColumn: string; crmField: string; }

const CRM_FIELDS = ['name', 'phone', 'email', 'budget', 'source', 'nationality', 'notes'];

export function useLeadImportCsvWizardLogic() {
  const [step, setStep] = useState<WizardStep>(1);
  const [fileName, setFileName] = useState<string>('');
  const [rowCount, setRowCount] = useState<number>(0);
  const [mappings, setMappings] = useState<FieldMapping[]>([
    { csvColumn: 'Full Name', crmField: 'name' },
    { csvColumn: 'Mobile', crmField: 'phone' },
    { csvColumn: 'E-mail', crmField: 'email' },
    { csvColumn: 'Budget AED', crmField: 'budget' },
    { csvColumn: 'Lead Source', crmField: 'source' },
  ]);

  const handleFileSelect = useCallback(() => {
    setFileName('leads_export_Aug2026.csv');
    setRowCount(247);
    setStep(2);
  }, []);

  const handleImport = useCallback(() => setStep(3), []);
  const handleReset = useCallback(() => { setStep(1); setFileName(''); setRowCount(0); }, []);

  return { step, fileName, rowCount, mappings, CRM_FIELDS, handleFileSelect, handleImport, handleReset };
}
