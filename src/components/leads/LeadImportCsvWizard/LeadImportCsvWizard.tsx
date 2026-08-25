/** LeadImportCsvWizard.tsx — View Layer */
import React, { FC } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { useLeadImportCsvWizardLogic } from './logic/LeadImportCsvWizard.logic';
import { Root, StepIndicator, StepDot, Title, DropZone, MapRow, MapLabel, Arrow, MapSelect, ImportBtn, SuccessBanner } from './styles/LeadImportCsvWizard.style';

export const LeadImportCsvWizard: FC = () => {
  const { step, fileName, rowCount, mappings, CRM_FIELDS, handleFileSelect, handleImport, handleReset } = useLeadImportCsvWizardLogic();
  return (
    <Root data-testid="lead-import-wizard">
      <StepIndicator>
        {[1,2,3].map((n) => (
          <StepDot key={n} $active={step === n} $done={step > n}>{step > n ? '✓' : n}</StepDot>
        ))}
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #64748b)', marginLeft: '0.5rem' }}>
          {step === 1 ? 'Upload CSV' : step === 2 ? 'Map Fields' : 'Import Complete'}
        </span>
      </StepIndicator>
      {step === 1 && (
        <>
          <Title>Upload Lead CSV File</Title>
          <DropZone onClick={handleFileSelect}>
            <Upload size={32} color="var(--accent-red, #EF4444)" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
            <div style={{ fontWeight: 600, color: 'var(--color-1e293b, #1e293b)' }}>Click to select CSV file</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-94a3b8, #94a3b8)', marginTop: '0.25rem' }}>Max 10,000 rows · UTF-8 encoding</div>
          </DropZone>
        </>
      )}
      {step === 2 && (
        <>
          <Title>Map CSV Columns → CRM Fields</Title>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #64748b)', marginBottom: '0.75rem' }}>
            File: <strong>{fileName}</strong> — {rowCount} rows detected
          </div>
          {mappings.map((m, i) => (
            <MapRow key={i}>
              <MapLabel>{m.csvColumn}</MapLabel>
              <Arrow>→</Arrow>
              <MapSelect defaultValue={m.crmField}>
                {CRM_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
              </MapSelect>
            </MapRow>
          ))}
          <ImportBtn onClick={handleImport}>Import {rowCount} Leads</ImportBtn>
        </>
      )}
      {step === 3 && (
        <SuccessBanner>
          <CheckCircle size={40} color="var(--accent-green, #22C55E)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-15803d, #15803d)' }}>{rowCount} leads imported successfully!</div>
          <button onClick={handleReset} style={{ marginTop: '1rem', color: 'var(--accent-red, #ef4444)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Import another file
          </button>
        </SuccessBanner>
      )}
    </Root>
  );
};
export default LeadImportCsvWizard;
