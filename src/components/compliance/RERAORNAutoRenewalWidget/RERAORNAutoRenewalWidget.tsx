import React, { FC } from 'react';
import { ShieldCheck, AlertTriangle, RefreshCw, Server, CheckCircle2, Circle } from 'lucide-react';
import { useRERAORNAutoRenewalLogic } from './RERAORNAutoRenewalWidget.logic';
import {
  WidgetContainer,
  WidgetHeader,
  AlertBanner,
  InfoCardGrid,
  InfoCard,
  WorkflowContainer,
  StepList,
  StepItem,
  ActionsContainer,
  ActionButton
} from './RERAORNAutoRenewalWidget.style';

export const RERAORNAutoRenewalWidget: FC = () => {
  const {
    t,
    isRtl,
    data,
    handleSync,
    handleAutoRenew
  } = useRERAORNAutoRenewalLogic();

  return (
    <WidgetContainer $isRtl={isRtl}>
      <WidgetHeader>
        <div>
          <h3><ShieldCheck size={28} /> {t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
      </WidgetHeader>

      {data.status === 'expiring' && (
        <AlertBanner $type="warning">
          <AlertTriangle size={20} />
          <span>{t.alert_warning.replace('{days}', data.daysRemaining.toString())}</span>
        </AlertBanner>
      )}

      <InfoCardGrid>
        <InfoCard>
          <span className="label">{t.orn_number}</span>
          <span className="value mono">{data.ornNumber}</span>
        </InfoCard>
        <InfoCard>
          <span className="label">{t.trade_license}</span>
          <span className="value mono">{data.tradeLicense}</span>
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

      <WorkflowContainer>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-1e293b)' }}>Renewal Workflow</h4>
        <StepList>
          {data.steps.map((step) => (
            <StepItem key={step.id} $status={step.status}>
              <div className="icon-wrapper">
                {step.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </div>
              <span className="step-label">{step.label}</span>
            </StepItem>
          ))}
        </StepList>
      </WorkflowContainer>

      <ActionsContainer>
        <ActionButton $variant="secondary" onClick={handleSync}>
          <Server size={18} /> {t.btn_sync}
        </ActionButton>
        <ActionButton $variant="primary" onClick={handleAutoRenew}>
          <RefreshCw size={18} /> {t.btn_renew}
        </ActionButton>
      </ActionsContainer>

    </WidgetContainer>
  );
};
