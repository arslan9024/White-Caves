import React, { FC } from 'react';
import { Briefcase, AlertTriangle, PlayCircle, CheckCircle2, Clock, Circle } from 'lucide-react';
import { useDETLicenseMonitorLogic } from './DETLicenseMonitorWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  AlertBanner,
  InfoCardGrid,
  InfoCard,
  PhaseContainer,
  PhaseCard,
  ActionsContainer,
  ActionButton
} from './DETLicenseMonitorWidget.style';

export const DETLicenseMonitorWidget: FC = () => {
  const {
    t,
    isRtl,
    data,
    currentPhase,
    handleRenew
  } = useDETLicenseMonitorLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <div>
          <h3><Briefcase size={28} /> {t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
      </WidgetHeader>

      {currentPhase !== 'active' && (
        <AlertBanner $type={currentPhase === 'expired' || currentPhase === 'phase_30' ? 'danger' : 'warning'}>
          <AlertTriangle size={20} />
          <span>
            {t.alert_warning
              .replace('{days}', data.daysRemaining.toString())
              .replace('{phase}', t[currentPhase as keyof typeof t] || '')}
          </span>
        </AlertBanner>
      )}

      <InfoCardGrid>
        <InfoCard>
          <span className="label">{t.license_number}</span>
          <span className="value mono">{data.licenseNumber}</span>
        </InfoCard>
        <InfoCard>
          <span className="label">{t.issue_date}</span>
          <span className="value">{data.issueDate}</span>
        </InfoCard>
        <InfoCard>
          <span className="label">{t.expiry_date}</span>
          <span className="value">{data.expiryDate}</span>
        </InfoCard>
        <InfoCard>
          <span className="label">{t.days_left}</span>
          <span className="value" style={{ color: data.daysRemaining < 30 ? 'var(--color-dc2626)' : 'inherit' }}>
            {data.daysRemaining}
          </span>
        </InfoCard>
      </InfoCardGrid>

      <PhaseContainer>
        <PhaseCard $active={currentPhase === 'phase_90'} $past={data.daysRemaining <= 60}>
          <div className="icon">
            {data.daysRemaining <= 60 ? <CheckCircle2 size={24} /> : currentPhase === 'phase_90' ? <PlayCircle size={24} /> : <Circle size={24} />}
          </div>
          <span className="text">{t.phase_90}</span>
        </PhaseCard>
        
        <PhaseCard $active={currentPhase === 'phase_60'} $past={data.daysRemaining <= 30}>
          <div className="icon">
            {data.daysRemaining <= 30 ? <CheckCircle2 size={24} /> : currentPhase === 'phase_60' ? <PlayCircle size={24} /> : <Circle size={24} />}
          </div>
          <span className="text">{t.phase_60}</span>
        </PhaseCard>

        <PhaseCard $active={currentPhase === 'phase_30'} $past={data.daysRemaining <= 0}>
          <div className="icon">
            {data.daysRemaining <= 0 ? <CheckCircle2 size={24} /> : currentPhase === 'phase_30' ? <AlertTriangle size={24} /> : <Circle size={24} />}
          </div>
          <span className="text">{t.phase_30}</span>
        </PhaseCard>
      </PhaseContainer>

      <ActionsContainer>
        <ActionButton onClick={handleRenew}>
          <PlayCircle size={18} /> {t.btn_renew}
        </ActionButton>
      </ActionsContainer>
    </WidgetContainer>
  );
};
