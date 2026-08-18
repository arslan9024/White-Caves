/** MultiPartySigningTracker.tsx — View Layer */
import React, { FC } from 'react';
import { useMultiPartySigningTrackerLogic } from './logic/MultiPartySigningTracker.logic';
import type { SignerStatus } from './logic/MultiPartySigningTracker.logic';
import { Root, Title, Progress, SignerRow, RoleBadge, SignerInfo, SignerName, SignerEmail, StatusChip, AdvanceBtn, CompleteBanner } from './styles/MultiPartySigningTracker.style';

const STATUS_LABEL: Record<SignerStatus, string> = { pending: '⬜ Pending', sent: '📤 Sent', opened: '👀 Opened', signed: '✅ Signed', declined: '❌ Declined' };
const CAN_ADVANCE: SignerStatus[] = ['pending', 'sent', 'opened'];

export const MultiPartySigningTracker: FC = () => {
  const { signers, advanceStatus, signedCount, allSigned } = useMultiPartySigningTrackerLogic();
  return (
    <Root data-testid="multi-party-signing-tracker">
      <Title>📝 Multi-Party Signing Workflow</Title>
      <Progress>{signedCount} / {signers.length} parties signed</Progress>
      {signers.map((s) => (
        <SignerRow key={s.id}>
          <RoleBadge>{s.role}</RoleBadge>
          <SignerInfo>
            <SignerName>{s.name}</SignerName>
            <SignerEmail>{s.email}{s.signedAt && ` · Signed ${s.signedAt}`}</SignerEmail>
          </SignerInfo>
          <StatusChip $status={s.status}>{STATUS_LABEL[s.status]}</StatusChip>
          {CAN_ADVANCE.includes(s.status) && (
            <AdvanceBtn onClick={() => advanceStatus(s.id)}>→</AdvanceBtn>
          )}
        </SignerRow>
      ))}
      {allSigned && <CompleteBanner>🎉 All parties have signed! Document is fully executed.</CompleteBanner>}
    </Root>
  );
};
export default MultiPartySigningTracker;
