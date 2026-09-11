import React, { FC } from 'react';
import { FileSignature, UploadCloud, CheckCircle2, Clock, Check, FileCheck } from 'lucide-react';
import { useSPAComplianceLogic } from './SPAComplianceWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  ScoreSection,
  ProgressBar,
  ChecklistContainer,
  ChecklistItem,
  FileUploadArea,
  SubmitButton,
  SuccessMessage
} from './SPAComplianceWidget.style';

type ClauseKey = 'clause_payment_plan' | 'clause_completion_date' | 'clause_dld_fees' | 'clause_dispute_resolution' | 'clause_escrow_account' | 'clause_force_majeure';

export const SPAComplianceWidget: FC = () => {
  const {
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
  } = useSPAComplianceLogic();

  const clauseKeys: ClauseKey[] = [
    'clause_payment_plan',
    'clause_completion_date',
    'clause_dld_fees',
    'clause_dispute_resolution',
    'clause_escrow_account',
    'clause_force_majeure'
  ];

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <h3><FileSignature size={28} /> {t.title}</h3>
        <p>{t.subtitle}</p>
      </WidgetHeader>

      <ScoreSection>
        <div className="score-info">
          <h4>{t.progress}: {complianceScore}%</h4>
          <ProgressBar $progress={complianceScore} />
        </div>
      </ScoreSection>

      <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b)' }}>
        {t.checklist_header}
      </h4>

      <ChecklistContainer>
        {clauseKeys.map(key => (
          <ChecklistItem 
            key={key} 
            $checked={clauses[key]} 
            onClick={() => toggleClause(key)}
          >
            <div className="checkbox">
              {clauses[key] && <Check size={14} strokeWidth={4} />}
            </div>
            <span className="label">{(t as any)[key]}</span>
          </ChecklistItem>
        ))}
      </ChecklistContainer>

      <FileUploadArea $hasFile={spaFile !== null}>
        <input type="file" accept=".pdf" onChange={handleFileUpload} />
        {spaFile ? <FileCheck size={40} className="icon" /> : <UploadCloud size={40} className="icon" />}
        <span className="text">{spaFile ? spaFile.name : t.upload_spa}</span>
      </FileUploadArea>

      <SubmitButton onClick={handleFiling} $disabled={!isReadyToFile || isFiling || fileSuccess}>
        {isFiling ? <Clock size={20} className="spinner" /> : <CheckCircle2 size={20} />}
        {isFiling ? t.filing : t.file_dld}
      </SubmitButton>

      {fileSuccess && (
        <SuccessMessage>
          <CheckCircle2 size={24} />
          <span>{t.success}</span>
        </SuccessMessage>
      )}
    </WidgetContainer>
  );
};
