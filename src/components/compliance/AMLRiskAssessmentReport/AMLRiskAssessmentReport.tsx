import React, { FC } from 'react';
import { FileText, ShieldAlert, Download, Activity, FileSearch } from 'lucide-react';
import { useAMLReportLogic } from './AMLRiskAssessmentReport.logic';
import {
  WidgetContainer,
  WidgetHeader,
  ActionButton,
  DashboardGrid,
  ScoreCard,
  MatrixTable,
  MatrixRow,
  EmptyState
} from './AMLRiskAssessmentReport.style';

export const AMLRiskAssessmentReport: FC = () => {
  const {
    t,
    isRtl,
    isGenerating,
    reportGenerated,
    riskScore,
    riskLevel,
    typologies,
    handleGenerateReport
  } = useAMLReportLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <h3><FileText size={28} /> {t.title}</h3>
        <p>{t.subtitle}</p>
      </WidgetHeader>

      {!reportGenerated ? (
        <EmptyState>
          <FileSearch size={48} />
          <p>The annual AML risk assessment report evaluates customer typologies, jurisdictional risks, and transactional patterns.</p>
          <ActionButton 
            $primary 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
          >
            {isGenerating ? <Activity size={20} className="spinner" /> : <ShieldAlert size={20} />}
            {isGenerating ? t.generating : t.generate_report}
          </ActionButton>
        </EmptyState>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <ActionButton>
              <Download size={18} />
              {t.download_pdf}
            </ActionButton>
          </div>
          
          <DashboardGrid>
            <ScoreCard $level={riskLevel}>
              <ShieldAlert size={32} color={
                riskLevel === 'High' ? '#EF4444' : 
                riskLevel === 'Medium' ? '#F59E0B' : '#10B981'
              } />
              <div className="score-value">{riskScore}</div>
              <div className="score-label">{t.risk_score}</div>
              <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 600 }}>
                {riskLevel === 'High' ? t.high_risk : 
                 riskLevel === 'Medium' ? t.medium_risk : t.low_risk}
              </div>
            </ScoreCard>

            <MatrixTable>
              <h4>{t.risk_matrix}</h4>
              {typologies.map((item) => (
                <MatrixRow key={item.id} $level={item.level}>
                  <div className="name">{item.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.score}/100</div>
                    <div className="badge">
                      {item.level === 'high' ? t.high_risk : 
                       item.level === 'medium' ? t.medium_risk : t.low_risk}
                    </div>
                  </div>
                </MatrixRow>
              ))}
            </MatrixTable>
          </DashboardGrid>
        </>
      )}
    </WidgetContainer>
  );
};
