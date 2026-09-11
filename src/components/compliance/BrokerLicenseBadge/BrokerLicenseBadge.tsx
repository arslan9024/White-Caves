import React, { FC } from 'react';
import { Award, ShieldCheck, CheckCircle } from 'lucide-react';
import { useBrokerLicenseLogic } from './BrokerLicenseBadge.logic';
import { useTranslation } from '../../../hooks/useTranslation';
import {
  BadgeContainer,
  IconWrapper,
  ContentWrapper,
  Title,
  DetailRow,
  VerificationBadge
} from './BrokerLicenseBadge.style';

export const BrokerLicenseBadge: FC = () => {
  const { isVerified, orn, det, toggleVerification } = useBrokerLicenseLogic();
  const { t } = useTranslation();

  return (
    <BadgeContainer role="region" aria-label="RERA Broker License Verification" onClick={toggleVerification}>
      <IconWrapper $verified={isVerified}>
        {isVerified ? <ShieldCheck size={28} /> : <Award size={28} />}
      </IconWrapper>
      <ContentWrapper>
        <Title>
          {t('compliance.broker_license') || 'White Caves Real Estate LLC'}
          {isVerified && (
            <VerificationBadge title="Verified by DLD" aria-label="Verified">
              <CheckCircle size={14} /> Verified
            </VerificationBadge>
          )}
        </Title>
        <DetailRow>
          <span>RERA ORN: {orn}</span>
          <span>•</span>
          <span>DET: {det}</span>
        </DetailRow>
      </ContentWrapper>
    </BadgeContainer>
  );
};

export default BrokerLicenseBadge;
