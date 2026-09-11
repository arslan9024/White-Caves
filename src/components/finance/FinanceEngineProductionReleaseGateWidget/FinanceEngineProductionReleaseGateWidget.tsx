import React from 'react';
import {
  WidgetContainer,
  WidgetHeader,
  StatusBanner,
  RequirementsList,
  RequirementItem,
  ActionsContainer,
  ActionButton
} from './FinanceEngineProductionReleaseGateWidget.style';
import { useFinanceEngineProductionReleaseGateLogic } from './FinanceEngineProductionReleaseGateWidget.logic';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export const FinanceEngineProductionReleaseGateWidget: React.FC = () => {
  const {
    t,
    isRtl,
    requirements,
    isVerified,
    isSigned,
    handleVerify,
    handleSignoff
  } = useFinanceEngineProductionReleaseGateLogic();

  return (
    <WidgetContainer $isRtl={isRtl} $isSigned={isSigned}>
      <WidgetHeader>
        <div>
          <h3>{t.title}</h3>
          <p>{t.subtitle}</p>
        </div>
        {isSigned ? (
          <ShieldCheck size={32} color="var(--color-10b981, #10B981)" />
        ) : (
          <ShieldAlert size={32} color="var(--accent-gold, #D4AF37)" />
        )}
      </WidgetHeader>

      <StatusBanner $isSigned={isSigned}>
        {isSigned ? <ShieldCheck className="icon" size={24} /> : <ShieldAlert className="icon" size={24} />}
        <span className="text">{isSigned ? t.status_unlocked : t.status_locked}</span>
      </StatusBanner>

      <RequirementsList>
        {requirements.map((req) => (
          <RequirementItem key={req.id} $passed={req.passed}>
            {req.passed ? <CheckCircle className="icon" size={20} /> : <XCircle className="icon" size={20} />}
            <span className="label">{req.label}</span>
          </RequirementItem>
        ))}
      </RequirementsList>

      <ActionsContainer>
        <ActionButton 
          $variant="secondary" 
          onClick={handleVerify}
          disabled={isVerified}
        >
          <ShieldCheck size={18} />
          {t.btn_verify}
        </ActionButton>
        <ActionButton 
          $variant={isVerified && !isSigned ? 'primary' : 'disabled'} 
          onClick={handleSignoff}
          disabled={!isVerified || isSigned}
        >
          <ShieldAlert size={18} />
          {t.btn_signoff}
        </ActionButton>
      </ActionsContainer>
    </WidgetContainer>
  );
};
